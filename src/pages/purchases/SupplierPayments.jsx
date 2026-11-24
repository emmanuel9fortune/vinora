
import { useMemo, useState } from "react";
import {
  Search,
  Wallet,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Eye,
  X,
  Plus,
  Filter,
  RotateCcw,
  ArrowDownLeft,
  Receipt,
  CreditCard,
  Banknote,
  Building2,
} from "lucide-react";
import "../../styles/purchases.css";

const initialInvoices = [
  {
    id: "INV-2026-0040",
    supplier: "HealthBridge Pharmaceuticals",
    supplierInvoice: "HB-INV-8841",
    amount: 46500,
    paidAmount: 20000,
    approvalStatus: "Approved",
    dueDate: "2026-12-04",
  },
  {
    id: "INV-2026-0038",
    supplier: "Wellness Pharma Nigeria",
    supplierInvoice: "WPN-INV-2201",
    amount: 8500,
    paidAmount: 8500,
    approvalStatus: "Approved",
    dueDate: "2026-11-25",
  },
  {
    id: "INV-2026-0037",
    supplier: "MedPlus Distribution Ltd",
    supplierInvoice: "MP-INV-8790",
    amount: 92000,
    paidAmount: 0,
    approvalStatus: "Approved",
    dueDate: "2026-11-19",
  },
  {
    id: "INV-2026-0036",
    supplier: "PrimeCare Medical Supplies",
    supplierInvoice: "PC-INV-7682",
    amount: 68000,
    paidAmount: 0,
    approvalStatus: "Pending Review",
    dueDate: "2026-12-10",
  },
  {
    id: "INV-2026-0035",
    supplier: "HealthBridge Pharmaceuticals",
    supplierInvoice: "HB-INV-8720",
    amount: 35000,
    paidAmount: 35000,
    approvalStatus: "Approved",
    dueDate: "2026-11-15",
  },
];

