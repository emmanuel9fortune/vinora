
import { useMemo, useState } from "react";
import {
  ShieldCheck,
  Wallet,
  Users,
  AlertTriangle,
  Search,
  Plus,
  X,
  Check,
  Ban,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  FileText,
} from "lucide-react";
import "../../styles/customers.css";

const initialAccounts = [
  {
    id: "CUS-0001",
    name: "John Adebayo",
    phone: "0803 456 7890",
    creditEnabled: true,
    creditLimit: 150000,
    outstanding: 43000,
    terms: "30 days",
    status: "Active",
  },
  {
    id: "CUS-0002",
    name: "Wellness Family Clinic",
    phone: "0806 123 4567",
    creditEnabled: true,
    creditLimit: 250000,
    outstanding: 185000,
    terms: "30 days",
    status: "Active",
  },
  {
    id: "CUS-0003",
    name: "Michael Eze",
    phone: "0812 555 9087",
    creditEnabled: true,
    creditLimit: 80000,
    outstanding: 72000,
    terms: "14 days",
    status: "Active",
  },
  {
    id: "CUS-0004",
    name: "Grace Okafor",
    phone: "0701 234 5678",
    creditEnabled: true,
    creditLimit: 50000,
    outstanding: 18500,
    terms: "14 days",
    status: "Active",
  },
  {
    id: "CUS-0005",
    name: "Prime Health Centre",
    phone: "0809 777 3210",
    creditEnabled: false,
    creditLimit: 200000,
    outstanding: 85000,
    terms: "30 days",
    status: "Blocked",
  },
  {
    id: "CUS-0006",
    name: "Emeka Pharmacy",
    phone: "0814 222 1100",
    creditEnabled: true,
    creditLimit: 100000,
    outstanding: 12000,
    terms: "21 days",
    status: "Active",
  },
];

