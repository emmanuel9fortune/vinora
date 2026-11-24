
import { useMemo, useState } from "react";
import {
  Search,
  Wallet,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  Plus,
  X,
  Eye,
  Download,
  CreditCard,
  Banknote,
  ArrowDownLeft,
  FileText,
  UserRound,
  CalendarDays,
  Receipt,
  Filter,
} from "lucide-react";
import "../../styles/customers.css";

const initialInvoices = [
  {
    id: "INV-10521",
    customerId: "CUS-0001",
    customer: "John Adebayo",
    issueDate: "2026-11-16",
    dueDate: "2026-11-30",
    amount: 25000,
    paid: 0,
    status: "Unpaid",
  },
  {
    id: "INV-30582",
    customerId: "CUS-0003",
    customer: "Wellness Family Clinic",
    issueDate: "2026-10-10",
    dueDate: "2026-11-10",
    amount: 125000,
    paid: 0,
    status: "Unpaid",
  },
  {
    id: "INV-10342",
    customerId: "CUS-0001",
    customer: "John Adebayo",
    issueDate: "2026-10-02",
    dueDate: "2026-10-16",
    amount: 18000,
    paid: 0,
    status: "Unpaid",
  },
  {
    id: "INV-40582",
    customerId: "CUS-0004",
    customer: "Michael Eze",
    issueDate: "2026-11-05",
    dueDate: "2026-11-19",
    amount: 30000,
    paid: 18000,
    status: "Partially Paid",
  },
  {
    id: "INV-40521",
    customerId: "CUS-0005",
    customer: "Prime Health Centre",
    issueDate: "2026-09-01",
    dueDate: "2026-10-01",
    amount: 85000,
    paid: 85000,
    status: "Paid",
  },
  {
    id: "INV-20521",
    customerId: "CUS-0002",
    customer: "Grace Okafor",
    issueDate: "2026-11-17",
    dueDate: "2026-11-24",
    amount: 18500,
    paid: 0,
    status: "Unpaid",
  },
  {
    id: "INV-30521",
    customerId: "CUS-0003",
    customer: "Wellness Family Clinic",
    issueDate: "2026-10-20",
    dueDate: "2026-11-20",
    amount: 60000,
    paid: 20000,
    status: "Partially Paid",
  },
];