const initialPayments = [
  {
    id: "PAY-2026-0012",
    invoiceId: "INV-2026-0040",
    supplier: "HealthBridge Pharmaceuticals",
    amount: 20000,
    method: "Bank Transfer",
    reference: "TRF-982771",
    date: "2026-11-21",
    recordedBy: "Amina Yusuf",
    notes: "Initial part payment.",
  },
  {
    id: "PAY-2026-0011",
    invoiceId: "INV-2026-0038",
    supplier: "Wellness Pharma Nigeria",
    amount: 8500,
    method: "POS / Terminal",
    reference: "POS-772091",
    date: "2026-11-19",
    recordedBy: "Chinedu Okafor",
    notes: "Full invoice settlement.",
  },
  {
    id: "PAY-2026-0010",
    invoiceId: "INV-2026-0035",
    supplier: "HealthBridge Pharmaceuticals",
    amount: 35000,
    method: "Bank Transfer",
    reference: "TRF-982110",
    date: "2026-11-14",
    recordedBy: "Amina Yusuf",
    notes: "Invoice fully settled.",
  },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getBalance = (invoice) =>
  Math.max(0, Number(invoice.amount) - Number(invoice.paidAmount || 0));

const getPaymentStatus = (invoice) => {
  if (invoice.paidAmount >= invoice.amount) return "Paid";
  if (invoice.paidAmount > 0) return "Partially Paid";
  return "Unpaid";
};

function SupplierPayments() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [payments, setPayments] = useState(initialPayments);
  const [activeTab, setActiveTab] = useState("outstanding");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [form, setForm] = useState({
    invoiceId: "",
    amount: "",
    method: "Bank Transfer",
    date: new Date().toISOString().slice(0, 10),
    reference: "",
    notes: "",
  });

  const eligibleInvoices = invoices.filter(
    (invoice) =>
      invoice.approvalStatus === "Approved" && getBalance(invoice) > 0
  );

  const totalOutstanding = eligibleInvoices.reduce(
    (sum, invoice) => sum + getBalance(invoice),
    0
  );

  const totalPaid = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.paidAmount || 0),
    0
  );

  const totalPayments = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  const fullyPaidCount = invoices.filter(
    (invoice) => getPaymentStatus(invoice) === "Paid"
  ).length;

  const overdueInvoices = eligibleInvoices.filter(
    (invoice) => invoice.dueDate < new Date().toISOString().slice(0, 10)
  ).length;

  const filteredInvoices = useMemo(() => {
    const query = search.toLowerCase();

    return eligibleInvoices.filter((invoice) => {
      const matchesSearch = [
        invoice.id,
        invoice.supplier,
        invoice.supplierInvoice,
      ].some((value) => value.toLowerCase().includes(query));

      const status = getPaymentStatus(invoice);
      const matchesStatus =
        statusFilter === "All" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [eligibleInvoices, search, statusFilter]);

  const filteredPayments = useMemo(() => {
    const query = search.toLowerCase();

    return payments.filter((payment) =>
      [
        payment.id,
        payment.invoiceId,
        payment.supplier,
        payment.reference,
        payment.method,
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [payments, search]);

  const selectedFormInvoice = invoices.find(
    (invoice) => invoice.id === form.invoiceId
  );

  const selectedBalance = selectedFormInvoice
    ? getBalance(selectedFormInvoice)
    : 0;

  const statusClass = (status) => {
    if (status === "Paid") return "sp-status-success";
    if (status === "Partially Paid") return "sp-status-warning";
    if (status === "Unpaid") return "sp-status-info";
    return "sp-status-neutral";
  };

  const openPaymentModal = (invoice = null) => {
    const targetInvoice = invoice || eligibleInvoices[0];

    if (!targetInvoice) {
      alert("There are no approved invoices with outstanding balances.");
      return;
    }

    setForm({
      invoiceId: targetInvoice.id,
      amount: String(getBalance(targetInvoice)),
      method: "Bank Transfer",
      date: new Date().toISOString().slice(0, 10),
      reference: "",
      notes: "",
    });

    setShowPaymentModal(true);
  };

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleInvoiceChange = (invoiceId) => {
    const invoice = eligibleInvoices.find((item) => item.id === invoiceId);

    setForm((current) => ({
      ...current,
      invoiceId,
      amount: invoice ? String(getBalance(invoice)) : "",
    }));
  };

  const recordPayment = (event) => {
    event.preventDefault();

    const invoice = invoices.find((item) => item.id === form.invoiceId);
    const amount = Number(form.amount);

    if (!invoice || invoice.approvalStatus !== "Approved") {
      alert("Only approved invoices can receive payments.");
      return;
    }

    if (getBalance(invoice) <= 0) {
      alert("This invoice has already been fully paid.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Enter a valid payment amount.");
      return;
    }

    if (amount > getBalance(invoice)) {
      alert(
        `The payment cannot exceed the outstanding balance of ${formatCurrency(
          getBalance(invoice)
        )}.`
      );
      return;
    }

    if (!form.date || form.date > new Date().toISOString().slice(0, 10)) {
      alert("Select a valid payment date. Future-dated payments cannot be recorded as completed.");
      return;
    }

    if (!form.reference.trim()) {
      alert("Enter a payment transaction reference.");
      return;
    }

    const newPayment = {
      id: `PAY-2026-${String(payments.length + 13).padStart(4, "0")}`,
      invoiceId: invoice.id,
      supplier: invoice.supplier,
      amount,
      method: form.method,
      reference: form.reference.trim(),
      date: form.date,
      recordedBy: "Current User",
      notes: form.notes.trim(),
    };

    setInvoices((current) =>
      current.map((item) =>
        item.id === invoice.id
          ? { ...item, paidAmount: item.paidAmount + amount }
          : item
      )
    );

    setPayments((current) => [newPayment, ...current]);
    setShowPaymentModal(false);
    setActiveTab("history");
    setSearch("");
    setStatusFilter("All");
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  return (
    <div className="supplier-payments-page">
      <div className="sp-page-header">
        <div>
          <div className="sp-breadcrumb">Purchasing / Supplier Payments</div>
          <h1>Supplier Payments</h1>
          <p>
            Record payments, settle supplier invoices and monitor outstanding
            balances.
          </p>
        </div>

        <button
          className="sp-btn sp-btn-primary"
          onClick={() => openPaymentModal()}
        >
          <Plus size={17} />
          Record payment
        </button>
      </div>

      <div className="sp-stat-grid">
        <div className="sp-stat-card">
          <div className="sp-stat-icon sp-blue">
            <Wallet size={20} />
          </div>
          <div>
            <span>Outstanding payables</span>
            <h2>{formatCurrency(totalOutstanding)}</h2>
            <small>{eligibleInvoices.length} invoices awaiting payment</small>
          </div>
        </div>

        <div className="sp-stat-card">
          <div className="sp-stat-icon sp-green">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span>Total paid</span>
            <h2>{formatCurrency(totalPaid)}</h2>
            <small>Payments applied to recorded invoices</small>
          </div>
        </div>

        <div className="sp-stat-card">
          <div className="sp-stat-icon sp-purple">
            <Receipt size={20} />
          </div>
          <div>
            <span>Payment transactions</span>
            <h2>{payments.length}</h2>
            <small>{formatCurrency(totalPayments)} recorded</small>
          </div>
        </div>

        <div className="sp-stat-card">
          <div className="sp-stat-icon sp-orange">
            <AlertCircle size={20} />
          </div>
          <div>
            <span>Overdue invoices</span>
            <h2>{overdueInvoices}</h2>
            <small>{fullyPaidCount} invoices fully settled</small>
          </div>
        </div>
      </div>

      <div className="sp-notice">
        <AlertCircle size={19} />
        <div>
          <strong>Payment control</strong>
          <p>
            Record payments only after confirming that funds have been sent or
            received by the supplier. Each payment must have a transaction
            reference and remain linked to its supplier invoice.
          </p>
        </div>
      </div>

      <div className="sp-content-card">
        <div className="sp-tabs">
          <button
            className={activeTab === "outstanding" ? "active" : ""}
            onClick={() => setActiveTab("outstanding")}
          >
            <Clock3 size={16} />
            Outstanding invoices
            <span>{eligibleInvoices.length}</span>
          </button>

          <button
            className={activeTab === "history" ? "active" : ""}
            onClick={() => setActiveTab("history")}
          >
            <Receipt size={16} />
            Payment history
            <span>{payments.length}</span>
          </button>
        </div>

        <div className="sp-toolbar">
          <div className="sp-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                activeTab === "outstanding"
                  ? "Search invoice or supplier..."
                  : "Search payment, reference or supplier..."
              }
            />
          </div>

          {activeTab === "outstanding" && (
            <div className="sp-filter">
              <Filter size={16} />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="All">All payment statuses</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Partially Paid">Partially paid</option>
              </select>
            </div>
          )}

          <button
            className="sp-btn sp-btn-secondary sp-reset-btn"
            onClick={resetFilters}
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>

        {activeTab === "outstanding" ? (
          <div className="sp-table-wrap">
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Supplier</th>
                  <th>Due date</th>
                  <th>Invoice amount</th>
                  <th>Paid</th>
                  <th>Outstanding</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredInvoices.map((invoice) => {
                  const balance = getBalance(invoice);
                  const status = getPaymentStatus(invoice);

                  return (
                    <tr key={invoice.id}>
                      <td>
                        <strong className="sp-primary-text">{invoice.id}</strong>
                        <small>{invoice.supplierInvoice}</small>
                      </td>
                      <td>{invoice.supplier}</td>
                      <td>{formatDate(invoice.dueDate)}</td>
                      <td>{formatCurrency(invoice.amount)}</td>
                      <td>{formatCurrency(invoice.paidAmount)}</td>
                      <td>
                        <strong>{formatCurrency(balance)}</strong>
                      </td>
                      <td>
                        <span className={`sp-status ${statusClass(status)}`}>
                          {status}
                        </span>
                      </td>
                      <td>
                        <div className="sp-actions">
                          <button
                            className="sp-icon-btn"
                            title="View invoice"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="sp-btn sp-btn-primary sp-small-btn"
                            onClick={() => openPaymentModal(invoice)}
                          >
                            Pay
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan="8">
                      <div className="sp-empty">
                        <CheckCircle2 size={30} />
                        <strong>No outstanding invoices found</strong>
                        <span>
                          Approved invoices with unpaid balances will appear
                          here.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="sp-table-wrap">
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Supplier</th>
                  <th>Invoice</th>
                  <th>Payment date</th>
                  <th>Method</th>
                  <th>Reference</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <strong className="sp-primary-text">{payment.id}</strong>
                    </td>
                    <td>{payment.supplier}</td>
                    <td>{payment.invoiceId}</td>
                    <td>{formatDate(payment.date)}</td>
                    <td>{payment.method}</td>
                    <td>{payment.reference}</td>
                    <td>
                      <strong>{formatCurrency(payment.amount)}</strong>
                    </td>
                    <td>
                      <button
                        className="sp-icon-btn"
                        title="View payment"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan="8">
                      <div className="sp-empty">
                        <Receipt size={30} />
                        <strong>No payment records found</strong>
                        <span>Recorded supplier payments will appear here.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showPaymentModal && (
        <div className="sp-modal-backdrop">
          <form className="sp-modal" onSubmit={recordPayment}>
            <div className="sp-modal-header">
              <div>
                <span className="sp-modal-eyebrow">Accounts payable</span>
                <h2>Record supplier payment</h2>
                <p>Enter the payment details and link it to an invoice.</p>
              </div>
              <button
                type="button"
                className="sp-close-btn"
                onClick={() => setShowPaymentModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="sp-modal-body">
              <div className="sp-form-grid">
                <label className="sp-full-field">
                  Supplier invoice <span>*</span>
                  <select
                    value={form.invoiceId}
                    onChange={(event) =>
                      handleInvoiceChange(event.target.value)
                    }
                    required
                  >
                    <option value="">Select an approved invoice</option>
                    {eligibleInvoices.map((invoice) => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.id} — {invoice.supplier} — Balance:{" "}
                        {formatCurrency(getBalance(invoice))}
                      </option>
                    ))}
                  </select>
                </label>

                {selectedFormInvoice && (
                  <div className="sp-invoice-summary sp-full-field">
                    <div>
                      <span>Supplier</span>
                      <strong>{selectedFormInvoice.supplier}</strong>
                    </div>
                    <div>
                      <span>Invoice total</span>
                      <strong>
                        {formatCurrency(selectedFormInvoice.amount)}
                      </strong>
                    </div>
                    <div>
                      <span>Previously paid</span>
                      <strong>
                        {formatCurrency(selectedFormInvoice.paidAmount)}
                      </strong>
                    </div>
                    <div>
                      <span>Outstanding balance</span>
                      <strong className="sp-balance-text">
                        {formatCurrency(selectedBalance)}
                      </strong>
                    </div>
                  </div>
                )}

                <label>
                  Payment amount (₦) <span>*</span>
                  <input
                    type="number"
                    min="0.01"
                    max={selectedBalance}
                    step="0.01"
                    value={form.amount}
                    onChange={(event) =>
                      updateForm("amount", event.target.value)
                    }
                    placeholder="Enter payment amount"
                    required
                  />
                </label>

                <label>
                  Payment date <span>*</span>
                  <input
                    type="date"
                    max={new Date().toISOString().slice(0, 10)}
                    value={form.date}
                    onChange={(event) =>
                      updateForm("date", event.target.value)
                    }
                    required
                  />
                </label>

                <label>
                  Payment method <span>*</span>
                  <select
                    value={form.method}
                    onChange={(event) =>
                      updateForm("method", event.target.value)
                    }
                  >
                    <option value="Bank Transfer">Bank transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="POS / Terminal">POS / Terminal</option>
                  </select>
                </label>

                <label>
                  Transaction reference <span>*</span>
                  <input
                    value={form.reference}
                    onChange={(event) =>
                      updateForm("reference", event.target.value)
                    }
                    placeholder="Enter transfer or receipt reference"
                    required
                  />
                </label>

                <label className="sp-full-field">
                  Notes
                  <textarea
                    rows="3"
                    value={form.notes}
                    onChange={(event) =>
                      updateForm("notes", event.target.value)
                    }
                    placeholder="Optional payment notes..."
                  />
                </label>
              </div>

              <div className="sp-payment-warning">
                <AlertCircle size={17} />
                Ensure the payment has actually been completed before
                recording it. This demo does not connect to a bank or payment
                gateway.
              </div>
            </div>

            <div className="sp-modal-footer">
              <button
                type="button"
                className="sp-btn sp-btn-secondary"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="sp-btn sp-btn-primary">
                <CheckCircle2 size={16} />
                Confirm payment
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedInvoice && (
        <div className="sp-modal-backdrop">
          <div className="sp-modal sp-detail-modal">
            <div className="sp-modal-header">
              <div>
                <span className="sp-modal-eyebrow">Invoice payment details</span>
                <h2>{selectedInvoice.id}</h2>
                <p>{selectedInvoice.supplier}</p>
              </div>
              <button
                className="sp-close-btn"
                onClick={() => setSelectedInvoice(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="sp-modal-body">
              <div className="sp-detail-grid">
                <div>
                  <span>Supplier invoice</span>
                  <strong>{selectedInvoice.supplierInvoice}</strong>
                </div>
                <div>
                  <span>Payment status</span>
                  <strong>{getPaymentStatus(selectedInvoice)}</strong>
                </div>
                <div>
                  <span>Invoice amount</span>
                  <strong>{formatCurrency(selectedInvoice.amount)}</strong>
                </div>
                <div>
                  <span>Amount paid</span>
                  <strong>{formatCurrency(selectedInvoice.paidAmount)}</strong>
                </div>
                <div>
                  <span>Outstanding balance</span>
                  <strong className="sp-balance-text">
                    {formatCurrency(getBalance(selectedInvoice))}
                  </strong>
                </div>
                <div>
                  <span>Due date</span>
                  <strong>{formatDate(selectedInvoice.dueDate)}</strong>
                </div>
              </div>

              <h3 className="sp-history-title">Payments against this invoice</h3>
              <div className="sp-payment-history-list">
                {payments
                  .filter((payment) => payment.invoiceId === selectedInvoice.id)
                  .map((payment) => (
                    <div key={payment.id}>
                      <div>
                        <strong>{payment.id}</strong>
                        <span>
                          {formatDate(payment.date)} · {payment.method}
                        </span>
                        <small>Ref: {payment.reference}</small>
                      </div>
                      <strong>{formatCurrency(payment.amount)}</strong>
                    </div>
                  ))}

                {payments.filter(
                  (payment) => payment.invoiceId === selectedInvoice.id
                ).length === 0 && (
                  <div className="sp-no-history">
                    No payments have been recorded for this invoice.
                  </div>
                )}
              </div>
            </div>

            <div className="sp-modal-footer">
              {getBalance(selectedInvoice) > 0 &&
                selectedInvoice.approvalStatus === "Approved" && (
                  <button
                    className="sp-btn sp-btn-primary"
                    onClick={() => {
                      const invoice = selectedInvoice;
                      setSelectedInvoice(null);
                      openPaymentModal(invoice);
                    }}
                  >
                    <Plus size={16} />
                    Record payment
                  </button>
                )}
              <button
                className="sp-btn sp-btn-secondary"
                onClick={() => setSelectedInvoice(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPayment && (
        <div className="sp-modal-backdrop">
          <div className="sp-modal sp-detail-modal">
            <div className="sp-modal-header">
              <div>
                <span className="sp-modal-eyebrow">Payment record</span>
                <h2>{selectedPayment.id}</h2>
                <p>{selectedPayment.supplier}</p>
              </div>
              <button
                className="sp-close-btn"
                onClick={() => setSelectedPayment(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="sp-modal-body">
              <div className="sp-detail-grid">
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
                  <span>Amount</span>
                  <strong>{formatCurrency(selectedPayment.amount)}</strong>
                </div>
                <div>
                  <span>Recorded by</span>
                  <strong>{selectedPayment.recordedBy}</strong>
                </div>
              </div>

              {selectedPayment.notes && (
                <div className="sp-notes-box">
                  <strong>Notes</strong>
                  <p>{selectedPayment.notes}</p>
                </div>
              )}
            </div>

            <div className="sp-modal-footer">
              <button
                className="sp-btn sp-btn-secondary"
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

export default SupplierPayments;
