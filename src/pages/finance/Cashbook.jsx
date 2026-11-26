
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Banknote,
  ChevronDown,
  Download,
  Landmark,
  Plus,
  Search,
  Wallet,
  X,
} from "lucide-react";
import "../../styles/finance.css";

const initialAccounts = [
  { id: "cash-main", name: "Main Cash Till", type: "Cash", balance: 2990000 },
  { id: "bank-business", name: "Business Bank", type: "Bank", balance: 9850000 },
  { id: "bank-reserve", name: "Reserve Account", type: "Bank", balance: 1280000 },
];

const initialEntries = [
  {
    id: "CB-1048",
    date: "2026-11-26",
    accountId: "bank-business",
    accountName: "Business Bank",
    type: "receipt",
    description: "Retail sales settlement",
    category: "Sales income",
    reference: "SALE-1048",
    amount: 185000,
    balance: 9850000,
    method: "Bank transfer",
  },
  {
    id: "CB-1047",
    date: "2026-11-26",
    accountId: "bank-business",
    accountName: "Business Bank",
    type: "payment",
    description: "Supplier payment",
    category: "Inventory purchase",
    reference: "SUP-INV-092",
    amount: 320000,
    balance: 9665000,
    method: "Bank transfer",
  },
  {
    id: "CB-1046",
    date: "2026-11-25",
    accountId: "cash-main",
    accountName: "Main Cash Till",
    type: "receipt",
    description: "Customer debt payment",
    category: "Customer payment",
    reference: "CUS-PAY-118",
    amount: 75000,
    balance: 2990000,
    method: "Cash",
  },
  {
    id: "CB-1045",
    date: "2026-11-25",
    accountId: "bank-business",
    accountName: "Business Bank",
    type: "payment",
    description: "Electricity bill",
    category: "Utilities",
    reference: "UTIL-011",
    amount: 48000,
    balance: 9985000,
    method: "Bank transfer",
  },
  {
    id: "CB-1044",
    date: "2026-11-24",
    accountId: "cash-main",
    accountName: "Main Cash Till",
    type: "receipt",
    description: "Cash sales",
    category: "Sales income",
    reference: "SALE-1044",
    amount: 125000,
    balance: 2915000,
    method: "Cash",
  },
  {
    id: "CB-1043",
    date: "2026-11-24",
    accountId: "bank-reserve",
    accountName: "Reserve Account",
    type: "transfer-in",
    description: "Transfer from business bank",
    category: "Account transfer",
    reference: "TRF-021",
    amount: 200000,
    balance: 1280000,
    method: "Internal transfer",
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("en-NG", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const transactionLabels = {
  receipt: "Money received",
  payment: "Money paid",
  "transfer-in": "Transfer received",
  "transfer-out": "Transfer sent",
};

export default function Cashbook() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [entries, setEntries] = useState(initialEntries);
  const [search, setSearch] = useState("");
  const [accountFilter, setAccountFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [modalType, setModalType] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    accountId: initialAccounts[0].id,
    destinationId: initialAccounts[1].id,
    description: "",
    category: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    reference: "",
    method: "Cash",
    note: "",
  });

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  const cashBalance = accounts
    .filter((account) => account.type === "Cash")
    .reduce((sum, account) => sum + account.balance, 0);

  const bankBalance = accounts
    .filter((account) => account.type === "Bank")
    .reduce((sum, account) => sum + account.balance, 0);

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesSearch =
        !query ||
        entry.description.toLowerCase().includes(query) ||
        entry.id.toLowerCase().includes(query) ||
        entry.reference.toLowerCase().includes(query) ||
        entry.accountName.toLowerCase().includes(query);

      const matchesAccount =
        accountFilter === "all" || entry.accountId === accountFilter;

      const matchesType =
        typeFilter === "all" || entry.type === typeFilter;

      const matchesDate = !dateFilter || entry.date === dateFilter;

      return (
        matchesSearch &&
        matchesAccount &&
        matchesType &&
        matchesDate
      );
    });
  }, [entries, search, accountFilter, typeFilter, dateFilter]);

  const openModal = (type) => {
    setModalType(type);
    setError("");
    setForm({
      accountId: accounts[0]?.id || "",
      destinationId: accounts[1]?.id || accounts[0]?.id || "",
      description: "",
      category: type === "transfer" ? "Account transfer" : "",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
      reference: "",
      method: type === "transfer" ? "Internal transfer" : "Cash",
      note: "",
    });
  };

  const closeModal = () => {
    setModalType("");
    setError("");
  };

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const amount = Number(form.amount);
    const source = accounts.find((account) => account.id === form.accountId);
    const destination = accounts.find(
      (account) => account.id === form.destinationId
    );

    if (!source) {
      setError("Select an account.");
      return;
    }

    if (!form.description.trim()) {
      setError("Enter a transaction description.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    if (!form.date) {
      setError("Select the transaction date.");
      return;
    }

    if (modalType === "transfer") {
      if (!destination || destination.id === source.id) {
        setError("Choose a different destination account.");
        return;
      }

      if (amount > source.balance) {
        setError("The source account does not have enough funds.");
        return;
      }

      const transferReference =
        form.reference.trim() || `TRF-${Date.now().toString().slice(-6)}`;

      const outEntry = {
        id: `CB-${Date.now().toString().slice(-6)}-OUT`,
        date: form.date,
        accountId: source.id,
        accountName: source.name,
        type: "transfer-out",
        description: `Transfer to ${destination.name}`,
        category: "Account transfer",
        reference: transferReference,
        amount,
        balance: source.balance - amount,
        method: "Internal transfer",
      };

      const inEntry = {
        id: `CB-${Date.now().toString().slice(-6)}-IN`,
        date: form.date,
        accountId: destination.id,
        accountName: destination.name,
        type: "transfer-in",
        description: `Transfer from ${source.name}`,
        category: "Account transfer",
        reference: transferReference,
        amount,
        balance: destination.balance + amount,
        method: "Internal transfer",
      };

      setAccounts((current) =>
        current.map((account) => {
          if (account.id === source.id) {
            return { ...account, balance: account.balance - amount };
          }
          if (account.id === destination.id) {
            return { ...account, balance: account.balance + amount };
          }
          return account;
        })
      );

      setEntries((current) => [inEntry, outEntry, ...current]);
      closeModal();
      return;
    }

    if (modalType === "payment" && amount > source.balance) {
      setError("This account does not have enough funds.");
      return;
    }

    const isReceipt = modalType === "receipt";
    const movement = isReceipt ? amount : -amount;
    const newBalance = source.balance + movement;

    const newEntry = {
      id: `CB-${Date.now().toString().slice(-6)}`,
      date: form.date,
      accountId: source.id,
      accountName: source.name,
      type: isReceipt ? "receipt" : "payment",
      description: form.description.trim(),
      category: form.category || (isReceipt ? "Other income" : "Other expense"),
      reference: form.reference.trim() || "—",
      amount,
      balance: newBalance,
      method: form.method,
    };

    setAccounts((current) =>
      current.map((account) =>
        account.id === source.id
          ? { ...account, balance: newBalance }
          : account
      )
    );

    setEntries((current) => [newEntry, ...current]);
    closeModal();
  };

  const exportCsv = () => {
    const headers = [
      "Entry ID",
      "Date",
      "Account",
      "Type",
      "Description",
      "Category",
      "Reference",
      "Amount",
      "Payment Method",
    ];

    const rows = filteredEntries.map((entry) => [
      entry.id,
      entry.date,
      entry.accountName,
      transactionLabels[entry.type],
      entry.description,
      entry.category,
      entry.reference,
      entry.amount,
      entry.method,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "vinora-cashbook.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const modalTitle =
    modalType === "receipt"
      ? "Record money received"
      : modalType === "payment"
      ? "Record money paid"
      : "Transfer between accounts";

  return (
    <div className="cashbook-page">
      <div className="cashbook-header">
        <div>
          <Link to="/finance" className="cashbook-back-link">
            <ArrowLeft size={16} />
            Finance Overview
          </Link>
          <h1>Cashbook</h1>
          <p>Track cash and bank movements across your accounts.</p>
        </div>

        <div className="cashbook-header-actions">
          <button className="cashbook-button secondary" onClick={exportCsv}>
            <Download size={17} />
            Export CSV
          </button>
          <button
            className="cashbook-button primary"
            onClick={() => openModal("receipt")}
          >
            <Plus size={17} />
            Record receipt
          </button>
        </div>
      </div>

      <div className="cashbook-balance-grid">
        <div className="cashbook-balance-card">
          <div className="cashbook-balance-icon total">
            <Wallet size={20} />
          </div>
          <span>Total account balance</span>
          <h2>{formatCurrency(totalBalance)}</h2>
          <small>Combined cash and bank accounts</small>
        </div>

        <div className="cashbook-balance-card">
          <div className="cashbook-balance-icon cash">
            <Banknote size={20} />
          </div>
          <span>Cash balance</span>
          <h2>{formatCurrency(cashBalance)}</h2>
          <small>Physical cash accounts</small>
        </div>

        <div className="cashbook-balance-card">
          <div className="cashbook-balance-icon bank">
            <Landmark size={20} />
          </div>
          <span>Bank balance</span>
          <h2>{formatCurrency(bankBalance)}</h2>
          <small>Business bank accounts</small>
        </div>
      </div>

      <section className="cashbook-accounts-panel">
        <div className="cashbook-section-heading">
          <div>
            <h2>Cash and bank accounts</h2>
            <p>Current demo balances for each account</p>
          </div>
          <Link to="/finance/bank-accounts" className="cashbook-text-link">
            Manage accounts
          </Link>
        </div>

        <div className="cashbook-accounts-grid">
          {accounts.map((account) => (
            <div className="cashbook-account-card" key={account.id}>
              <div className="cashbook-account-card-top">
                <div className={`cashbook-account-icon ${account.type.toLowerCase()}`}>
                  {account.type === "Cash" ? (
                    <Banknote size={19} />
                  ) : (
                    <Landmark size={19} />
                  )}
                </div>
                <span className="cashbook-account-type">{account.type}</span>
              </div>

              <h3>{account.name}</h3>
              <strong>{formatCurrency(account.balance)}</strong>
              <button
                className="cashbook-account-view"
                onClick={() => setAccountFilter(account.id)}
              >
                View transactions
                <ArrowUpRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="cashbook-ledger-panel">
        <div className="cashbook-section-heading">
          <div>
            <h2>Cashbook entries</h2>
            <p>
              {filteredEntries.length} entries matching your filters
            </p>
          </div>

          <button
            className="cashbook-button secondary"
            onClick={() => openModal("transfer")}
          >
            <ArrowLeftRight size={17} />
            Transfer funds
          </button>
        </div>

        <div className="cashbook-filters">
          <div className="cashbook-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search description, reference or account..."
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search">
                <X size={15} />
              </button>
            )}
          </div>

          <div className="cashbook-select-wrap">
            <select
              value={accountFilter}
              onChange={(event) => setAccountFilter(event.target.value)}
              aria-label="Filter account"
            >
              <option value="all">All accounts</option>
              {accounts.map((account) => (
                <option value={account.id} key={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            <ChevronDown size={15} />
          </div>

          <div className="cashbook-select-wrap">
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              aria-label="Filter entry type"
            >
              <option value="all">All movements</option>
              <option value="receipt">Money received</option>
              <option value="payment">Money paid</option>
              <option value="transfer-in">Transfers received</option>
              <option value="transfer-out">Transfers sent</option>
            </select>
            <ChevronDown size={15} />
          </div>

          <input
            className="cashbook-date-filter"
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            aria-label="Filter date"
          />

          {(search || accountFilter !== "all" || typeFilter !== "all" || dateFilter) && (
            <button
              className="cashbook-reset"
              onClick={() => {
                setSearch("");
                setAccountFilter("all");
                setTypeFilter("all");
                setDateFilter("");
              }}
            >
              Reset
            </button>
          )}
        </div>

        <div className="cashbook-table-wrap">
          <table className="cashbook-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Account</th>
                <th>Transaction</th>
                <th>Reference</th>
                <th>Movement</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => {
                const isIn =
                  entry.type === "receipt" || entry.type === "transfer-in";

                return (
                  <tr
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className="cashbook-clickable-row"
                  >
                    <td>{formatDate(entry.date)}</td>
                    <td>{entry.accountName}</td>
                    <td>
                      <div className="cashbook-transaction-cell">
                        <span className={`cashbook-movement-icon ${isIn ? "in" : "out"}`}>
                          {isIn ? (
                            <ArrowDownLeft size={16} />
                          ) : (
                            <ArrowUpRight size={16} />
                          )}
                        </span>
                        <div>
                          <strong>{entry.description}</strong>
                          <span>{transactionLabels[entry.type]}</span>
                        </div>
                      </div>
                    </td>
                    <td className="cashbook-reference">{entry.reference}</td>
                    <td>
                      <span className={`cashbook-movement-label ${isIn ? "in" : "out"}`}>
                        {isIn ? "Money in" : "Money out"}
                      </span>
                    </td>
                    <td className={`cashbook-amount ${isIn ? "in" : "out"}`}>
                      {isIn ? "+" : "-"}
                      {formatCurrency(entry.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredEntries.length === 0 && (
            <div className="cashbook-empty">
              <Search size={25} />
              <h3>No cashbook entries found</h3>
              <p>Try changing your search or filters.</p>
            </div>
          )}
        </div>
      </section>

      {modalType && (
        <div className="cashbook-modal-overlay" onClick={closeModal}>
          <div
            className="cashbook-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cashbook-modal-header">
              <div>
                <h2>{modalTitle}</h2>
                <p>Enter the details for this cashbook movement.</p>
              </div>
              <button onClick={closeModal} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="cashbook-form-grid">
                <label className="cashbook-form-field full">
                  <span>{modalType === "transfer" ? "Description *" : "Description *"}</span>
                  <input
                    value={form.description}
                    onChange={(event) => updateForm("description", event.target.value)}
                    placeholder="Enter transaction description"
                  />
                </label>

                <label className="cashbook-form-field">
                  <span>{modalType === "transfer" ? "From account *" : "Account *"}</span>
                  <select
                    value={form.accountId}
                    onChange={(event) => updateForm("accountId", event.target.value)}
                  >
                    {accounts.map((account) => (
                      <option value={account.id} key={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </label>

                {modalType === "transfer" ? (
                  <label className="cashbook-form-field">
                    <span>To account *</span>
                    <select
                      value={form.destinationId}
                      onChange={(event) => updateForm("destinationId", event.target.value)}
                    >
                      {accounts.map((account) => (
                        <option value={account.id} key={account.id}>
                          {account.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <label className="cashbook-form-field">
                    <span>Category</span>
                    <input
                      value={form.category}
                      onChange={(event) => updateForm("category", event.target.value)}
                      placeholder="e.g. Sales or Utilities"
                    />
                  </label>
                )}

                <label className="cashbook-form-field">
                  <span>Amount (NGN) *</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={(event) => updateForm("amount", event.target.value)}
                    placeholder="0.00"
                  />
                </label>

                <label className="cashbook-form-field">
                  <span>Date *</span>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) => updateForm("date", event.target.value)}
                  />
                </label>

                {modalType !== "transfer" && (
                  <label className="cashbook-form-field">
                    <span>Payment method</span>
                    <select
                      value={form.method}
                      onChange={(event) => updateForm("method", event.target.value)}
                    >
                      <option>Cash</option>
                      <option>Bank transfer</option>
                      <option>POS terminal</option>
                      <option>Other</option>
                    </select>
                  </label>
                )}

                <label className="cashbook-form-field">
                  <span>Reference</span>
                  <input
                    value={form.reference}
                    onChange={(event) => updateForm("reference", event.target.value)}
                    placeholder="Optional reference"
                  />
                </label>

                <label className="cashbook-form-field full">
                  <span>Notes</span>
                  <textarea
                    rows="3"
                    value={form.note}
                    onChange={(event) => updateForm("note", event.target.value)}
                    placeholder="Additional details..."
                  />
                </label>
              </div>

              {error && <div className="cashbook-form-error">{error}</div>}

              <div className="cashbook-modal-footer">
                <button
                  type="button"
                  className="cashbook-button secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="cashbook-button primary">
                  Save entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedEntry && (
        <div className="cashbook-modal-overlay" onClick={() => setSelectedEntry(null)}>
          <div
            className="cashbook-detail-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cashbook-modal-header">
              <div>
                <h2>Cashbook entry</h2>
                <p>{selectedEntry.id}</p>
              </div>
              <button onClick={() => setSelectedEntry(null)} aria-label="Close details">
                <X size={20} />
              </button>
            </div>

            <div className="cashbook-detail-amount">
              <span>{transactionLabels[selectedEntry.type]}</span>
              <strong>
                {selectedEntry.type.endsWith("in") || selectedEntry.type === "receipt"
                  ? "+"
                  : "-"}
                {formatCurrency(selectedEntry.amount)}
              </strong>
            </div>

            <div className="cashbook-detail-list">
              <div><span>Description</span><strong>{selectedEntry.description}</strong></div>
              <div><span>Account</span><strong>{selectedEntry.accountName}</strong></div>
              <div><span>Category</span><strong>{selectedEntry.category}</strong></div>
              <div><span>Date</span><strong>{formatDate(selectedEntry.date)}</strong></div>
              <div><span>Reference</span><strong>{selectedEntry.reference}</strong></div>
              <div><span>Payment method</span><strong>{selectedEntry.method}</strong></div>
            </div>

            <button
              className="cashbook-button secondary cashbook-detail-close"
              onClick={() => setSelectedEntry(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="cashbook-demo-notice">
        <Wallet size={17} />
        <span>
          Demo mode: account balances and cashbook entries are held in local
          page state. Production cashbook entries will be posted to the
          accounting ledger with audit history and account reconciliation.
        </span>
      </div>
    </div>
  );
}
