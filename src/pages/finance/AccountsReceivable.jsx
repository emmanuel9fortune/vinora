
import { useMemo, useState } from "react";
import {
  Search,
  Wallet,
  Clock,
  CircleDollarSign,
  Eye,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Receipt,
  ArrowDownLeft
} from "lucide-react";
import "../../styles/finance.css";

const initialInvoices = [
  {
    id: "INV-2026-1048",
    customer: "Grace Okafor",
    customerId: "CUS-001",
    phone: "0803 000 1122",
    date: "2026-11-18",
    dueDate: "2026-11-25",
    total: 185000,
    paid: 85000,
    status: "Partially Paid",
    items: [
      { name: "Prescription medication", quantity: 2, amount: 95000 },
      { name: "Health supplements", quantity: 1, amount: 90000 },
    ],
  },
  {
    id: "INV-2026-1042",
    customer: "Daniel Adeyemi",
    customerId: "CUS-002",
    phone: "0805 000 2244",
    date: "2026-11-12",
    dueDate: "2026-11-22",
    total: 240000,
    paid: 100000,
    status: "Partially Paid",
    items: [
      { name: "Medical supplies", quantity: 4, amount: 140000 },
      { name: "Wellness products", quantity: 2, amount: 100000 },
    ],
  },
  {
    id: "INV-2026-1037",
    customer: "Amina Yusuf",
    customerId: "CUS-003",
    phone: "0806 000 3366",
    date: "2026-11-08",
    dueDate: "2026-11-20",
    total: 96000,
    paid: 0,
    status: "Unpaid",
    items: [
      { name: "General medication", quantity: 3, amount: 96000 },
    ],
  },
  {
    id: "INV-2026-1029",
    customer: "Peter Eze",
    customerId: "CUS-004",
    phone: "0807 000 4488",
    date: "2026-11-02",
    dueDate: "2026-11-16",
    total: 315000,
    paid: 150000,
    status: "Partially Paid",
    items: [
      { name: "Medical equipment", quantity: 1, amount: 215000 },
      { name: "Medical supplies", quantity: 2, amount: 100000 },
    ],
  },
  {
    id: "INV-2026-1018",
    customer: "Chinyere Nwosu",
    customerId: "CUS-005",
    phone: "0808 000 5566",
    date: "2026-10-25",
    dueDate: "2026-11-05",
    total: 125000,
    paid: 0,
    status: "Unpaid",
    items: [
      { name: "Prescription medication", quantity: 5, amount: 125000 },
    ],
  },
  {
    id: "INV-2026-1009",
    customer: "Michael Bello",
    customerId: "CUS-006",
    phone: "0809 000 6677",
    date: "2026-10-18",
    dueDate: "2026-10-30",
    total: 78000,
    paid: 78000,
    status: "Paid",
    items: [
      { name: "Health products", quantity: 2, amount: 78000 },
    ],
  },
];

const initialPayments = [
  {
    id: "PAY-001",
    invoiceId: "INV-2026-1048",
    customer: "Grace Okafor",
    amount: 85000,
    method: "Bank Transfer",
    date: "2026-11-20",
    reference: "TRF-88421",
  },
  {
    id: "PAY-002",
    invoiceId: "INV-2026-1042",
    customer: "Daniel Adeyemi",
    amount: 100000,
    method: "Cash",
    date: "2026-11-15",
    reference: "CASH-1042",
  },
  {
    id: "PAY-003",
    invoiceId: "INV-2026-1029",
    customer: "Peter Eze",
    amount: 150000,
    method: "POS",
    date: "2026-11-10",
    reference: "POS-72914",
  },
  {
    id: "PAY-004",
    invoiceId: "INV-2026-1009",
    customer: "Michael Bello",
    amount: 78000,
    method: "Bank Transfer",
    date: "2026-10-22",
    reference: "TRF-66109",
  },
];

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getOutstanding = (invoice) =>
  Math.max(invoice.total - invoice.paid, 0);

const getInvoiceStatus = (invoice) => {
  if (getOutstanding(invoice) <= 0) return "Paid";
  if (invoice.paid > 0) return "Partially Paid";
  return "Unpaid";
};

const isOverdue = (invoice) =>
  getOutstanding(invoice) > 0 &&
  new Date(`${invoice.dueDate}T23:59:59`) < new Date();

const emptyPayment = {
  amount: "",
  method: "Bank Transfer",
  date: new Date().toISOString().slice(0, 10),
  reference: "",
  note: "",
};

