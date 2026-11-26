
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BookOpen,
  Download,
  Eye,
  Filter,
  Search,
  X,
} from "lucide-react";
import "../../styles/finance.css";

const accounts = [
  {
    id: "cash",
    code: "1001",
    name: "Main Cash Till",
    type: "Asset",
    openingBalance: 1710000,
    normalBalance: "debit",
  },
  {
    id: "bank",
    code: "1002",
    name: "Business Bank Account",
    type: "Asset",
    openingBalance: 9850000,
    normalBalance: "debit",
  },
  {
    id: "inventory",
    code: "1200",
    name: "Inventory",
    type: "Asset",
    openingBalance: 5200000,
    normalBalance: "debit",
  },
  {
    id: "sales",
    code: "4001",
    name: "Sales Revenue",
    type: "Income",
    openingBalance: 0,
    normalBalance: "credit",
  },
  {
    id: "expenses",
    code: "5001",
    name: "Operating Expenses",
    type: "Expense",
    openingBalance: 0,
    normalBalance: "debit",
  },
];

const ledgerEntries = [
  {
    id: "JV-1001",
    date: "2026-11-25",
    accountId: "cash",
    reference: "POS-2041",
    description: "Cash sale received",
    source: "POS Sale",
    debit: 185000,
    credit: 0,
    employee: "Grace Okafor",
  },
  {
    id: "JV-1001",
    date: "2026-11-25",
    accountId: "sales",
    reference: "POS-2041",
    description: "Cash sale revenue",
    source: "POS Sale",
    debit: 0,
    credit: 185000,
    employee: "Grace Okafor",
  },
  {
    id: "JV-1002",
    date: "2026-11-25",
    accountId: "bank",
    reference: "RCPT-3018",
    description: "Customer bank transfer",
    source: "Customer Receipt",
    debit: 250000,
    credit: 0,
    employee: "David James",
  },
  {
    id: "JV-1002",
    date: "2026-11-25",
    accountId: "sales",
    reference: "RCPT-3018",
    description: "Sales received by transfer",
    source: "Customer Receipt",
    debit: 0,
    credit: 250000,
    employee: "David James",
  },
  {
    id: "JV-1003",
    date: "2026-11-24",
    accountId: "expenses",
    reference: "EXP-0084",
    description: "Electricity and utilities",
    source: "Expense",
    debit: 42000,
    credit: 0,
    employee: "Mary Bello",
  },
  {
    id: "JV-1003",
    date: "2026-11-24",
    accountId: "cash",
    reference: "EXP-0084",
    description: "Cash payment for utilities",
    source: "Expense",
    debit: 0,
    credit: 42000,
    employee: "Mary Bello",
  },
  {
    id: "JV-1004",
    date: "2026-11-23",
    accountId: "inventory",
    reference: "GRN-0092",
    description: "Inventory received from supplier",
    source: "Goods Received",
    debit: 380000,
    credit: 0,
    employee: "Peter Musa",
  },
  {
    id: "JV-1004",
    date: "2026-11-23",
    accountId: "bank",
    reference: "GRN-0092",
    description: "Supplier payment for stock",
    source: "Supplier Payment",
    debit: 0,
    credit: 380000,
    employee: "Peter Musa",
  },
  {
    id: "JV-1005",
    date: "2026-11-22",
    accountId: "cash",
    reference: "POS-2033",
    description: "Cash sale received",
    source: "POS Sale",
    debit: 96000,
    credit: 0,
    employee: "Grace Okafor",
  },
  {
    id: "JV-1005",
    date: "2026-11-22",
    accountId: "sales",
    reference: "POS-2033",
    description: "Cash sale revenue",
    source: "POS Sale",
    debit: 0,
    credit: 96000,
    employee: "Grace Okafor",
  },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function getEntryBalance(entry, account) {
  if (account.normalBalance === "credit") {
    return entry.credit - entry.debit;
  }

  return entry.debit - entry.credit;
}

export default function GeneralLedger() {
  const [accountId, setAccountId] = useState("cash");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const selectedAccount = accounts.find(
    (account) => account.id === accountId
  );

  const sourceOptions = [
    ...new Set(ledgerEntries.map((entry) => entry.source)),
  ];

  const filteredEntries = useMemo(() => {
    return ledgerEntries
      .filter((entry) => entry.accountId === accountId)
      .filter((entry) => {
        const searchText = search.toLowerCase();

        return (
          entry.reference.toLowerCase().includes(searchText) ||
          entry.description.toLowerCase().includes(searchText) ||
          entry.employee.toLowerCase().includes(searchText) ||
          entry.id.toLowerCase().includes(searchText)
        );
      })
      .filter((entry) => !startDate || entry.date >= startDate)
      .filter((entry) => !endDate || entry.date <= endDate)
      .filter(
        (entry) =>
          sourceFilter === "all" || entry.source === sourceFilter
      )
      .sort((a, b) => {
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date);
        }

        return a.id.localeCompare(b.id);
      });
  }, [accountId, search, startDate, endDate, sourceFilter]);

  const ledgerRows = useMemo(() => {
    let runningBalance = selectedAccount.openingBalance;

    return filteredEntries.map((entry) => {
      runningBalance += getEntryBalance(entry, selectedAccount);

      return {
        ...entry,
        runningBalance,
      };
    });
  }, [filteredEntries, selectedAccount]);

  const totalDebit = filteredEntries.reduce(
    (total, entry) => total + entry.debit,
    0
  );

  const totalCredit = filteredEntries.reduce(
    (total, entry) => total + entry.credit,
    0
  );

  const closingBalance =
    selectedAccount.openingBalance +
    filteredEntries.reduce(
      (total, entry) => total + getEntryBalance(entry, selectedAccount),
      0
    );

  const exportCSV = () => {
    const headers = [
      "Date",
      "Journal",
      "Reference",
      "Description",
      "Source",
      "Debit",
      "Credit",
      "Running Balance",
      "Employee",
    ];

    const rows = ledgerRows.map((entry) => [
      entry.date,
      entry.id,
      entry.reference,
      entry.description,
      entry.source,
      entry.debit,
      entry.credit,
      entry.runningBalance,
      entry.employee,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `vinora-general-ledger-${accountId}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setSourceFilter("all");
  };

  return (
    <div className="general-ledger-page">
      <div className="general-ledger-header">
        <div>
          <div className="general-ledger-breadcrumb">
            <Link to="/finance">Finance</Link>
            <span>/</span>
            <span>General Ledger</span>
          </div>

          <h1>General Ledger</h1>
          <p>
            Review account activity, journal entries, and running balances.
          </p>
        </div>

        <div className="general-ledger-header-actions">
          <Link
            to="/finance/chart-of-accounts"
            className="general-ledger-secondary-btn"
          >
            <BookOpen size={17} />
            Chart of Accounts
          </Link>

          <button
            type="button"
            className="general-ledger-primary-btn"
            onClick={exportCSV}
          >
            <Download size={17} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="general-ledger-account-select">
        <div className="general-ledger-account-icon">
          <BookOpen size={21} />
        </div>

        <div className="general-ledger-account-info">
          <label htmlFor="ledger-account">Ledger account</label>
          <select
            id="ledger-account"
            value={accountId}
            onChange={(event) => setAccountId(event.target.value)}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.code} — {account.name}
              </option>
            ))}
          </select>
        </div>

        <div className="general-ledger-account-type">
          {selectedAccount.type}
        </div>
      </div>

      <div className="general-ledger-summary-grid">
        <div className="general-ledger-summary-card">
          <span>Opening balance</span>
          <strong>{formatCurrency(selectedAccount.openingBalance)}</strong>
          <small>Before displayed transactions</small>
        </div>

        <div className="general-ledger-summary-card">
          <span>Total debits</span>
          <strong>{formatCurrency(totalDebit)}</strong>
          <small className="ledger-positive">
            <ArrowDownLeft size={14} />
            Debit activity
          </small>
        </div>

        <div className="general-ledger-summary-card">
          <span>Total credits</span>
          <strong>{formatCurrency(totalCredit)}</strong>
          <small className="ledger-negative">
            <ArrowUpRight size={14} />
            Credit activity
          </small>
        </div>

        <div className="general-ledger-summary-card ledger-balance-card">
          <span>Closing balance</span>
          <strong>{formatCurrency(closingBalance)}</strong>
          <small>Opening balance + net activity</small>
        </div>
      </div>

      <div className="general-ledger-table-card">
        <div className="general-ledger-table-heading">
          <div>
            <h2>Account transactions</h2>
            <p>
              {selectedAccount.code} · {selectedAccount.name}
            </p>
          </div>

          <button
            type="button"
            className="general-ledger-filter-toggle"
            onClick={() => setShowFilters((value) => !value)}
          >
            <Filter size={16} />
            Filters
          </button>
        </div>

        <div className="general-ledger-toolbar">
          <div className="general-ledger-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search reference, journal or employee..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {showFilters && (
            <div className="general-ledger-filters">
              <div>
                <label htmlFor="ledger-start-date">From date</label>
                <input
                  id="ledger-start-date"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </div>

              <div>
                <label htmlFor="ledger-end-date">To date</label>
                <input
                  id="ledger-end-date"
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </div>

              <div>
                <label htmlFor="ledger-source">Source</label>
                <select
                  id="ledger-source"
                  value={sourceFilter}
                  onChange={(event) => setSourceFilter(event.target.value)}
                >
                  <option value="all">All sources</option>
                  {sourceOptions.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="general-ledger-clear-btn"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        <div className="general-ledger-table-wrap">
          <table className="general-ledger-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Journal / Reference</th>
                <th>Description</th>
                <th>Source</th>
                <th className="ledger-number">Debit</th>
                <th className="ledger-number">Credit</th>
                <th className="ledger-number">Balance</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {ledgerRows.map((entry, index) => (
                <tr key={`${entry.id}-${entry.accountId}-${index}`}>
                  <td>{formatDate(entry.date)}</td>

                  <td>
                    <strong className="ledger-reference">{entry.id}</strong>
                    <span className="ledger-sub-reference">
                      {entry.reference}
                    </span>
                  </td>

                  <td className="ledger-description">
                    {entry.description}
                  </td>

                  <td>
                    <span className="ledger-source-tag">
                      {entry.source}
                    </span>
                  </td>

                  <td className="ledger-number">
                    {entry.debit ? formatCurrency(entry.debit) : "—"}
                  </td>

                  <td className="ledger-number">
                    {entry.credit ? formatCurrency(entry.credit) : "—"}
                  </td>

                  <td className="ledger-number ledger-running-balance">
                    {formatCurrency(entry.runningBalance)}
                  </td>

                  <td>
                    <button
                      type="button"
                      className="ledger-view-btn"
                      title="View journal entry"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {ledgerRows.length === 0 && (
                <tr>
                  <td colSpan="8">
                    <div className="general-ledger-empty">
                      <BookOpen size={28} />
                      <strong>No ledger entries found</strong>
                      <span>
                        Try changing your search or filters.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="general-ledger-table-footer">
          <span>
            Showing {ledgerRows.length} transaction
            {ledgerRows.length === 1 ? "" : "s"}
          </span>
          <span>
            Net movement:{" "}
            <strong>
              {formatCurrency(
                selectedAccount.normalBalance === "credit"
                  ? totalCredit - totalDebit
                  : totalDebit - totalCredit
              )}
            </strong>
          </span>
        </div>
      </div>

      {selectedEntry && (
        <div
          className="general-ledger-modal-overlay"
          onClick={() => setSelectedEntry(null)}
        >
          <div
            className="general-ledger-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="general-ledger-modal-header">
              <div>
                <span>Journal entry</span>
                <h2>{selectedEntry.id}</h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="general-ledger-modal-close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="general-ledger-modal-body">
              <div className="ledger-detail-row">
                <span>Date</span>
                <strong>{formatDate(selectedEntry.date)}</strong>
              </div>

              <div className="ledger-detail-row">
                <span>Reference</span>
                <strong>{selectedEntry.reference}</strong>
              </div>

              <div className="ledger-detail-row">
                <span>Source</span>
                <strong>{selectedEntry.source}</strong>
              </div>

              <div className="ledger-detail-row">
                <span>Employee</span>
                <strong>{selectedEntry.employee}</strong>
              </div>

              <div className="ledger-detail-row">
                <span>Account</span>
                <strong>
                  {selectedAccount.code} — {selectedAccount.name}
                </strong>
              </div>

              <div className="ledger-detail-description">
                <span>Description</span>
                <p>{selectedEntry.description}</p>
              </div>

              <div className="ledger-detail-amounts">
                <div>
                  <span>Debit</span>
                  <strong>{formatCurrency(selectedEntry.debit)}</strong>
                </div>
                <div>
                  <span>Credit</span>
                  <strong>{formatCurrency(selectedEntry.credit)}</strong>
                </div>
              </div>

              <p className="ledger-readonly-note">
                Posted ledger entries are read-only. Corrections must be made
                through an authorised reversal or adjustment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