const initialPayments = [
  {
    id: "PAY-30521",
    invoiceId: "INV-30521",
    customerId: "CUS-0003",
    customer: "Wellness Family Clinic",
    date: "2026-11-15",
    amount: 20000,
    method: "Bank Transfer",
    reference: "TRF-839201",
    notes: "Part payment",
  },
  {
    id: "PAY-40582",
    invoiceId: "INV-40582",
    customerId: "CUS-0004",
    customer: "Michael Eze",
    date: "2026-11-12",
    amount: 18000,
    method: "Cash",
    reference: "CASH-1052",
    notes: "Payment received at counter",
  },
  {
    id: "PAY-40521",
    invoiceId: "INV-40521",
    customerId: "CUS-0005",
    customer: "Prime Health Centre",
    date: "2026-09-20",
    amount: 85000,
    method: "POS Terminal",
    reference: "POS-77291",
    notes: "Invoice settled",
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

const getToday = () => {
  const today = new Date();
  const local = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  );
  return local.toISOString().slice(0, 10);
};

const getDaysOverdue = (dueDate) => {
  const today = new Date(`${getToday()}T00:00:00`);
  const due = new Date(`${dueDate}T00:00:00`);
  return Math.max(
    0,
    Math.floor((today - due) / (1000 * 60 * 60 * 24))
  );
};

const getInvoiceBalance = (invoice) =>
  Math.max(0, invoice.amount - invoice.paid);

const getInvoiceStatus = (invoice) => {
  const balance = getInvoiceBalance(invoice);

  if (balance === 0) return "Paid";
  if (invoice.paid > 0) return "Partially Paid";
  return "Unpaid";
};

const getAgeingCategory = (dueDate) => {
  const days = getDaysOverdue(dueDate);

  if (days === 0) return "Current";
  if (days <= 30) return "1–30 days";
  if (days <= 60) return "31–60 days";
  if (days <= 90) return "61–90 days";
  return "Over 90 days";
};

function CustomerPayments() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [payments, setPayments] = useState(initialPayments);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Outstanding");
  const [ageingFilter, setAgeingFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("Outstanding Invoices");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formError, setFormError] = useState("");

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "Bank Transfer",
    date: getToday(),
    reference: "",
    notes: "",
  });

  const summary = useMemo(() => {
    const outstandingInvoices = invoices.filter(
      (invoice) => getInvoiceBalance(invoice) > 0
    );

    const outstanding = outstandingInvoices.reduce(
      (total, invoice) => total + getInvoiceBalance(invoice),
      0
    );

    const overdueInvoices = outstandingInvoices.filter(
      (invoice) => getDaysOverdue(invoice.dueDate) > 0
    );

    const overdue = overdueInvoices.reduce(
      (total, invoice) => total + getInvoiceBalance(invoice),
      0
    );

    const collected = payments.reduce(
      (total, payment) => total + payment.amount,
      0
    );

    return {
      outstanding,
      overdue,
      collected,
      outstandingCount: outstandingInvoices.length,
      overdueCount: overdueInvoices.length,
      paymentCount: payments.length,
    };
  }, [invoices, payments]);

  const ageingSummary = useMemo(() => {
    const categories = [
      "Current",
      "1–30 days",
      "31–60 days",
      "61–90 days",
      "Over 90 days",
    ];

    return categories.map((category) => {
      const balance = invoices
        .filter(
          (invoice) =>
            getInvoiceBalance(invoice) > 0 &&
            getAgeingCategory(invoice.dueDate) === category
        )
        .reduce(
          (total, invoice) => total + getInvoiceBalance(invoice),
          0
        );

      return { category, balance };
    });
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const balance = getInvoiceBalance(invoice);
      const status = getInvoiceStatus(invoice);
      const matchesSearch =
        !query ||
        invoice.customer.toLowerCase().includes(query) ||
        invoice.customerId.toLowerCase().includes(query) ||
        invoice.id.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Outstanding" && balance > 0) ||
        status === statusFilter;

      const matchesAgeing =
        ageingFilter === "All" ||
        (balance > 0 &&
          getAgeingCategory(invoice.dueDate) === ageingFilter);

      return matchesSearch && matchesStatus && matchesAgeing;
    });
  }, [invoices, search, statusFilter, ageingFilter]);

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter(
      (payment) =>
        !query ||
        payment.customer.toLowerCase().includes(query) ||
        payment.customerId.toLowerCase().includes(query) ||
        payment.invoiceId.toLowerCase().includes(query) ||
        payment.reference.toLowerCase().includes(query)
    );
  }, [payments, search]);

  const openPaymentModal = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentForm({
      amount: String(getInvoiceBalance(invoice)),
      method: "Bank Transfer",
      date: getToday(),
      reference: "",
      notes: "",
    });
    setFormError("");
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedInvoice(null);
    setFormError("");
  };

  const updatePaymentForm = (field, value) => {
    setPaymentForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const recordPayment = (event) => {
    event.preventDefault();
    setFormError("");

    if (!selectedInvoice) return;

    const amount = Number(paymentForm.amount);
    const balance = getInvoiceBalance(selectedInvoice);

    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError("Enter a valid payment amount.");
      return;
    }

    if (amount > balance) {
      setFormError(
        `Payment cannot exceed the outstanding balance of ${formatCurrency(balance)}.`
      );
      return;
    }

    if (!paymentForm.reference.trim()) {
      setFormError("Enter a payment reference.");
      return;
    }

    const duplicateReference = payments.some(
      (payment) =>
        payment.reference.trim().toLowerCase() ===
        paymentForm.reference.trim().toLowerCase()
    );

    if (duplicateReference) {
      setFormError("This payment reference has already been recorded.");
      return;
    }

    if (paymentForm.date > getToday()) {
      setFormError("Payment date cannot be in the future.");
      return;
    }

    const newPayment = {
      id: `PAY-${String(Date.now()).slice(-6)}`,
      invoiceId: selectedInvoice.id,
      customerId: selectedInvoice.customerId,
      customer: selectedInvoice.customer,
      date: paymentForm.date,
      amount,
      method: paymentForm.method,
      reference: paymentForm.reference.trim(),
      notes: paymentForm.notes.trim(),
    };

    setPayments((previous) => [newPayment, ...previous]);

    setInvoices((previous) =>
      previous.map((invoice) => {
        if (invoice.id !== selectedInvoice.id) return invoice;

        const newPaidAmount = invoice.paid + amount;

        return {
          ...invoice,
          paid: newPaidAmount,
          status:
            newPaidAmount >= invoice.amount
              ? "Paid"
              : "Partially Paid",
        };
      })
    );

    closePaymentModal();
  };

  const exportCsv = () => {
    const rows =
      activeTab === "Payment History"
        ? [
            [
              "Payment ID",
              "Date",
              "Customer",
              "Invoice",
              "Method",
              "Reference",
              "Amount",
            ],
            ...filteredPayments.map((payment) => [
              payment.id,
              payment.date,
              payment.customer,
              payment.invoiceId,
              payment.method,
              payment.reference,
              payment.amount,
            ]),
          ]
        : [
            [
              "Invoice",
              "Customer",
              "Issue Date",
              "Due Date",
              "Invoice Amount",
              "Paid",
              "Balance",
              "Status",
            ],
            ...filteredInvoices.map((invoice) => [
              invoice.id,
              invoice.customer,
              invoice.issueDate,
              invoice.dueDate,
              invoice.amount,
              invoice.paid,
              getInvoiceBalance(invoice),
              getInvoiceStatus(invoice),
            ]),
          ];

    const csv = rows
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
    link.download =
      activeTab === "Payment History"
        ? "customer-payment-history.csv"
        : "customer-outstanding-invoices.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("Outstanding");
    setAgeingFilter("All");
  };

  return (
    <div className="customer-payments-page">
      <div className="customer-payments-header">
        <div>
          <div className="customer-payments-breadcrumb">
            <span>Customers</span>
            <span>/</span>
            <strong>Payments & Debts</strong>
          </div>
          <h1>Customer Payments & Debts</h1>
          <p>
            Monitor outstanding invoices, collect payments and manage
            customer balances.
          </p>
        </div>

        <button
          className="customer-payments-export-btn"
          onClick={exportCsv}
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="customer-payments-stats">
        <div className="customer-payments-stat">
          <div className="customer-payments-stat-top">
            <div className="customer-payments-stat-icon debt-icon">
              <Wallet size={20} />
            </div>
            <span>Outstanding receivables</span>
          </div>
          <strong>{formatCurrency(summary.outstanding)}</strong>
          <small>{summary.outstandingCount} unpaid invoices</small>
        </div>

        <div className="customer-payments-stat">
          <div className="customer-payments-stat-top">
            <div className="customer-payments-stat-icon overdue-icon">
              <AlertTriangle size={20} />
            </div>
            <span>Overdue balances</span>
          </div>
          <strong>{formatCurrency(summary.overdue)}</strong>
          <small>{summary.overdueCount} overdue invoices</small>
        </div>

        <div className="customer-payments-stat">
          <div className="customer-payments-stat-top">
            <div className="customer-payments-stat-icon collected-icon">
              <ArrowDownLeft size={20} />
            </div>
            <span>Payments recorded</span>
          </div>
          <strong>{formatCurrency(summary.collected)}</strong>
          <small>{summary.paymentCount} payment records</small>
        </div>

        <div className="customer-payments-stat">
          <div className="customer-payments-stat-top">
            <div className="customer-payments-stat-icon invoice-icon">
              <Receipt size={20} />
            </div>
            <span>Invoices monitored</span>
          </div>
          <strong>{invoices.length}</strong>
          <small>Customer credit invoices</small>
        </div>
      </div>

      <div className="customer-ageing-card">
        <div className="customer-ageing-heading">
          <div>
            <h2>Receivables Ageing</h2>
            <p>Outstanding balances grouped by days past their due dates.</p>
          </div>
          <Clock3 size={19} />
        </div>

        <div className="customer-ageing-grid">
          {ageingSummary.map((item) => (
            <div className="customer-ageing-item" key={item.category}>
              <span>{item.category}</span>
              <strong>{formatCurrency(item.balance)}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="customer-payments-content">
        <div className="customer-payments-tabs">
          <button
            className={
              activeTab === "Outstanding Invoices" ? "active" : ""
            }
            onClick={() => setActiveTab("Outstanding Invoices")}
          >
            <FileText size={15} />
            Outstanding Invoices
          </button>

          <button
            className={activeTab === "Payment History" ? "active" : ""}
            onClick={() => setActiveTab("Payment History")}
          >
            <Wallet size={15} />
            Payment History
          </button>
        </div>

        <div className="customer-payments-table-heading">
          <div>
            <h2>
              {activeTab === "Outstanding Invoices"
                ? "Customer Invoices"
                : "Recorded Payments"}
            </h2>
            <p>
              {activeTab === "Outstanding Invoices"
                ? "Review invoice balances and record customer payments."
                : "View customer payments and their associated invoice references."}
            </p>
          </div>
          <span>
            {activeTab === "Outstanding Invoices"
              ? `${filteredInvoices.length} invoices`
              : `${filteredPayments.length} payments`}
          </span>
        </div>

        <div className="customer-payments-toolbar">
          <div className="customer-payments-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customer, invoice or reference..."
            />
          </div>

          {activeTab === "Outstanding Invoices" && (
            <div className="customer-payments-filters">
              <div className="customer-payments-filter">
                <Filter size={14} />
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                >
                  <option value="Outstanding">Outstanding only</option>
                  <option value="All">All invoice statuses</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Partially Paid">Partially paid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <select
                className="customer-payments-select"
                value={ageingFilter}
                onChange={(event) => setAgeingFilter(event.target.value)}
              >
                <option value="All">All ageing periods</option>
                <option value="Current">Current</option>
                <option value="1–30 days">1–30 days</option>
                <option value="31–60 days">31–60 days</option>
                <option value="61–90 days">61–90 days</option>
                <option value="Over 90 days">Over 90 days</option>
              </select>

              {(search ||
                statusFilter !== "Outstanding" ||
                ageingFilter !== "All") && (
                <button
                  className="customer-payments-clear"
                  onClick={clearFilters}
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {activeTab === "Outstanding Invoices" ? (
          <div className="customer-payments-table-wrap">
            <table className="customer-payments-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Invoice Amount</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredInvoices.map((invoice) => {
                  const balance = getInvoiceBalance(invoice);
                  const status = getInvoiceStatus(invoice);
                  const overdueDays = getDaysOverdue(invoice.dueDate);
                  const isOverdue = balance > 0 && overdueDays > 0;

                  return (
                    <tr key={invoice.id}>
                      <td>
                        <strong className="customer-invoice-number">
                          {invoice.id}
                        </strong>
                      </td>

                      <td>
                        <div className="customer-invoice-customer">
                          <div>
                            <UserRound size={15} />
                          </div>
                          <span>
                            <strong>{invoice.customer}</strong>
                            <small>{invoice.customerId}</small>
                          </span>
                        </div>
                      </td>

                      <td>{formatDate(invoice.issueDate)}</td>

                      <td>
                        <div className="customer-due-date">
                          <span>{formatDate(invoice.dueDate)}</span>
                          {isOverdue && (
                            <small>{overdueDays} days overdue</small>
                          )}
                        </div>
                      </td>

                      <td>{formatCurrency(invoice.amount)}</td>
                      <td>{formatCurrency(invoice.paid)}</td>

                      <td>
                        <strong
                          className={
                            balance > 0
                              ? "customer-balance-due"
                              : "customer-balance-paid"
                          }
                        >
                          {formatCurrency(balance)}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`customer-invoice-status ${
                            status === "Paid"
                              ? "invoice-paid"
                              : status === "Partially Paid"
                              ? "invoice-partial"
                              : "invoice-unpaid"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        {balance > 0 ? (
                          <button
                            className="customer-record-payment-btn"
                            onClick={() => openPaymentModal(invoice)}
                          >
                            <Plus size={14} />
                            Record
                          </button>
                        ) : (
                          <span className="customer-settled-label">
                            <CheckCircle2 size={14} />
                            Settled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan="9">
                      <div className="customer-payments-empty">
                        <FileText size={30} />
                        <strong>No invoices found</strong>
                        <span>Try changing your search or filters.</span>
                        <button onClick={clearFilters}>Clear filters</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="customer-payments-table-wrap">
            <table className="customer-payments-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Invoice</th>
                  <th>Method</th>
                  <th>Reference</th>
                  <th>Amount Received</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <strong className="customer-invoice-number">
                        {payment.id}
                      </strong>
                    </td>
                    <td>{formatDate(payment.date)}</td>
                    <td>{payment.customer}</td>
                    <td>{payment.invoiceId}</td>
                    <td>{payment.method}</td>
                    <td>{payment.reference}</td>
                    <td>
                      <strong className="customer-balance-paid">
                        {formatCurrency(payment.amount)}
                      </strong>
                    </td>
                    <td>
                      <button
                        className="customer-payment-view-btn"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan="8">
                      <div className="customer-payments-empty">
                        <Wallet size={30} />
                        <strong>No payment records found</strong>
                        <span>Try another search term.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="customer-payments-table-footer">
          <span>
            {activeTab === "Outstanding Invoices"
              ? "Invoice balances are calculated from invoice amount less recorded payments."
              : "Payment records are displayed in reverse chronological order."}
          </span>
        </div>
      </div>

      {showPaymentModal && selectedInvoice && (
        <div
          className="customer-payment-modal-overlay"
          onClick={closePaymentModal}
        >
          <div
            className="customer-payment-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="customer-payment-modal-header">
              <div>
                <h2>Record Customer Payment</h2>
                <p>Record money received against this invoice.</p>
              </div>
              <button onClick={closePaymentModal}>
                <X size={19} />
              </button>
            </div>

            <form onSubmit={recordPayment}>
              <div className="customer-payment-modal-body">
                <div className="customer-payment-invoice-summary">
                  <div>
                    <span>Customer</span>
                    <strong>{selectedInvoice.customer}</strong>
                  </div>
                  <div>
                    <span>Invoice reference</span>
                    <strong>{selectedInvoice.id}</strong>
                  </div>
                  <div>
                    <span>Invoice amount</span>
                    <strong>{formatCurrency(selectedInvoice.amount)}</strong>
                  </div>
                  <div>
                    <span>Previously paid</span>
                    <strong>{formatCurrency(selectedInvoice.paid)}</strong>
                  </div>
                  <div className="payment-balance-row">
                    <span>Outstanding balance</span>
                    <strong>
                      {formatCurrency(getInvoiceBalance(selectedInvoice))}
                    </strong>
                  </div>
                </div>

                <div className="customer-payment-form-grid">
                  <label>
                    Amount Received (₦) *
                    <input
                      type="number"
                      min="1"
                      max={getInvoiceBalance(selectedInvoice)}
                      step="1"
                      value={paymentForm.amount}
                      onChange={(event) =>
                        updatePaymentForm("amount", event.target.value)
                      }
                      required
                    />
                    <small>
                      Maximum payable:{" "}
                      {formatCurrency(getInvoiceBalance(selectedInvoice))}
                    </small>
                  </label>

                  <label>
                    Payment Method *
                    <select
                      value={paymentForm.method}
                      onChange={(event) =>
                        updatePaymentForm("method", event.target.value)
                      }
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cash">Cash</option>
                      <option value="POS Terminal">POS Terminal</option>
                    </select>
                  </label>

                  <label>
                    Payment Date *
                    <input
                      type="date"
                      max={getToday()}
                      value={paymentForm.date}
                      onChange={(event) =>
                        updatePaymentForm("date", event.target.value)
                      }
                      required
                    />
                  </label>

                  <label>
                    Payment Reference *
                    <input
                      value={paymentForm.reference}
                      onChange={(event) =>
                        updatePaymentForm("reference", event.target.value)
                      }
                      placeholder="Enter transaction reference"
                      required
                    />
                  </label>

                  <label className="payment-notes-field">
                    Notes
                    <textarea
                      rows="3"
                      value={paymentForm.notes}
                      onChange={(event) =>
                        updatePaymentForm("notes", event.target.value)
                      }
                      placeholder="Optional payment notes..."
                    />
                  </label>
                </div>

                {formError && (
                  <div className="customer-payment-error">
                    <AlertTriangle size={15} />
                    {formError}
                  </div>
                )}

                <div className="customer-payment-info-notice">
                  <AlertTriangle size={16} />
                  <span>
                    Recording a payment will reduce this invoice's
                    outstanding balance in this demo screen. Production
                    payments must be verified and recorded in the financial
                    ledger.
                  </span>
                </div>
              </div>

              <div className="customer-payment-modal-footer">
                <button
                  type="button"
                  className="customer-payment-cancel"
                  onClick={closePaymentModal}
                >
                  Cancel
                </button>
                <button type="submit" className="customer-payment-submit">
                  <CheckCircle2 size={16} />
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedPayment && (
        <div
          className="customer-payment-modal-overlay"
          onClick={() => setSelectedPayment(null)}
        >
          <div
            className="customer-payment-modal customer-payment-detail-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="customer-payment-modal-header">
              <div>
                <h2>Payment Details</h2>
                <p>{selectedPayment.id}</p>
              </div>
              <button onClick={() => setSelectedPayment(null)}>
                <X size={19} />
              </button>
            </div>

            <div className="customer-payment-modal-body">
              <div className="customer-payment-detail-amount">
                <div>
                  <CheckCircle2 size={20} />
                </div>
                <span>Payment recorded</span>
                <strong>{formatCurrency(selectedPayment.amount)}</strong>
              </div>

              <div className="customer-payment-detail-list">
                <div>
                  <span>Customer</span>
                  <strong>{selectedPayment.customer}</strong>
                </div>
                <div>
                  <span>Customer ID</span>
                  <strong>{selectedPayment.customerId}</strong>
                </div>
                <div>
                  <span>Invoice</span>
                  <strong>{selectedPayment.invoiceId}</strong>
                </div>
                <div>
                  <span>Payment date</span>
                  <strong>{formatDate(selectedPayment.date)}</strong>
                </div>
                <div>
                  <span>Payment method</span>
                  <strong>{selectedPayment.method}</strong>
                </div>
                <div>
                  <span>Reference</span>
                  <strong>{selectedPayment.reference}</strong>
                </div>
                <div>
                  <span>Notes</span>
                  <strong>{selectedPayment.notes || "No notes"}</strong>
                </div>
              </div>
            </div>

            <div className="customer-payment-modal-footer">
              <button
                className="customer-payment-cancel"
                onClick={() => setSelectedPayment(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerPayments;
