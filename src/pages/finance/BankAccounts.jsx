
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Building2,
  Wallet,
  MoreHorizontal,
  Eye,
  Pencil,
  Power,
  X,
  ArrowUpRight,
  ArrowDownLeft,
  Landmark,
  CreditCard,
} from "lucide-react";
import "../../styles/finance.css";

const initialAccounts = [
  {
    id: "ACC-001",
    name: "Main Business Account",
    bank: "Access Bank",
    accountNumber: "**** **** 4821",
    type: "Bank",
    currency: "NGN",
    balance: 9850000,
    openingBalance: 7500000,
    status: "Active",
    description: "Primary business bank account",
  },
  {
    id: "ACC-002",
    name: "Operations Account",
    bank: "Zenith Bank",
    accountNumber: "**** **** 1936",
    type: "Bank",
    currency: "NGN",
    balance: 1280000,
    openingBalance: 1000000,
    status: "Active",
    description: "Daily operational payments",
  },
  {
    id: "ACC-003",
    name: "Main Cash Till",
    bank: "Physical Cash",
    accountNumber: "CASH-001",
    type: "Cash",
    currency: "NGN",
    balance: 1710000,
    openingBalance: 1500000,
    status: "Active",
    description: "Main cashier cash account",
  },
  {
    id: "ACC-004",
    name: "Petty Cash",
    bank: "Physical Cash",
    accountNumber: "CASH-002",
    type: "Cash",
    currency: "NGN",
    balance: 250000,
    openingBalance: 200000,
    status: "Active",
    description: "Small approved business expenses",
  },
];

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const emptyForm = {
  name: "",
  bank: "",
  accountNumber: "",
  type: "Bank",
  currency: "NGN",
  openingBalance: "",
  description: "",
};

