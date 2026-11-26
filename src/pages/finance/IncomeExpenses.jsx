
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Download,
  Plus,
  Search,
  X,
} from "lucide-react";
import '../../styles/finance.css';

const initialTransactions = [
  {
    id: "INC-2048",
    title: "Retail sales income",
    category: "Sales",
    type: "income",
    amount: 185000,
    method: "Bank transfer",
    date: "2026-11-26",
    reference: "SALE-1048",
    note: "Daily sales settlement",
  },
  {
    id: "EXP-2047",
    title: "Supplier payment",
    category: "Inventory",
    type: "expense",
    amount: 320000,
    method: "Bank transfer",
    date: "2026-11-26",
    reference: "SUP-INV-092",
    note: "Payment for supplier invoice",
  },
  {
    id: "INC-2046",
    title: "Customer debt payment",
    category: "Customer payment",
    type: "income",
    amount: 75000,
    method: "Cash",
    date: "2026-11-25",
    reference: "CUS-PAY-118",
    note: "Part payment received",
  },
  {
    id: "EXP-2045",
    title: "Electricity bill",
    category: "Utilities",
    type: "expense",
    amount: 48000,
    method: "Bank transfer",
    date: "2026-11-25",
    reference: "UTIL-011",
    note: "Monthly electricity payment",
  },
  {
    id: "INC-2044",
    title: "Other business income",
    category: "Other income",
    type: "income",
    amount: 25000,
    method: "Cash",
    date: "2026-11-24",
    reference: "OTH-INC-008",
    note: "Miscellaneous business income",
  },
  {
    id: "EXP-2043",
    title: "Transport expense",
    category: "Transport",
    type: "expense",
    amount: 18500,
    method: "Cash",
    date: "2026-11-24",
    reference: "TRN-016",
    note: "Local delivery and transport",
  },
];

const incomeCategories = [
  "Sales",
  "Customer payment",
  "Other income",
  "Interest income",
  "Service income",
];

const expenseCategories = [
  "Inventory",
  "Utilities",
  "Transport",
  "Rent",
  "Staff expenses",
  "Repairs",
  "Office expenses",
  "Other expense",
];

