
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  UserRound,
  Wallet,
  History,
} from "lucide-react";
import "../../styles/customers.css";

const customersData = [
  {
    id: "CUS-0001",
    name: "John Adebayo",
    type: "Individual",
    phone: "0803 456 7890",
    email: "john.adebayo@example.com",
    address: "Ikeja, Lagos",
    totalPurchases: 485000,
    outstanding: 25000,
    creditLimit: 100000,
    creditEnabled: true,
    status: "Active",
    joined: "2026-02-12",
    notes: "Regular customer",
  },
  {
    id: "CUS-0002",
    name: "Grace Okafor",
    type: "Individual",
    phone: "0806 234 5678",
    email: "grace.okafor@example.com",
    address: "Surulere, Lagos",
    totalPurchases: 215000,
    outstanding: 0,
    creditLimit: 0,
    creditEnabled: false,
    status: "Active",
    joined: "2026-03-04",
    notes: "",
  },
  {
    id: "CUS-0003",
    name: "Wellness Family Clinic",
    type: "Business",
    phone: "0809 876 5432",
    email: "accounts@wellnessclinic.com",
    address: "Yaba, Lagos",
    totalPurchases: 1850000,
    outstanding: 185000,
    creditLimit: 300000,
    creditEnabled: true,
    status: "Active",
    joined: "2026-01-18",
    notes: "Monthly supply arrangement",
  },
  {
    id: "CUS-0004",
    name: "Michael Eze",
    type: "Individual",
    phone: "0812 345 6789",
    email: "michael.eze@example.com",
    address: "Maryland, Lagos",
    totalPurchases: 92000,
    outstanding: 12000,
    creditLimit: 50000,
    creditEnabled: true,
    status: "Active",
    joined: "2026-04-21",
    notes: "",
  },
  {
    id: "CUS-0005",
    name: "Prime Health Centre",
    type: "Business",
    phone: "0703 456 7891",
    email: "admin@primehealth.com",
    address: "Ogba, Lagos",
    totalPurchases: 960000,
    outstanding: 0,
    creditLimit: 200000,
    creditEnabled: true,
    status: "Active",
    joined: "2026-05-09",
    notes: "Approved business customer",
  },
  {
    id: "CUS-0006",
    name: "Esther Williams",
    type: "Individual",
    phone: "0902 111 2233",
    email: "esther.williams@example.com",
    address: "Gbagada, Lagos",
    totalPurchases: 67000,
    outstanding: 0,
    creditLimit: 0,
    creditEnabled: false,
    status: "Inactive",
    joined: "2026-06-15",
    notes: "",
  },
];

const accountTransactions = {
  "CUS-0001": [
    {
      id: "TXN-10582",
      date: "2026-11-20",
      description: "Medication purchase",
      reference: "INV-10582",
      type: "Sale",
      amount: 45000,
      method: "Bank Transfer",
      status: "Paid",
    },
    {
      id: "TXN-10521",
      date: "2026-11-16",
      description: "Credit sale",
      reference: "INV-10521",
      type: "Credit Sale",
      amount: 25000,
      method: "Credit",
      status: "Outstanding",
    },
    {
      id: "TXN-10480",
      date: "2026-11-12",
      description: "Payment received",
      reference: "PAY-10480",
      type: "Payment",
      amount: 30000,
      method: "Cash",
      status: "Completed",
    },
    {
      id: "TXN-10395",
      date: "2026-11-08",
      description: "Medication purchase",
      reference: "INV-10395",
      type: "Sale",
      amount: 62000,
      method: "POS Terminal",
      status: "Paid",
    },
    {
      id: "TXN-10342",
      date: "2026-11-02",
      description: "Credit sale",
      reference: "INV-10342",
      type: "Credit Sale",
      amount: 18000,
      method: "Credit",
      status: "Outstanding",
    },
    {
      id: "TXN-10288",
      date: "2026-10-28",
      description: "Payment received",
      reference: "PAY-10288",
      type: "Payment",
      amount: 20000,
      method: "Bank Transfer",
      status: "Completed",
    },
  ],
  "CUS-0002": [
    {
      id: "TXN-20582",
      date: "2026-11-21",
      description: "Medication purchase",
      reference: "INV-20582",
      type: "Sale",
      amount: 32000,
      method: "Cash",
      status: "Paid",
    },
    {
      id: "TXN-20521",
      date: "2026-11-17",
      description: "Medication purchase",
      reference: "INV-20521",
      type: "Sale",
      amount: 18500,
      method: "Bank Transfer",
      status: "Paid",
    },
  ],
  "CUS-0003": [
    {
      id: "TXN-30582",
      date: "2026-11-21",
      description: "Bulk medication supply",
      reference: "INV-30582",
      type: "Credit Sale",
      amount: 125000,
      method: "Credit",
      status: "Outstanding",
    },
    {
      id: "TXN-30521",
      date: "2026-11-15",
      description: "Account payment",
      reference: "PAY-30521",
      type: "Payment",
      amount: 200000,
      method: "Bank Transfer",
      status: "Completed",
    },
    {
      id: "TXN-30480",
      date: "2026-11-10",
      description: "Bulk medication supply",
      reference: "INV-30480",
      type: "Sale",
      amount: 350000,
      method: "Bank Transfer",
      status: "Paid",
    },
  ],
};