export default function BankAccounts() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const totalBalance = accounts
    .filter((account) => account.status === "Active")
    .reduce((sum, account) => sum + account.balance, 0);

  const bankBalance = accounts
    .filter(
      (account) => account.type === "Bank" && account.status === "Active"
    )
    .reduce((sum, account) => sum + account.balance, 0);

  const cashBalance = accounts
    .filter(
      (account) => account.type === "Cash" && account.status === "Active"
    )
    .reduce((sum, account) => sum + account.balance, 0);

  const filteredAccounts = useMemo(() => {
    const term = search.toLowerCase().trim();

    return accounts.filter((account) => {
      const matchesSearch =
        account.name.toLowerCase().includes(term) ||
        account.bank.toLowerCase().includes(term) ||
        account.accountNumber.toLowerCase().includes(term) ||
        account.id.toLowerCase().includes(term);

      const matchesType =
        typeFilter === "All" || account.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" || account.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [accounts, search, typeFilter, statusFilter]);

  const openCreateModal = () => {
    setEditingAccount(null);
    setForm(emptyForm);
    setError("");
    setModal("form");
  };

  const openEditModal = (account) => {
    setEditingAccount(account);
    setForm({
      name: account.name,
      bank: account.bank,
      accountNumber: account.accountNumber,
      type: account.type,
      currency: account.currency,
      openingBalance: String(account.openingBalance),
      description: account.description || "",
    });
    setError("");
    setModal("form");
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter an account name.");
      return;
    }

    if (!form.bank.trim()) {
      setError("Please enter the bank or account provider.");
      return;
    }

    if (!form.accountNumber.trim()) {
      setError("Please enter an account number or reference.");
      return;
    }

    const openingBalance = Number(form.openingBalance);

    if (
      form.openingBalance === "" ||
      !Number.isFinite(openingBalance) ||
      openingBalance < 0
    ) {
      setError("Enter a valid opening balance.");
      return;
    }

    if (editingAccount) {
      setAccounts((current) =>
        current.map((account) =>
          account.id === editingAccount.id
            ? {
                ...account,
                name: form.name.trim(),
                bank: form.bank.trim(),
                accountNumber: form.accountNumber.trim(),
                type: form.type,
                currency: form.currency,
                openingBalance,
                description: form.description.trim(),
              }
            : account
        )
      );
    } else {
      const newAccount = {
        id: `ACC-${String(Date.now()).slice(-6)}`,
        name: form.name.trim(),
        bank: form.bank.trim(),
        accountNumber: form.accountNumber.trim(),
        type: form.type,
        currency: form.currency,
        openingBalance,
        balance: openingBalance,
        status: "Active",
        description: form.description.trim(),
      };

      setAccounts((current) => [newAccount, ...current]);
    }

    setModal("");
  };

  const toggleAccountStatus = (account) => {
    const nextStatus = account.status === "Active" ? "Inactive" : "Active";

    setAccounts((current) =>
      current.map((item) =>
        item.id === account.id ? { ...item, status: nextStatus } : item
      )
    );

    setSelectedAccount((current) =>
      current?.id === account.id
        ? { ...current, status: nextStatus }
        : current
    );
  };

  const closeModal = () => {
    setModal("");
    setSelectedAccount(null);
    setError("");
  };

  return (
    <div className="bank-accounts-page">
      <div className="bank-accounts-header">
        <div>
          <div className="bank-accounts-breadcrumb">
            Finance <span>/</span> Bank Accounts
          </div>
          <h1>Bank Accounts</h1>
          <p>
            Manage your business bank accounts, cash accounts and balances.
          </p>
        </div>

        <button className="bank-account-primary-btn" onClick={openCreateModal}>
          <Plus size={18} />
          Add Account
        </button>
      </div>

      <div className="bank-account-summary">
        <div className="bank-account-summary-card">
          <div className="bank-account-summary-top">
            <span className="bank-account-summary-icon total">
              <Wallet size={20} />
            </span>
            <span className="bank-account-summary-label">
              Total Active Balance
            </span>
          </div>
          <h2>{formatMoney(totalBalance)}</h2>
          <p>{accounts.filter((a) => a.status === "Active").length} active accounts</p>
        </div>

        <div className="bank-account-summary-card">
          <div className="bank-account-summary-top">
            <span className="bank-account-summary-icon bank">
              <Landmark size={20} />
            </span>
            <span className="bank-account-summary-label">Bank Balance</span>
          </div>
          <h2>{formatMoney(bankBalance)}</h2>
          <p>
            {accounts.filter((a) => a.type === "Bank" && a.status === "Active").length} bank accounts
          </p>
        </div>

        <div className="bank-account-summary-card">
          <div className="bank-account-summary-top">
            <span className="bank-account-summary-icon cash">
              <CreditCard size={20} />
            </span>
            <span className="bank-account-summary-label">Cash Balance</span>
          </div>
          <h2>{formatMoney(cashBalance)}</h2>
          <p>
            {accounts.filter((a) => a.type === "Cash" && a.status === "Active").length} cash accounts
          </p>
        </div>
      </div>

      <div className="bank-account-content-card">
        <div className="bank-account-content-heading">
          <div>
            <h2>All Accounts</h2>
            <p>View and manage your organisation’s financial accounts.</p>
          </div>
          <span className="bank-account-count">{filteredAccounts.length} accounts</span>
        </div>

        <div className="bank-account-toolbar">
          <div className="bank-account-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search account, bank or number..."
            />
          </div>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            <option value="All">All account types</option>
            <option value="Bank">Bank</option>
            <option value="Cash">Cash</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="bank-account-table-wrap">
          <table className="bank-account-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Account Number</th>
                <th>Type</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.id}>
                  <td>
                    <div className="bank-account-name-cell">
                      <span className={`bank-account-row-icon ${account.type.toLowerCase()}`}>
                        {account.type === "Bank" ? (
                          <Building2 size={18} />
                        ) : (
                          <Wallet size={18} />
                        )}
                      </span>
                      <div>
                        <strong>{account.name}</strong>
                        <span>{account.bank}</span>
                      </div>
                    </div>
                  </td>
                  <td className="bank-account-number">{account.accountNumber}</td>
                  <td>
                    <span className={`bank-account-type ${account.type.toLowerCase()}`}>
                      {account.type}
                    </span>
                  </td>
                  <td className="bank-account-balance">
                    {formatMoney(account.balance)}
                  </td>
                  <td>
                    <span className={`bank-account-status ${account.status.toLowerCase()}`}>
                      <i />
                      {account.status}
                    </span>
                  </td>
                  <td>
                    <div className="bank-account-actions">
                      <button
                        title="View account"
                        onClick={() => {
                          setSelectedAccount(account);
                          setModal("details");
                        }}
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        title="Edit account"
                        onClick={() => openEditModal(account)}
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        title={account.status === "Active" ? "Deactivate" : "Activate"}
                        onClick={() => toggleAccountStatus(account)}
                      >
                        <Power size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAccounts.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <div className="bank-account-empty">
                      <Wallet size={28} />
                      <strong>No accounts found</strong>
                      <span>Try changing your search or filters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bank-account-table-footer">
          Showing {filteredAccounts.length} of {accounts.length} accounts
        </div>
      </div>

      {modal === "form" && (
        <div className="bank-account-modal-overlay" onClick={closeModal}>
          <div
            className="bank-account-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bank-account-modal-header">
              <div>
                <h2>{editingAccount ? "Edit Account" : "Add Account"}</h2>
                <p>
                  {editingAccount
                    ? "Update the account information."
                    : "Add a bank or cash account to your organisation."}
                </p>
              </div>
              <button onClick={closeModal} className="bank-account-modal-close">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="bank-account-form-grid">
                <label>
                  Account Name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="e.g. Main Business Account"
                  />
                </label>

                <label>
                  Account Type *
                  <select name="type" value={form.type} onChange={handleFormChange}>
                    <option value="Bank">Bank</option>
                    <option value="Cash">Cash</option>
                  </select>
                </label>

                <label>
                  Bank / Provider *
                  <input
                    name="bank"
                    value={form.bank}
                    onChange={handleFormChange}
                    placeholder="e.g. Access Bank"
                  />
                </label>

                <label>
                  Account Number / Reference *
                  <input
                    name="accountNumber"
                    value={form.accountNumber}
                    onChange={handleFormChange}
                    placeholder="Enter account number"
                  />
                </label>

                <label>
                  Currency
                  <select
                    name="currency"
                    value={form.currency}
                    onChange={handleFormChange}
                  >
                    <option value="NGN">NGN — Nigerian Naira</option>
                  </select>
                </label>

                <label>
                  Opening Balance *
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="openingBalance"
                    value={form.openingBalance}
                    onChange={handleFormChange}
                    placeholder="0.00"
                  />
                </label>

                <label className="bank-account-form-full">
                  Description
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    placeholder="Optional account description"
                    rows="3"
                  />
                </label>
              </div>

              {error && <div className="bank-account-form-error">{error}</div>}

              <div className="bank-account-modal-footer">
                <button type="button" className="bank-account-secondary-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="bank-account-primary-btn">
                  {editingAccount ? "Save Changes" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === "details" && selectedAccount && (
        <div className="bank-account-modal-overlay" onClick={closeModal}>
          <div
            className="bank-account-modal bank-account-details-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bank-account-modal-header">
              <div>
                <h2>Account Details</h2>
                <p>{selectedAccount.id}</p>
              </div>
              <button onClick={closeModal} className="bank-account-modal-close">
                <X size={20} />
              </button>
            </div>

            <div className="bank-account-details-banner">
              <span className={`bank-account-row-icon ${selectedAccount.type.toLowerCase()}`}>
                {selectedAccount.type === "Bank" ? <Building2 size={20} /> : <Wallet size={20} />}
              </span>
              <div>
                <strong>{selectedAccount.name}</strong>
                <span>{selectedAccount.bank}</span>
              </div>
              <span className={`bank-account-status ${selectedAccount.status.toLowerCase()}`}>
                <i />
                {selectedAccount.status}
              </span>
            </div>

            <div className="bank-account-detail-balance">
              <span>Current Balance</span>
              <h2>{formatMoney(selectedAccount.balance)}</h2>
            </div>

            <div className="bank-account-detail-grid">
              <div>
                <span>Account Number</span>
                <strong>{selectedAccount.accountNumber}</strong>
              </div>
              <div>
                <span>Account Type</span>
                <strong>{selectedAccount.type}</strong>
              </div>
              <div>
                <span>Opening Balance</span>
                <strong>{formatMoney(selectedAccount.openingBalance)}</strong>
              </div>
              <div>
                <span>Currency</span>
                <strong>{selectedAccount.currency}</strong>
              </div>
              <div className="full">
                <span>Description</span>
                <strong>{selectedAccount.description || "No description provided"}</strong>
              </div>
            </div>

            <div className="bank-account-detail-actions">
              <button
                className="bank-account-secondary-btn"
                onClick={() => openEditModal(selectedAccount)}
              >
                <Pencil size={16} />
                Edit Account
              </button>
              <button
                className="bank-account-primary-btn"
                onClick={() => toggleAccountStatus(selectedAccount)}
              >
                <Power size={16} />
                {selectedAccount.status === "Active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