const initialRequests = [
  {
    id: "CR-2026-001",
    customerId: "CUS-0002",
    customerName: "Wellness Family Clinic",
    currentLimit: 250000,
    requestedLimit: 400000,
    reason: "Increase monthly purchasing capacity",
    requestedBy: "Organisation Admin",
    date: "2026-11-24",
    status: "Pending",
  },
  {
    id: "CR-2026-002",
    customerId: "CUS-0004",
    customerName: "Grace Okafor",
    currentLimit: 50000,
    requestedLimit: 75000,
    reason: "Regular customer with consistent payment history",
    requestedBy: "Manager",
    date: "2026-11-23",
    status: "Pending",
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

const getUtilisation = (account) =>
  account.creditLimit > 0
    ? Math.min(100, Math.round((account.outstanding / account.creditLimit) * 100))
    : 0;

function CreditStatus({ account }) {
  if (!account.creditEnabled || account.status === "Blocked") {
    return <span className="credit-status blocked">Blocked</span>;
  }

  if (getUtilisation(account) >= 80) {
    return <span className="credit-status warning">Near limit</span>;
  }

  return <span className="credit-status active">Active</span>;
}

export default function CustomerCredit() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tab, setTab] = useState("accounts");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({
    customerId: "",
    requestedLimit: "",
    reason: "",
  });
  const [formError, setFormError] = useState("");

  const pendingRequests = requests.filter(
    (request) => request.status === "Pending"
  );

  const stats = useMemo(() => {
    const creditAccounts = accounts.filter((account) => account.creditEnabled);

    return {
      exposure: creditAccounts.reduce(
        (sum, account) => sum + account.outstanding,
        0
      ),
      available: creditAccounts.reduce(
        (sum, account) =>
          sum + Math.max(0, account.creditLimit - account.outstanding),
        0
      ),
      nearLimit: creditAccounts.filter(
        (account) => getUtilisation(account) >= 80
      ).length,
      blocked: accounts.filter(
        (account) => !account.creditEnabled || account.status === "Blocked"
      ).length,
      pending: pendingRequests.length,
    };
  }, [accounts, pendingRequests.length]);

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(search.toLowerCase()) ||
      account.id.toLowerCase().includes(search.toLowerCase()) ||
      account.phone.includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" &&
        account.creditEnabled &&
        account.status === "Active") ||
      (statusFilter === "blocked" &&
        (!account.creditEnabled || account.status === "Blocked")) ||
      (statusFilter === "near-limit" &&
        account.creditEnabled &&
        getUtilisation(account) >= 80);

    return matchesSearch && matchesStatus;
  });

  const openRequestModal = (account = null) => {
    setRequestForm({
      customerId: account?.id || "",
      requestedLimit: account ? String(account.creditLimit) : "",
      reason: "",
    });
    setFormError("");
    setShowRequestModal(true);
  };

  const submitCreditRequest = (event) => {
    event.preventDefault();

    const account = accounts.find(
      (item) => item.id === requestForm.customerId
    );
    const requestedLimit = Number(requestForm.requestedLimit);

    if (!account) {
      setFormError("Please select a customer.");
      return;
    }

    if (!requestedLimit || requestedLimit <= account.creditLimit) {
      setFormError("The requested limit must be greater than the current limit.");
      return;
    }

    if (!requestForm.reason.trim()) {
      setFormError("Please provide a reason for this request.");
      return;
    }

    const alreadyPending = requests.some(
      (request) =>
        request.customerId === account.id &&
        request.status === "Pending"
    );

    if (alreadyPending) {
      setFormError("This customer already has a pending credit request.");
      return;
    }

    const newRequest = {
      id: `CR-${Date.now()}`,
      customerId: account.id,
      customerName: account.name,
      currentLimit: account.creditLimit,
      requestedLimit,
      reason: requestForm.reason.trim(),
      requestedBy: "Current User",
      date: new Date().toISOString().slice(0, 10),
      status: "Pending",
    };

    setRequests((prev) => [newRequest, ...prev]);
    setShowRequestModal(false);
    setTab("requests");
  };

  const updateRequestStatus = (requestId, status) => {
    const request = requests.find((item) => item.id === requestId);
    if (!request || request.status !== "Pending") return;

    if (status === "Approved") {
      setAccounts((prev) =>
        prev.map((account) =>
          account.id === request.customerId
            ? {
                ...account,
                creditLimit: request.requestedLimit,
                creditEnabled: true,
                status: "Active",
              }
            : account
        )
      );
    }

    setRequests((prev) =>
      prev.map((item) =>
        item.id === requestId ? { ...item, status } : item
      )
    );
  };

  const toggleCredit = (accountId) => {
    setAccounts((prev) =>
      prev.map((account) => {
        if (account.id !== accountId) return account;

        const enable = !account.creditEnabled;

        return {
          ...account,
          creditEnabled: enable,
          status: enable ? "Active" : "Blocked",
        };
      })
    );
  };

  return (
    <div className="customer-credit-page">
      <div className="customer-credit-header">
        <div>
          <div className="customer-credit-breadcrumb">
            Customers <span>/</span> Credit Management
          </div>
          <h1>Credit Management</h1>
          <p>
            Manage customer credit limits, account exposure and approval
            requests.
          </p>
        </div>

        <button
          className="customer-credit-primary-button"
          onClick={() => openRequestModal()}
        >
          <Plus size={17} />
          Request Credit Limit
        </button>
      </div>

      <div className="customer-credit-stats">
        <div className="customer-credit-stat-card">
          <div className="customer-credit-stat-top">
            <span>Total Credit Exposure</span>
            <div className="customer-credit-stat-icon green">
              <Wallet size={19} />
            </div>
          </div>
          <strong>{formatCurrency(stats.exposure)}</strong>
          <small>Outstanding on enabled credit accounts</small>
        </div>

        <div className="customer-credit-stat-card">
          <div className="customer-credit-stat-top">
            <span>Available Credit</span>
            <div className="customer-credit-stat-icon blue">
              <ArrowUpRight size={19} />
            </div>
          </div>
          <strong>{formatCurrency(stats.available)}</strong>
          <small>Remaining approved credit capacity</small>
        </div>

        <div className="customer-credit-stat-card">
          <div className="customer-credit-stat-top">
            <span>Near Credit Limit</span>
            <div className="customer-credit-stat-icon orange">
              <AlertTriangle size={19} />
            </div>
          </div>
          <strong>{stats.nearLimit}</strong>
          <small>Accounts using 80% or more</small>
        </div>

        <div className="customer-credit-stat-card">
          <div className="customer-credit-stat-top">
            <span>Blocked Accounts</span>
            <div className="customer-credit-stat-icon red">
              <Ban size={19} />
            </div>
          </div>
          <strong>{stats.blocked}</strong>
          <small>Credit currently disabled</small>
        </div>
      </div>

      <div className="customer-credit-notice">
        <div className="customer-credit-notice-icon">
          <ShieldCheck size={20} />
        </div>
        <div>
          <strong>Credit control protection</strong>
          <p>
            Credit sales should be blocked when credit is disabled or when the
            sale would exceed the customer's approved credit limit.
          </p>
        </div>
     
      </div>

      <div className="customer-credit-content">
        <div className="customer-credit-tabs">
          <button
            className={tab === "accounts" ? "active" : ""}
            onClick={() => setTab("accounts")}
          >
            Credit Accounts
            <span>{accounts.length}</span>
          </button>

          <button
            className={tab === "requests" ? "active" : ""}
            onClick={() => setTab("requests")}
          >
            Approval Requests
            <span>{pendingRequests.length}</span>
          </button>
        </div>

        {tab === "accounts" && (
          <>
            <div className="customer-credit-toolbar">
              <div className="customer-credit-search">
                <Search size={17} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search customer, ID or phone..."
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All accounts</option>
                <option value="active">Active credit</option>
                <option value="near-limit">Near credit limit</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <div className="customer-credit-table-wrap">
              <table className="customer-credit-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Credit Limit</th>
                    <th>Outstanding</th>
                    <th>Available Credit</th>
                    <th>Utilisation</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAccounts.map((account) => {
                    const utilisation = getUtilisation(account);
                    const available = Math.max(
                      0,
                      account.creditLimit - account.outstanding
                    );

                    return (
                      <tr key={account.id}>
                        <td>
                          <div className="customer-credit-customer">
                            <strong>{account.name}</strong>
                            <span>{account.id}</span>
                          </div>
                        </td>

                        <td>{formatCurrency(account.creditLimit)}</td>
                        <td className="credit-outstanding">
                          {formatCurrency(account.outstanding)}
                        </td>
                        <td>{formatCurrency(available)}</td>

                        <td>
                          <div className="credit-utilisation">
                            <div className="credit-utilisation-track">
                              <div
                                className={
                                  utilisation >= 80
                                    ? "credit-utilisation-fill warning"
                                    : "credit-utilisation-fill"
                                }
                                style={{ width: `${utilisation}%` }}
                              />
                            </div>
                            <span>{utilisation}%</span>
                          </div>
                        </td>

                        <td>
                          <CreditStatus account={account} />
                        </td>

                        <td>
                          <div className="customer-credit-row-actions">
                            <button
                              title="View account"
                              onClick={() => setSelectedAccount(account)}
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              title="Request limit increase"
                              onClick={() => openRequestModal(account)}
                            >
                              <ArrowUpRight size={16} />
                            </button>

                            <button
                              title={
                                account.creditEnabled
                                  ? "Disable credit"
                                  : "Enable credit"
                              }
                              onClick={() => toggleCredit(account.id)}
                            >
                              {account.creditEnabled ? (
                                <Ban size={16} />
                              ) : (
                                <Check size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredAccounts.length === 0 && (
                    <tr>
                      <td colSpan="7">
                        <div className="customer-credit-empty">
                          <Users size={25} />
                          <strong>No credit accounts found</strong>
                          <span>Try changing your search or filter.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="customer-credit-table-footer">
              Showing {filteredAccounts.length} of {accounts.length} credit
              accounts
            </div>
          </>
        )}

        {tab === "requests" && (
          <div className="customer-credit-requests">
            <div className="customer-credit-requests-heading">
              <div>
                <h2>Credit Limit Requests</h2>
                <p>Review and decide on customer credit limit changes.</p>
              </div>
              <span className="customer-credit-pending-count">
                <Clock size={15} />
                {pendingRequests.length} pending
              </span>
            </div>

            {requests.length === 0 ? (
              <div className="customer-credit-empty">
                <FileText size={25} />
                <strong>No credit requests yet</strong>
                <span>New credit limit requests will appear here.</span>
              </div>
            ) : (
              <div className="customer-credit-request-list">
                {requests.map((request) => (
                  <div className="customer-credit-request-card" key={request.id}>
                    <div className="customer-credit-request-top">
                      <div>
                        <strong>{request.customerName}</strong>
                        <span>
                          {request.id} · {request.date}
                        </span>
                      </div>

                      <span
                        className={`credit-status ${
                          request.status === "Pending"
                            ? "warning"
                            : request.status === "Approved"
                            ? "active"
                            : "blocked"
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>

                    <div className="customer-credit-request-amounts">
                      <div>
                        <span>Current limit</span>
                        <strong>
                          {formatCurrency(request.currentLimit)}
                        </strong>
                      </div>

                      <ArrowUpRight size={18} />

                      <div>
                        <span>Requested limit</span>
                        <strong>
                          {formatCurrency(request.requestedLimit)}
                        </strong>
                      </div>
                    </div>

                    <div className="customer-credit-request-reason">
                      <span>Reason</span>
                      <p>{request.reason}</p>
                    </div>

                    <div className="customer-credit-request-footer">
                      <span>Requested by {request.requestedBy}</span>

                      {request.status === "Pending" && (
                        <div>
                          <button
                            className="customer-credit-reject-button"
                            onClick={() =>
                              updateRequestStatus(request.id, "Rejected")
                            }
                          >
                            Reject
                          </button>
                          <button
                            className="customer-credit-approve-button"
                            onClick={() =>
                              updateRequestStatus(request.id, "Approved")
                            }
                          >
                            <Check size={15} />
                            Approve
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedAccount && (
        <div
          className="customer-credit-modal-overlay"
          onClick={() => setSelectedAccount(null)}
        >
          <div
            className="customer-credit-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="customer-credit-modal-header">
              <div>
                <span>Credit account</span>
                <h2>{selectedAccount.name}</h2>
                <p>{selectedAccount.id}</p>
              </div>
              <button onClick={() => setSelectedAccount(null)}>
                <X size={19} />
              </button>
            </div>

            <div className="customer-credit-detail-grid">
              <div>
                <span>Approved credit limit</span>
                <strong>
                  {formatCurrency(selectedAccount.creditLimit)}
                </strong>
              </div>
              <div>
                <span>Outstanding balance</span>
                <strong>
                  {formatCurrency(selectedAccount.outstanding)}
                </strong>
              </div>
              <div>
                <span>Available credit</span>
                <strong>
                  {formatCurrency(
                    Math.max(
                      0,
                      selectedAccount.creditLimit -
                        selectedAccount.outstanding
                    )
                  )}
                </strong>
              </div>
              <div>
                <span>Payment terms</span>
                <strong>{selectedAccount.terms}</strong>
              </div>
            </div>

            <div className="customer-credit-detail-contact">
              <span>Contact number</span>
              <strong>{selectedAccount.phone}</strong>
            </div>

            <div className="customer-credit-detail-utilisation">
              <div>
                <span>Credit utilisation</span>
                <strong>{getUtilisation(selectedAccount)}%</strong>
              </div>
              <div className="credit-utilisation-track">
                <div
                  className={
                    getUtilisation(selectedAccount) >= 80
                      ? "credit-utilisation-fill warning"
                      : "credit-utilisation-fill"
                  }
                  style={{
                    width: `${getUtilisation(selectedAccount)}%`,
                  }}
                />
              </div>
            </div>

            <div className="customer-credit-modal-actions">
              <button
                className="customer-credit-secondary-button"
                onClick={() => {
                  openRequestModal(selectedAccount);
                  setSelectedAccount(null);
                }}
              >
                Request Limit Increase
              </button>
              <button
                className="customer-credit-primary-button"
                onClick={() => setSelectedAccount(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showRequestModal && (
        <div
          className="customer-credit-modal-overlay"
          onClick={() => setShowRequestModal(false)}
        >
          <form
            className="customer-credit-modal customer-credit-request-form"
            onSubmit={submitCreditRequest}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="customer-credit-modal-header">
              <div>
                <span>Credit control</span>
                <h2>Request Credit Limit</h2>
                <p>Submit a credit limit increase for approval.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
              >
                <X size={19} />
              </button>
            </div>

            <label>
              Customer
              <select
                value={requestForm.customerId}
                onChange={(event) => {
                  const account = accounts.find(
                    (item) => item.id === event.target.value
                  );
                  setRequestForm((prev) => ({
                    ...prev,
                    customerId: event.target.value,
                    requestedLimit: account
                      ? String(account.creditLimit)
                      : "",
                  }));
                }}
                required
              >
                <option value="">Select customer</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.id})
                  </option>
                ))}
              </select>
            </label>

            {requestForm.customerId && (
              <div className="customer-credit-current-limit">
                Current limit:{" "}
                <strong>
                  {formatCurrency(
                    accounts.find(
                      (account) => account.id === requestForm.customerId
                    )?.creditLimit || 0
                  )}
                </strong>
              </div>
            )}

            <label>
              Requested credit limit (₦)
              <input
                type="number"
                min="1"
                step="1000"
                value={requestForm.requestedLimit}
                onChange={(event) =>
                  setRequestForm((prev) => ({
                    ...prev,
                    requestedLimit: event.target.value,
                  }))
                }
                placeholder="Enter proposed credit limit"
                required
              />
            </label>

            <label>
              Reason for request
              <textarea
                value={requestForm.reason}
                onChange={(event) =>
                  setRequestForm((prev) => ({
                    ...prev,
                    reason: event.target.value,
                  }))
                }
                placeholder="Explain why this credit limit should be increased..."
                rows="4"
                required
              />
            </label>

            {formError && (
              <div className="customer-credit-form-error">{formError}</div>
            )}

            <div className="customer-credit-modal-actions">
              <button
                type="button"
                className="customer-credit-secondary-button"
                onClick={() => setShowRequestModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="customer-credit-primary-button"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