const paymentMethods = [
  "Cash",
  "Bank transfer",
  "POS terminal",
  "Other",
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value) => {
  if (!value) return "—";

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function IncomeExpenses() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [modalType, setModalType] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "",
    amount: "",
    method: "Cash",
    date: new Date().toISOString().slice(0, 10),
    reference: "",
    note: "",
  });
  const [formError, setFormError] = useState("");

  const incomeTotal = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const expenseTotal = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const netTotal = incomeTotal - expenseTotal;

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return transactions.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.id.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch) ||
        item.reference.toLowerCase().includes(normalizedSearch);

      const matchesType =
        typeFilter === "all" || item.type === typeFilter;

      const matchesMethod =
        methodFilter === "all" || item.method === methodFilter;

      const matchesDate = !dateFilter || item.date === dateFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesMethod &&
        matchesDate
      );
    });
  }, [transactions, search, typeFilter, methodFilter, dateFilter]);

  const openModal = (type) => {
    setModalType(type);
    setForm({
      title: "",
      category: "",
      amount: "",
      method: "Cash",
      date: new Date().toISOString().slice(0, 10),
      reference: "",
      note: "",
    });
    setFormError("");
  };

  const closeModal = () => {
    setModalType("");
    setFormError("");
  };

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const amount = Number(form.amount);

    if (!form.title.trim()) {
      setFormError("Enter a transaction description.");
      return;
    }

    if (!form.category) {
      setFormError("Select a transaction category.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError("Enter an amount greater than zero.");
      return;
    }

    if (!form.date) {
      setFormError("Select the transaction date.");
      return;
    }

    const prefix = modalType === "income" ? "INC" : "EXP";
    const newTransaction = {
      ...form,
      id: `${prefix}-${Date.now().toString().slice(-6)}`,
      type: modalType,
      amount,
      title: form.title.trim(),
      reference: form.reference.trim() || "—",
      note: form.note.trim(),
    };

    setTransactions((current) => [newTransaction, ...current]);
    closeModal();
  };

  const handleExport = () => {
    const headers = [
      "Transaction ID",
      "Description",
      "Category",
      "Type",
      "Amount",
      "Payment Method",
      "Date",
      "Reference",
      "Note",
    ];

    const rows = filteredTransactions.map((item) => [
      item.id,
      item.title,
      item.category,
      item.type,
      item.amount,
      item.method,
      item.date,
      item.reference,
      item.note,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "vinora-income-expenses.csv";
    anchor.click();

    URL.revokeObjectURL(url);
  };

  const categories =
    modalType === "income" ? incomeCategories : expenseCategories;

  return (
    <div className="income-expenses-page">
      <div className="income-expenses-header">
        <div>
          <Link to="/finance" className="income-expenses-back">
            <ArrowLeft size={16} />
            Finance Overview
          </Link>

          <h1>Income & Expenses</h1>
          <p>
            Record business income and expenses and review your
            financial activity.
          </p>
        </div>

        <div className="income-expenses-header-actions">
          <button
            className="ie-button ie-button-secondary"
            onClick={handleExport}
          >
            <Download size={17} />
            Export CSV
          </button>

          <button
            className="ie-button ie-button-primary"
            onClick={() => openModal("income")}
          >
            <Plus size={17} />
            Record income
          </button>
        </div>
      </div>

      <div className="ie-summary-grid">
        <div className="ie-summary-card">
          <div className="ie-summary-icon income">
            <ArrowDownLeft size={20} />
          </div>
          <span>Total income</span>
          <h2>{formatCurrency(incomeTotal)}</h2>
          <small>All recorded income</small>
        </div>

        <div className="ie-summary-card">
          <div className="ie-summary-icon expense">
            <ArrowUpRight size={20} />
          </div>
          <span>Total expenses</span>
          <h2>{formatCurrency(expenseTotal)}</h2>
          <small>All recorded expenses</small>
        </div>

        <div className="ie-summary-card">
          <div className="ie-summary-icon net">
            <CircleDollarSign size={20} />
          </div>
          <span>Net movement</span>
          <h2 className={netTotal >= 0 ? "positive" : "negative"}>
            {formatCurrency(netTotal)}
          </h2>
          <small>Income minus expenses</small>
        </div>
      </div>

      <div className="ie-actions-panel">
        <div>
          <h2>Record a transaction</h2>
          <p>
            Add a business income or expense entry to the demo ledger.
          </p>
        </div>

        <div className="ie-record-actions">
          <button
            className="ie-button ie-button-income"
            onClick={() => openModal("income")}
          >
            <ArrowDownLeft size={17} />
            Record income
          </button>

          <button
            className="ie-button ie-button-expense"
            onClick={() => openModal("expense")}
          >
            <ArrowUpRight size={17} />
            Record expense
          </button>
        </div>
      </div>

      <section className="ie-transactions-panel">
        <div className="ie-transactions-heading">
          <div>
            <h2>Transactions</h2>
            <p>
              {filteredTransactions.length} transaction
              {filteredTransactions.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        <div className="ie-filter-bar">
          <div className="ie-search-box">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search description, ID or reference..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                className="ie-clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="ie-filter-select">
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              aria-label="Transaction type"
            >
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
            <ChevronDown size={15} />
          </div>

          <div className="ie-filter-select">
            <select
              value={methodFilter}
              onChange={(event) => setMethodFilter(event.target.value)}
              aria-label="Payment method"
            >
              <option value="all">All methods</option>
              {paymentMethods.map((method) => (
                <option value={method} key={method}>
                  {method}
                </option>
              ))}
            </select>
            <ChevronDown size={15} />
          </div>

          <label className="ie-date-filter">
            <CalendarDays size={16} />
            <input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              aria-label="Filter by date"
            />
          </label>

          {(search || typeFilter !== "all" || methodFilter !== "all" || dateFilter) && (
            <button
              className="ie-reset-filters"
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setMethodFilter("all");
                setDateFilter("");
              }}
            >
              Reset
            </button>
          )}
        </div>

        <div className="ie-table-wrapper">
          <table className="ie-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Category</th>
                <th>Date</th>
                <th>Payment method</th>
                <th>Reference</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    <div className="ie-transaction-cell">
                      <span
                        className={`ie-transaction-type-icon ${transaction.type}`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowDownLeft size={16} />
                        ) : (
                          <ArrowUpRight size={16} />
                        )}
                      </span>

                      <div>
                        <strong>{transaction.title}</strong>
                        <span>{transaction.id}</span>
                      </div>
                    </div>
                  </td>

                  <td>{transaction.category}</td>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.method}</td>
                  <td className="ie-reference-cell">
                    {transaction.reference}
                  </td>

                  <td
                    className={`ie-amount-cell ${transaction.type}`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="ie-empty-state">
              <Search size={25} />
              <h3>No transactions found</h3>
              <p>Try changing your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>

      {modalType && (
        <div className="ie-modal-overlay" onClick={closeModal}>
          <div
            className="ie-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ie-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="ie-modal-header">
              <div>
                <span
                  className={`ie-modal-icon ${modalType}`}
                >
                  {modalType === "income" ? (
                    <ArrowDownLeft size={20} />
                  ) : (
                    <ArrowUpRight size={20} />
                  )}
                </span>

                <h2 id="ie-modal-title">
                  Record {modalType}
                </h2>

                <p>
                  Enter the details of this {modalType} transaction.
                </p>
              </div>

              <button
                className="ie-modal-close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="ie-form-grid">
                <label className="ie-form-field ie-form-full">
                  <span>Description *</span>
                  <input
                    type="text"
                    placeholder={
                      modalType === "income"
                        ? "e.g. Other business income"
                        : "e.g. Office electricity"
                    }
                    value={form.title}
                    onChange={(event) =>
                      updateForm("title", event.target.value)
                    }
                  />
                </label>

                <label className="ie-form-field">
                  <span>Category *</span>
                  <select
                    value={form.category}
                    onChange={(event) =>
                      updateForm("category", event.target.value)
                    }
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option value={category} key={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="ie-form-field">
                  <span>Amount (NGN) *</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(event) =>
                      updateForm("amount", event.target.value)
                    }
                  />
                </label>

                <label className="ie-form-field">
                  <span>Payment method *</span>
                  <select
                    value={form.method}
                    onChange={(event) =>
                      updateForm("method", event.target.value)
                    }
                  >
                    {paymentMethods.map((method) => (
                      <option value={method} key={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="ie-form-field">
                  <span>Date *</span>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) =>
                      updateForm("date", event.target.value)
                    }
                  />
                </label>

                <label className="ie-form-field ie-form-full">
                  <span>Reference</span>
                  <input
                    type="text"
                    placeholder="Optional transaction or receipt reference"
                    value={form.reference}
                    onChange={(event) =>
                      updateForm("reference", event.target.value)
                    }
                  />
                </label>

                <label className="ie-form-field ie-form-full">
                  <span>Notes</span>
                  <textarea
                    rows="3"
                    placeholder="Add additional details..."
                    value={form.note}
                    onChange={(event) =>
                      updateForm("note", event.target.value)
                    }
                  />
                </label>
              </div>

              {formError && (
                <div className="ie-form-error">{formError}</div>
              )}

              <div className="ie-modal-footer">
                <button
                  type="button"
                  className="ie-button ie-button-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`ie-button ${
                    modalType === "income"
                      ? "ie-button-primary"
                      : "ie-button-expense"
                  }`}
                >
                  <Check size={17} />
                  Save {modalType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="ie-demo-notice">
        <CircleDollarSign size={17} />
        <span>
          Demo mode: transactions are stored in this page's local state.
          Production entries will be validated, permission-checked and
          posted through the accounting ledger.
        </span>
      </div>
    </div>
  );
}