const defaultTransactions = [
  {
    id: "TXN-40582",
    date: "2026-11-18",
    description: "Medication purchase",
    reference: "INV-40582",
    type: "Sale",
    amount: 28000,
    method: "Cash",
    status: "Paid",
  },
  {
    id: "TXN-40521",
    date: "2026-11-10",
    description: "Medication purchase",
    reference: "INV-40521",
    type: "Sale",
    amount: 16500,
    method: "POS Terminal",
    status: "Paid",
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function CustomerDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");
  const [dateFilter, setDateFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const customer = customersData.find((item) => item.id === id);

  const transactions =
    accountTransactions[id] || defaultTransactions;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesType =
        typeFilter === "All" || transaction.type === typeFilter;

      let matchesDate = true;

      if (dateFilter !== "All") {
        const transactionDate = new Date(
          `${transaction.date}T00:00:00`
        );
        const today = new Date();
        const days = Number(dateFilter);
        const cutoff = new Date(today);
        cutoff.setDate(today.getDate() - days);
        matchesDate = transactionDate >= cutoff;
      }

      return matchesType && matchesDate;
    });
  }, [transactions, typeFilter, dateFilter]);

  if (!customer) {
    return (
      <div className="customer-details-page">
        <div className="customer-not-found">
          <UserRound size={35} />
          <h2>Customer not found</h2>
          <p>
            This customer record could not be found in the current demo
            dataset.
          </p>
          <Link to="/customers" className="customer-back-button">
            <ArrowLeft size={16} />
            Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  const creditUsed = customer.outstanding;
  const availableCredit = Math.max(
    0,
    customer.creditLimit - creditUsed
  );

  const creditUsagePercentage =
    customer.creditLimit > 0
      ? Math.min(
          100,
          (creditUsed / customer.creditLimit) * 100
        )
      : 0;

  const paymentTotal = transactions
    .filter((item) => item.type === "Payment")
    .reduce((total, item) => total + item.amount, 0);

  const salesCount = transactions.filter(
    (item) => item.type === "Sale" || item.type === "Credit Sale"
  ).length;

  const creditTransactions = transactions.filter(
    (item) => item.type === "Credit Sale"
  );

  const tabs = [
    "Overview",
    "Account Activity",
    "Sales",
    "Payments",
    "Credit & Debts",
  ];

  const exportTransactions = () => {
    const headers = [
      "Date",
      "Reference",
      "Description",
      "Type",
      "Payment Method",
      "Amount",
      "Status",
    ];

    const rows = filteredTransactions.map((item) => [
      item.date,
      item.reference,
      item.description,
      item.type,
      item.method,
      item.amount,
      item.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${customer.id}-account-history.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderTransactionTable = (items) => (
    <div className="customer-history-table-wrap">
      <table className="customer-history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Reference</th>
            <th>Description</th>
            <th>Type</th>
            <th>Payment Method</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((transaction) => (
            <tr key={transaction.id}>
              <td>{formatDate(transaction.date)}</td>
              <td className="customer-reference">
                {transaction.reference}
              </td>
              <td>{transaction.description}</td>
              <td>
                <span
                  className={`customer-transaction-type ${
                    transaction.type === "Payment"
                      ? "payment-type"
                      : transaction.type === "Credit Sale"
                      ? "credit-type"
                      : "sale-type"
                  }`}
                >
                  {transaction.type}
                </span>
              </td>
              <td>{transaction.method}</td>
              <td className="customer-transaction-amount">
                {formatCurrency(transaction.amount)}
              </td>
              <td>
                <span
                  className={`customer-transaction-status ${
                    transaction.status === "Outstanding"
                      ? "transaction-outstanding"
                      : "transaction-complete"
                  }`}
                >
                  {transaction.status === "Outstanding" ? (
                    <Clock3 size={12} />
                  ) : (
                    <CheckCircle2 size={12} />
                  )}
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}

          {items.length === 0 && (
            <tr>
              <td colSpan="7">
                <div className="customer-history-empty">
                  <FileText size={27} />
                  <strong>No transactions found</strong>
                  <span>
                    There are no records matching the selected filters.
                  </span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="customer-details-page">
      <div className="customer-details-breadcrumb">
        <Link to="/customers">Customers</Link>
        <span>/</span>
        <strong>{customer.name}</strong>
      </div>

      <div className="customer-details-header">
        <div className="customer-details-heading">
          <Link
            to="/customers"
            className="customer-back-link"
            title="Back to customers"
          >
            <ArrowLeft size={17} />
          </Link>

          <div>
            <h1>Customer Account</h1>
            <p>View customer information and account activity.</p>
          </div>
        </div>

        
        <div className="customers-header-actions">
          <Link
            to={`/customers/${id}/activity`}
            className="customer-details-history-link"
          >
            <History size={17} />
            Purchase History
          </Link>

          <button
            className="customer-export-button"
            onClick={exportTransactions}
          >
            <Download size={16} />
            Export History
          </button>
        </div>

      </div>

      <div className="customer-profile-card">
        <div className="customer-profile-main">
          <div
            className={`customer-profile-avatar ${
              customer.type === "Business" ? "business-profile" : ""
            }`}
          >
            {customer.type === "Business" ? (
              <Building2 size={27} />
            ) : (
              <UserRound size={27} />
            )}
          </div>

          <div className="customer-profile-identity">
            <div className="customer-profile-name-row">
              <h2>{customer.name}</h2>
              <span
                className={`customer-profile-status ${
                  customer.status === "Active"
                    ? "profile-active"
                    : "profile-inactive"
                }`}
              >
                <span />
                {customer.status}
              </span>
            </div>

            <div className="customer-profile-meta">
              <span>{customer.id}</span>
              <span>{customer.type}</span>
              <span>
                <CalendarDays size={13} />
                Joined {formatDate(customer.joined)}
              </span>
            </div>
          </div>
        </div>

        <div className="customer-profile-contact">
          <div>
            <Phone size={15} />
            <span>{customer.phone}</span>
          </div>
          <div>
            <Mail size={15} />
            <span>{customer.email || "No email provided"}</span>
          </div>
          <div>
            <MapPin size={15} />
            <span>{customer.address || "No address provided"}</span>
          </div>
        </div>
      </div>

      <div className="customer-account-stats">
        <div className="customer-account-stat">
          <div className="customer-account-stat-icon stat-purchases">
            <ShoppingBag size={19} />
          </div>
          <span>Total Purchases</span>
          <strong>{formatCurrency(customer.totalPurchases)}</strong>
          <small>{salesCount} recorded sales in sample history</small>
        </div>

        <div className="customer-account-stat">
          <div className="customer-account-stat-icon stat-payments">
            <Wallet size={19} />
          </div>
          <span>Payments Recorded</span>
          <strong>{formatCurrency(paymentTotal)}</strong>
          <small>Payments in sample transaction history</small>
        </div>

        <div className="customer-account-stat">
          <div className="customer-account-stat-icon stat-debt">
            <CreditCard size={19} />
          </div>
          <span>Outstanding Balance</span>
          <strong className="customer-debt-value">
            {formatCurrency(customer.outstanding)}
          </strong>
          <small>Unsettled customer balance</small>
        </div>

        <div className="customer-account-stat">
          <div className="customer-account-stat-icon stat-credit">
            <CheckCircle2 size={19} />
          </div>
          <span>Available Credit</span>
          <strong>{formatCurrency(availableCredit)}</strong>
          <small>
            {customer.creditEnabled ? "Credit enabled" : "Credit disabled"}
          </small>
        </div>
      </div>

      <div className="customer-details-content">
        <div className="customer-details-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Overview" && (
          <div className="customer-overview-grid">
            <div className="customer-content-card">
              <div className="customer-content-card-heading">
                <div>
                  <h3>Account Information</h3>
                  <p>Basic customer account details.</p>
                </div>
                <UserRound size={18} />
              </div>

              <div className="customer-information-list">
                <div>
                  <span>Customer ID</span>
                  <strong>{customer.id}</strong>
                </div>
                <div>
                  <span>Customer Type</span>
                  <strong>{customer.type}</strong>
                </div>
                <div>
                  <span>Phone Number</span>
                  <strong>{customer.phone}</strong>
                </div>
                <div>
                  <span>Email Address</span>
                  <strong>{customer.email || "Not provided"}</strong>
                </div>
                <div>
                  <span>Address</span>
                  <strong>{customer.address || "Not provided"}</strong>
                </div>
                <div>
                  <span>Registration Date</span>
                  <strong>{formatDate(customer.joined)}</strong>
                </div>
              </div>
            </div>

            <div className="customer-content-card">
              <div className="customer-content-card-heading">
                <div>
                  <h3>Credit Account Summary</h3>
                  <p>Credit access and outstanding position.</p>
                </div>
                <CreditCard size={18} />
              </div>

              <div className="customer-credit-summary">
                <div className="customer-credit-summary-top">
                  <span>Credit access</span>
                  <strong>
                    {customer.creditEnabled ? "Enabled" : "Disabled"}
                  </strong>
                </div>

                <div className="customer-credit-amounts">
                  <div>
                    <span>Credit limit</span>
                    <strong>{formatCurrency(customer.creditLimit)}</strong>
                  </div>
                  <div>
                    <span>Outstanding</span>
                    <strong>{formatCurrency(creditUsed)}</strong>
                  </div>
                </div>

                {customer.creditEnabled && (
                  <>
                    <div className="customer-credit-progress-heading">
                      <span>Credit utilisation</span>
                      <strong>
                        {creditUsagePercentage.toFixed(1)}%
                      </strong>
                    </div>
                    <div className="customer-credit-progress">
                      <span
                        style={{
                          width: `${creditUsagePercentage}%`,
                        }}
                      />
                    </div>
                    <div className="customer-credit-available">
                      <span>Available credit</span>
                      <strong>{formatCurrency(availableCredit)}</strong>
                    </div>
                  </>
                )}

                {!customer.creditEnabled && (
                  <div className="customer-credit-disabled-notice">
                    Credit purchases are not enabled for this customer.
                  </div>
                )}
              </div>
            </div>

            <div className="customer-content-card customer-recent-activity">
              <div className="customer-content-card-heading">
                <div>
                  <h3>Recent Account Activity</h3>
                  <p>Latest recorded customer transactions.</p>
                </div>
                <button
                  onClick={() => setActiveTab("Account Activity")}
                >
                  View all
                  <ArrowUpRight size={14} />
                </button>
              </div>

              <div className="customer-recent-list">
                {transactions.slice(0, 4).map((transaction) => (
                  <div
                    className="customer-recent-item"
                    key={transaction.id}
                  >
                    <div
                      className={`customer-recent-icon ${
                        transaction.type === "Payment"
                          ? "recent-payment"
                          : transaction.type === "Credit Sale"
                          ? "recent-credit"
                          : "recent-sale"
                      }`}
                    >
                      {transaction.type === "Payment" ? (
                        <ArrowDownLeft size={17} />
                      ) : (
                        <ArrowUpRight size={17} />
                      )}
                    </div>

                    <div className="customer-recent-description">
                      <strong>{transaction.description}</strong>
                      <span>
                        {transaction.reference} ·{" "}
                        {formatDate(transaction.date)}
                      </span>
                    </div>

                    <strong className="customer-recent-amount">
                      {formatCurrency(transaction.amount)}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="customer-content-card">
              <div className="customer-content-card-heading">
                <div>
                  <h3>Customer Notes</h3>
                  <p>Additional information about this customer.</p>
                </div>
                <FileText size={18} />
              </div>

              <p className="customer-notes-content">
                {customer.notes || "No additional notes have been recorded."}
              </p>
            </div>
          </div>
        )}

        {activeTab === "Account Activity" && (
          <div className="customer-content-card customer-activity-card">
            <div className="customer-content-card-heading">
              <div>
                <h3>Account Activity</h3>
                <p>All available transactions for this customer.</p>
              </div>
              <button onClick={exportTransactions}>
                <Download size={14} />
                Export CSV
              </button>
            </div>

            <div className="customer-history-filters">
              <select
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
              >
                <option value="All">All dates</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>

              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
              >
                <option value="All">All transaction types</option>
                <option value="Sale">Sales</option>
                <option value="Credit Sale">Credit sales</option>
                <option value="Payment">Payments</option>
              </select>
            </div>

            {renderTransactionTable(filteredTransactions)}
          </div>
        )}

        {activeTab === "Sales" && (
          <div className="customer-content-card customer-activity-card">
            <div className="customer-content-card-heading">
              <div>
                <h3>Customer Sales</h3>
                <p>Sales and credit sales recorded for this customer.</p>
              </div>
            </div>

            {renderTransactionTable(
              filteredTransactions.filter(
                (item) =>
                  item.type === "Sale" || item.type === "Credit Sale"
              )
            )}
          </div>
        )}

        {activeTab === "Payments" && (
          <div className="customer-content-card customer-activity-card">
            <div className="customer-content-card-heading">
              <div>
                <h3>Payment History</h3>
                <p>Payments received from this customer.</p>
              </div>
            </div>

            {renderTransactionTable(
              filteredTransactions.filter(
                (item) => item.type === "Payment"
              )
            )}
          </div>
        )}

        {activeTab === "Credit & Debts" && (
          <div className="customer-credit-page">
            <div className="customer-content-card">
              <div className="customer-content-card-heading">
                <div>
                  <h3>Credit Position</h3>
                  <p>Current credit account summary.</p>
                </div>
                <CreditCard size={18} />
              </div>

              <div className="customer-credit-position-grid">
                <div>
                  <span>Credit limit</span>
                  <strong>{formatCurrency(customer.creditLimit)}</strong>
                </div>
                <div>
                  <span>Outstanding balance</span>
                  <strong className="customer-debt-value">
                    {formatCurrency(customer.outstanding)}
                  </strong>
                </div>
                <div>
                  <span>Available credit</span>
                  <strong>{formatCurrency(availableCredit)}</strong>
                </div>
              </div>

              <div className="customer-credit-account-status">
                <span>Credit access</span>
                <strong>
                  {customer.creditEnabled ? "Enabled" : "Disabled"}
                </strong>
              </div>
            </div>

            <div className="customer-content-card customer-activity-card">
              <div className="customer-content-card-heading">
                <div>
                  <h3>Credit Sales History</h3>
                  <p>Sales that were recorded against customer credit.</p>
                </div>
              </div>

              {renderTransactionTable(creditTransactions)}
            </div>

            <div className="customer-credit-notice">
              <Clock3 size={17} />
              <span>
                This is a demonstration account view. Actual debt ageing,
                due dates, payment allocation, credit blocking and settlement
                records will be calculated from verified backend transactions.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDetails;