export default function AccountsReceivable() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [periodFilter, setPeriodFilter] = useState("All");
  const [modal, setModal] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentForm, setPaymentForm] = useState(emptyPayment);
  const [paymentError, setPaymentError] = useState("");

  const receivableTotal = invoices.reduce(
    (sum, invoice) => sum + getOutstanding(invoice),
    0
  );

  const overdueTotal = invoices
    .filter(isOverdue)
    .reduce((sum, invoice) => sum + getOutstanding(invoice), 0);

  const collectedTotal = invoices.reduce(
    (sum, invoice) => sum + invoice.paid,
    0
  );

  const filteredInvoices = useMemo(() => {
    const term = search.toLowerCase().trim();

    return invoices.filter((invoice) => {
      const invoiceStatus = getInvoiceStatus(invoice);
      const overdue = isOverdue(invoice);

      const matchesSearch =
        invoice.id.toLowerCase().includes(term) ||
        invoice.customer.toLowerCase().includes(term) ||
        invoice.customerId.toLowerCase().includes(term) ||
        invoice.phone.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Overdue" && overdue) ||
        (statusFilter === "Unpaid" && invoiceStatus === "Unpaid") ||
        (statusFilter === "Partially Paid" &&
          invoiceStatus === "Partially Paid") ||
        (statusFilter === "Paid" && invoiceStatus === "Paid");

      const outstanding = getOutstanding(invoice);
      const matchesPeriod =
        periodFilter === "All" ||
        (periodFilter === "Below 100000" && outstanding < 100000) ||
        (periodFilter === "100000-250000" &&
          outstanding >= 100000 &&
          outstanding <= 250000) ||
        (periodFilter === "Above 250000" && outstanding > 250000);

      return matchesSearch && matchesStatus && matchesPeriod;
    });
  }, [invoices, search, statusFilter, periodFilter]);

  const openPaymentModal = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentForm({
      ...emptyPayment,
      amount: String(getOutstanding(invoice)),
    });
    setPaymentError("");
    setModal("payment");
  };

  const openDetailsModal = (invoice) => {
    setSelectedInvoice(invoice);
    setModal("details");
  };

  const handlePaymentChange = (event) => {
    const { name, value } = event.target;
    setPaymentForm((current) => ({ ...current, [name]: value }));
  };

  const recordPayment = (event) => {
    event.preventDefault();
    setPaymentError("");

    if (!selectedInvoice) return;

    const amount = Number(paymentForm.amount);
    const outstanding = getOutstanding(selectedInvoice);

    if (!Number.isFinite(amount) || amount <= 0) {
      setPaymentError("Enter a valid payment amount.");
      return;
    }

    if (amount > outstanding) {
      setPaymentError(
        `Payment cannot exceed the outstanding balance of ${formatMoney(outstanding)}.`
      );
      return;
    }

    if (!paymentForm.date) {
      setPaymentError("Please select the payment date.");
      return;
    }

    const newPayment = {
      id: `PAY-${String(Date.now()).slice(-6)}`,
      invoiceId: selectedInvoice.id,
      customer: selectedInvoice.customer,
      amount,
      method: paymentForm.method,
      date: paymentForm.date,
      reference: paymentForm.reference.trim() || "No reference",
      note: paymentForm.note.trim(),
    };

    setPayments((current) => [newPayment, ...current]);

    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === selectedInvoice.id
          ? { ...invoice, paid: invoice.paid + amount }
          : invoice
      )
    );

    setSelectedInvoice((current) =>
      current
        ? { ...current, paid: current.paid + amount }
        : current
    );

    setModal("");
  };

  const invoicePayments = selectedInvoice
    ? payments.filter((payment) => payment.invoiceId === selectedInvoice.id)
    : [];

  const closeModal = () => {
    setModal("");
    setSelectedInvoice(null);
    setPaymentError("");
  };

  return (
    <div className="accounts-receivable-page">
      <div className="accounts-receivable-header">
        <div>
          <div className="accounts-receivable-breadcrumb">
            Finance <span>/</span> Accounts Receivable
          </div>
          <h1>Accounts Receivable</h1>
          <p>Track customer balances, outstanding invoices and payments.</p>
        </div>

        <button
          className="ar-primary-btn"
          onClick={() => {
            setSearch("");
            setStatusFilter("Unpaid");
          }}
        >
          <Receipt size={17} />
          View Unpaid Invoices
        </button>
      </div>

      <div className="ar-summary-grid">
        <div className="ar-summary-card">
          <div className="ar-summary-top">
            <span className="ar-summary-icon receivable">
              <Wallet size={20} />
            </span>
            <span>Total Receivables</span>
          </div>
          <h2>{formatMoney(receivableTotal)}</h2>
          <p>Outstanding customer balances</p>
        </div>

        <div className="ar-summary-card">
          <div className="ar-summary-top">
            <span className="ar-summary-icon overdue">
              <Clock size={20} />
            </span>
            <span>Overdue Balance</span>
          </div>
          <h2>{formatMoney(overdueTotal)}</h2>
          <p>Past due date and not fully paid</p>
        </div>

        <div className="ar-summary-card">
          <div className="ar-summary-top">
            <span className="ar-summary-icon collected">
              <CircleDollarSign size={20} />
            </span>
            <span>Payments Recorded</span>
          </div>
          <h2>{formatMoney(collectedTotal)}</h2>
          <p>Total payments on listed invoices</p>
        </div>
      </div>

      <div className="ar-table-card">
        <div className="ar-table-heading">
          <div>
            <h2>Customer Invoices</h2>
            <p>Review outstanding balances and record customer payments.</p>
          </div>
          <span className="ar-count">{filteredInvoices.length} invoices</span>
        </div>

        <div className="ar-toolbar">
          <div className="ar-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search invoice, customer or phone..."
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Overdue">Overdue</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Partially Paid">Partially paid</option>
            <option value="Paid">Paid</option>
          </select>

          <select
            value={periodFilter}
            onChange={(event) => setPeriodFilter(event.target.value)}
          >
            <option value="All">All balances</option>
            <option value="Below 100000">Below ₦100,000</option>
            <option value="100000-250000">₦100,000–₦250,000</option>
            <option value="Above 250000">Above ₦250,000</option>
          </select>
        </div>

        <div className="ar-table-wrap">
          <table className="ar-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Invoice Total</th>
                <th>Outstanding</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const outstanding = getOutstanding(invoice);
                const status = getInvoiceStatus(invoice);
                const overdue = isOverdue(invoice);

                return (
                  <tr key={invoice.id}>
                    <td>
                      <strong className="ar-invoice-number">{invoice.id}</strong>
                    </td>
                    <td>
                      <div className="ar-customer-cell">
                        <strong>{invoice.customer}</strong>
                        <span>{invoice.customerId}</span>
                      </div>
                    </td>
                    <td>{formatDate(invoice.date)}</td>
                    <td>
                      <span className={overdue ? "ar-due-date overdue" : "ar-due-date"}>
                        {formatDate(invoice.dueDate)}
                      </span>
                    </td>
                    <td>{formatMoney(invoice.total)}</td>
                    <td className="ar-outstanding">
                      {formatMoney(outstanding)}
                    </td>
                    <td>
                      <span
                        className={`ar-status ${overdue ? "overdue" : status.toLowerCase().replace(" ", "-")}`}
                      >
                        {overdue ? "Overdue" : status}
                      </span>
                    </td>
                    <td>
                      <div className="ar-row-actions">
                        <button
                          title="View invoice"
                          onClick={() => openDetailsModal(invoice)}
                        >
                          <Eye size={17} />
                        </button>
                        {outstanding > 0 && (
                          <button
                            title="Record payment"
                            className="ar-pay-action"
                            onClick={() => openPaymentModal(invoice)}
                          >
                            <Plus size={17} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan="8">
                    <div className="ar-empty">
                      <Receipt size={28} />
                      <strong>No invoices found</strong>
                      <span>Try changing your search or filters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="ar-table-footer">
          Showing {filteredInvoices.length} of {invoices.length} invoices
        </div>
      </div>

      <div className="ar-payment-history-card">
        <div className="ar-table-heading">
          <div>
            <h2>Recent Customer Payments</h2>
            <p>Latest payments recorded against customer invoices.</p>
          </div>
        </div>

        <div className="ar-payment-list">
          {payments.slice(0, 5).map((payment) => (
            <div className="ar-payment-row" key={payment.id}>
              <span className="ar-payment-icon">
                <ArrowDownLeft size={18} />
              </span>
              <div className="ar-payment-main">
                <strong>{payment.customer}</strong>
                <span>
                  {payment.invoiceId} · {payment.method} · {formatDate(payment.date)}
                </span>
              </div>
              <div className="ar-payment-amount">
                <strong>{formatMoney(payment.amount)}</strong>
                <span>{payment.reference}</span>
              </div>
            </div>
          ))}

          {payments.length === 0 && (
            <div className="ar-empty">
              <CircleDollarSign size={28} />
              <strong>No payments recorded</strong>
              <span>Customer payments will appear here.</span>
            </div>
          )}
        </div>
      </div>

      {modal === "payment" && selectedInvoice && (
        <div className="ar-modal-overlay" onClick={closeModal}>
          <div className="ar-modal" onClick={(event) => event.stopPropagation()}>
            <div className="ar-modal-header">
              <div>
                <h2>Record Customer Payment</h2>
                <p>{selectedInvoice.id}</p>
              </div>
              <button className="ar-modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="ar-payment-invoice-info">
              <div>
                <span>Customer</span>
                <strong>{selectedInvoice.customer}</strong>
              </div>
              <div>
                <span>Outstanding Balance</span>
                <strong>{formatMoney(getOutstanding(selectedInvoice))}</strong>
              </div>
            </div>

            <form className="ar-modal-form" onSubmit={recordPayment}>
              <label>
                Payment Amount (₦) *
                <input
                  type="number"
                  name="amount"
                  min="0.01"
                  max={getOutstanding(selectedInvoice)}
                  step="0.01"
                  value={paymentForm.amount}
                  onChange={handlePaymentChange}
                  required
                />
              </label>

              <label>
                Payment Method *
                <select
                  name="method"
                  value={paymentForm.method}
                  onChange={handlePaymentChange}
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="POS">POS / Card Terminal</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label>
                Payment Date *
                <input
                  type="date"
                  name="date"
                  value={paymentForm.date}
                  onChange={handlePaymentChange}
                  required
                />
              </label>

              <label>
                Reference Number
                <input
                  name="reference"
                  value={paymentForm.reference}
                  onChange={handlePaymentChange}
                  placeholder="Bank or transaction reference"
                />
              </label>

              <label>
                Note
                <textarea
                  name="note"
                  rows="3"
                  value={paymentForm.note}
                  onChange={handlePaymentChange}
                  placeholder="Optional payment note"
                />
              </label>

              {paymentError && (
                <div className="ar-form-error">
                  <AlertCircle size={16} />
                  {paymentError}
                </div>
              )}

              <div className="ar-modal-footer">
                <button
                  type="button"
                  className="ar-secondary-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="ar-primary-btn">
                  <CheckCircle2 size={17} />
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === "details" && selectedInvoice && (
        <div className="ar-modal-overlay" onClick={closeModal}>
          <div
            className="ar-modal ar-details-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="ar-modal-header">
              <div>
                <h2>Invoice Details</h2>
                <p>{selectedInvoice.id}</p>
              </div>
              <button className="ar-modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="ar-details-customer">
              <div>
                <span>Customer</span>
                <strong>{selectedInvoice.customer}</strong>
                <small>{selectedInvoice.phone}</small>
              </div>
              <span
                className={`ar-status ${isOverdue(selectedInvoice) ? "overdue" : getInvoiceStatus(selectedInvoice).toLowerCase().replace(" ", "-")}`}
              >
                {isOverdue(selectedInvoice)
                  ? "Overdue"
                  : getInvoiceStatus(selectedInvoice)}
              </span>
            </div>

            <div className="ar-details-dates">
              <div>
                <span>Invoice Date</span>
                <strong>{formatDate(selectedInvoice.date)}</strong>
              </div>
              <div>
                <span>Due Date</span>
                <strong>{formatDate(selectedInvoice.dueDate)}</strong>
              </div>
            </div>

            <div className="ar-invoice-items">
              <h3>Invoice Items</h3>
              {selectedInvoice.items.map((item, index) => (
                <div className="ar-invoice-item" key={`${item.name}-${index}`}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <strong>{formatMoney(item.amount)}</strong>
                </div>
              ))}
            </div>

            <div className="ar-invoice-totals">
              <div>
                <span>Invoice Total</span>
                <strong>{formatMoney(selectedInvoice.total)}</strong>
              </div>
              <div>
                <span>Amount Paid</span>
                <strong>{formatMoney(selectedInvoice.paid)}</strong>
              </div>
              <div className="outstanding">
                <span>Outstanding</span>
                <strong>{formatMoney(getOutstanding(selectedInvoice))}</strong>
              </div>
            </div>

            <div className="ar-details-payments">
              <h3>Payments on this Invoice</h3>
              {invoicePayments.length > 0 ? (
                invoicePayments.map((payment) => (
                  <div className="ar-details-payment-row" key={payment.id}>
                    <div>
                      <strong>{formatDate(payment.date)}</strong>
                      <span>{payment.method} · {payment.reference}</span>
                    </div>
                    <strong>{formatMoney(payment.amount)}</strong>
                  </div>
                ))
              ) : (
                <p>No payment has been recorded for this invoice.</p>
              )}
            </div>

            {getOutstanding(selectedInvoice) > 0 && (
              <div className="ar-details-modal-action">
                <button
                  className="ar-primary-btn"
                  onClick={() => openPaymentModal(selectedInvoice)}
                >
                  <Plus size={17} />
                  Record Payment
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
