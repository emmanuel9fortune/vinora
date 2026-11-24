
import { useMemo, useState } from "react";
import {
  Search,
  FileText,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  Plus,
  Filter,
  CalendarDays,
  Wallet,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import "../../styles/purchases.css";

const initialInvoices = [
  {
    id: "INV-2026-0041",
    supplier: "MedPlus Distribution Ltd",
    supplierInvoice: "MP-INV-8842",
    purchaseOrder: "PO-2026-0018",
    receivedReference: "GRN-2026-0010",
    invoiceDate: "2026-11-23",
    dueDate: "2026-12-07",
    amount: 57500,
    paidAmount: 0,
    status: "Pending Review",
    notes: "Invoice received with delivery documents.",
  },
  {
    id: "INV-2026-0040",
    supplier: "HealthBridge Pharmaceuticals",
    supplierInvoice: "HB-INV-8841",
    purchaseOrder: "PO-2026-0017",
    receivedReference: "GRN-2026-0009",
    invoiceDate: "2026-11-20",
    dueDate: "2026-12-04",
    amount: 46500,
    paidAmount: 20000,
    status: "Partially Paid",
    notes: "Part payment recorded.",
  },
  {
    id: "INV-2026-0039",
    supplier: "PrimeCare Medical Supplies",
    supplierInvoice: "PC-INV-7710",
    purchaseOrder: "PO-2026-0016",
    receivedReference: "",
    invoiceDate: "2026-11-18",
    dueDate: "2026-12-02",
    amount: 162500,
    paidAmount: 0,
    status: "Awaiting Goods",
    notes: "Awaiting delivery confirmation.",
  },
  {
    id: "INV-2026-0038",
    supplier: "Wellness Pharma Nigeria",
    supplierInvoice: "WPN-INV-2201",
    purchaseOrder: "PO-2026-0015",
    receivedReference: "GRN-2026-0008",
    invoiceDate: "2026-11-18",
    dueDate: "2026-11-25",
    amount: 8500,
    paidAmount: 8500,
    status: "Paid",
    notes: "Fully settled.",
  },
  {
    id: "INV-2026-0037",
    supplier: "MedPlus Distribution Ltd",
    supplierInvoice: "MP-INV-8790",
    purchaseOrder: "PO-2026-0014",
    receivedReference: "GRN-2026-0007",
    invoiceDate: "2026-11-12",
    dueDate: "2026-11-19",
    amount: 92000,
    paidAmount: 0,
    status: "Overdue",
    notes: "Payment is overdue.",
  },
];

const suppliers = [
  "MedPlus Distribution Ltd",
  "HealthBridge Pharmaceuticals",
  "PrimeCare Medical Supplies",
  "Wellness Pharma Nigeria",
];

const purchaseOrders = [
  "PO-2026-0018",
  "PO-2026-0017",
  "PO-2026-0016",
  "PO-2026-0015",
  "PO-2026-0014",
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(amount || 0);

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

function SupplierInvoices() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    supplier: "",
    supplierInvoice: "",
    purchaseOrder: "",
    receivedReference: "",
    invoiceDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    amount: "",
    notes: "",
  });

  const filteredInvoices = useMemo(() => {
    const query = search.toLowerCase();

    return invoices.filter((invoice) => {
      const matchesSearch = [
        invoice.id,
        invoice.supplier,
        invoice.supplierInvoice,
        invoice.purchaseOrder,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, statusFilter]);

  const totalInvoiced = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.amount || 0),
    0
  );

  const totalPaid = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.paidAmount || 0),
    0
  );

  const totalOutstanding = invoices.reduce(
    (sum, invoice) => sum + getBalance(invoice),
    0
  );

  const pendingReview = invoices.filter(
    (invoice) => invoice.status === "Pending Review"
  ).length;

  const overdueCount = invoices.filter(
    (invoice) => invoice.status === "Overdue"
  ).length;

  const statusClass = (status) => {
    const classes = {
      Paid: "si-status-success",
      "Partially Paid": "si-status-warning",
      "Pending Review": "si-status-info",
      "Awaiting Goods": "si-status-purple",
      Overdue: "si-status-danger",
      Approved: "si-status-success",
      Disputed: "si-status-danger",
    };

    return classes[status] || "si-status-neutral";
  };

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const createInvoice = (event) => {
    event.preventDefault();

    if (
      !form.supplier ||
      !form.supplierInvoice.trim() ||
      !form.purchaseOrder ||
      !form.invoiceDate ||
      !form.dueDate ||
      Number(form.amount) <= 0
    ) {
      alert("Complete all required invoice fields with valid values.");
      return;
    }

    if (form.dueDate < form.invoiceDate) {
      alert("The due date cannot be earlier than the invoice date.");
      return;
    }

    const duplicate = invoices.some(
      (invoice) =>
        invoice.supplier.toLowerCase() === form.supplier.toLowerCase() &&
        invoice.supplierInvoice.toLowerCase() ===
          form.supplierInvoice.trim().toLowerCase()
    );

    if (duplicate) {
      alert("An invoice with this supplier invoice number already exists.");
      return;
    }

    const newInvoice = {
      id: `INV-2026-${String(invoices.length + 42).padStart(4, "0")}`,
      supplier: form.supplier,
      supplierInvoice: form.supplierInvoice.trim(),
      purchaseOrder: form.purchaseOrder,
      receivedReference: form.receivedReference.trim(),
      invoiceDate: form.invoiceDate,
      dueDate: form.dueDate,
      amount: Number(form.amount),
      paidAmount: 0,
      status: "Pending Review",
      notes: form.notes.trim(),
    };

    setInvoices((current) => [newInvoice, ...current]);
    setShowCreateModal(false);
    setForm({
      supplier: "",
      supplierInvoice: "",
      purchaseOrder: "",
      receivedReference: "",
      invoiceDate: new Date().toISOString().slice(0, 10),
      dueDate: "",
      amount: "",
      notes: "",
    });
  };

  const updateInvoiceStatus = (invoiceId, status) => {
    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === invoiceId ? { ...invoice, status } : invoice
      )
    );

    setSelectedInvoice((current) =>
      current?.id === invoiceId ? { ...current, status } : current
    );
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  return (
    <div className="supplier-invoices-page">
      <div className="si-page-header">
        <div>
          <div className="si-breadcrumb">Purchasing / Supplier Invoices</div>
          <h1>Supplier Invoices</h1>
          <p>
            Review supplier invoices, verify deliveries and monitor outstanding
            payables.
          </p>
        </div>

        <button
          className="si-btn si-btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={17} />
          Record invoice
        </button>
      </div>

      <div className="si-stat-grid">
        <div className="si-stat-card">
          <div className="si-stat-icon si-icon-blue">
            <FileText size={20} />
          </div>
          <div>
            <span>Total invoiced</span>
            <h2>{formatCurrency(totalInvoiced)}</h2>
            <small>{invoices.length} recorded invoices</small>
          </div>
        </div>

        <div className="si-stat-card">
          <div className="si-stat-icon si-icon-green">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span>Total paid</span>
            <h2>{formatCurrency(totalPaid)}</h2>
            <small>Payments recorded against invoices</small>
          </div>
        </div>

        <div className="si-stat-card">
          <div className="si-stat-icon si-icon-orange">
            <Wallet size={20} />
          </div>
          <div>
            <span>Outstanding balance</span>
            <h2>{formatCurrency(totalOutstanding)}</h2>
            <small>Remaining supplier liabilities</small>
          </div>
        </div>

        <div className="si-stat-card">
          <div className="si-stat-icon si-icon-red">
            <AlertCircle size={20} />
          </div>
          <div>
            <span>Overdue invoices</span>
            <h2>{overdueCount}</h2>
            <small>{pendingReview} awaiting review</small>
          </div>
        </div>
      </div>

      <div className="si-notice">
        <ShieldCheck size={19} />
        <div>
          <strong>Invoice verification</strong>
          <p>
            Match each supplier invoice to its purchase order and goods-received
            records before approval. An invoice must not be treated as proof
            that stock was delivered.
          </p>
        </div>
      </div>

      <div className="si-content-card">
        <div className="si-card-heading">
          <div>
            <h2>All supplier invoices</h2>
            <p>Review invoices and their payment status.</p>
          </div>
          <button className="si-btn si-btn-secondary" onClick={resetFilters}>
            <RotateCcw size={15} />
            Reset filters
          </button>
        </div>

        <div className="si-toolbar">
          <div className="si-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search invoice, supplier or PO..."
            />
          </div>

          <div className="si-filter">
            <Filter size={16} />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All statuses</option>
              <option value="Pending Review">Pending review</option>
              <option value="Awaiting Goods">Awaiting goods</option>
              <option value="Approved">Approved</option>
              <option value="Partially Paid">Partially paid</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Disputed">Disputed</option>
            </select>
          </div>
        </div>

        <div className="si-table-wrap">
          <table className="si-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Supplier</th>
                <th>Purchase order</th>
                <th>Invoice date</th>
                <th>Due date</th>
                <th>Invoice amount</th>
                <th>Outstanding</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <strong className="si-primary-text">{invoice.id}</strong>
                    <small>{invoice.supplierInvoice}</small>
                  </td>
                  <td>{invoice.supplier}</td>
                  <td>{invoice.purchaseOrder}</td>
                  <td>{formatDate(invoice.invoiceDate)}</td>
                  <td>{formatDate(invoice.dueDate)}</td>
                  <td>{formatCurrency(invoice.amount)}</td>
                  <td>
                    <strong>{formatCurrency(getBalance(invoice))}</strong>
                  </td>
                  <td>
                    <span className={`si-status ${statusClass(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="si-icon-btn"
                      title="View invoice"
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan="9">
                    <div className="si-empty">
                      <FileText size={30} />
                      <strong>No invoices found</strong>
                      <span>
                        Try changing your search or status filter.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="si-table-footer">
          Showing {filteredInvoices.length} of {invoices.length} invoices
        </div>
      </div>

      {showCreateModal && (
        <div className="si-modal-backdrop">
          <form className="si-modal" onSubmit={createInvoice}>
            <div className="si-modal-header">
              <div>
                <span className="si-modal-eyebrow">Accounts payable</span>
                <h2>Record supplier invoice</h2>
                <p>Enter the details shown on the supplier's invoice.</p>
              </div>
              <button
                type="button"
                className="si-close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="si-modal-body">
              <div className="si-form-grid">
                <label>
                  Supplier <span>*</span>
                  <select
                    value={form.supplier}
                    onChange={(event) =>
                      updateForm("supplier", event.target.value)
                    }
                    required
                  >
                    <option value="">Select supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier} value={supplier}>
                        {supplier}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Supplier invoice number <span>*</span>
                  <input
                    value={form.supplierInvoice}
                    onChange={(event) =>
                      updateForm("supplierInvoice", event.target.value)
                    }
                    placeholder="e.g. MP-INV-9001"
                    required
                  />
                </label>

                <label>
                  Purchase order <span>*</span>
                  <select
                    value={form.purchaseOrder}
                    onChange={(event) =>
                      updateForm("purchaseOrder", event.target.value)
                    }
                    required
                  >
                    <option value="">Select purchase order</option>
                    {purchaseOrders.map((order) => (
                      <option key={order} value={order}>
                        {order}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Goods received reference
                  <input
                    value={form.receivedReference}
                    onChange={(event) =>
                      updateForm("receivedReference", event.target.value)
                    }
                    placeholder="e.g. GRN-2026-0010"
                  />
                </label>

                <label>
                  Invoice date <span>*</span>
                  <input
                    type="date"
                    value={form.invoiceDate}
                    onChange={(event) =>
                      updateForm("invoiceDate", event.target.value)
                    }
                    required
                  />
                </label>

                <label>
                  Due date <span>*</span>
                  <input
                    type="date"
                    min={form.invoiceDate}
                    value={form.dueDate}
                    onChange={(event) =>
                      updateForm("dueDate", event.target.value)
                    }
                    required
                  />
                </label>

                <label className="si-full-field">
                  Invoice amount (₦) <span>*</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={(event) =>
                      updateForm("amount", event.target.value)
                    }
                    placeholder="Enter invoice amount"
                    required
                  />
                </label>

                <label className="si-full-field">
                  Notes
                  <textarea
                    rows="3"
                    value={form.notes}
                    onChange={(event) =>
                      updateForm("notes", event.target.value)
                    }
                    placeholder="Additional invoice information..."
                  />
                </label>
              </div>

              <div className="si-form-notice">
                <AlertCircle size={16} />
                New invoices are saved as Pending Review. Verify the purchase
                order and goods received records before approval.
              </div>
            </div>

            <div className="si-modal-footer">
              <button
                type="button"
                className="si-btn si-btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="si-btn si-btn-primary">
                <Plus size={16} />
                Save invoice
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedInvoice && (
        <div className="si-modal-backdrop">
          <div className="si-modal si-detail-modal">
            <div className="si-modal-header">
              <div>
                <span className="si-modal-eyebrow">Supplier invoice</span>
                <h2>{selectedInvoice.id}</h2>
                <p>{selectedInvoice.supplier}</p>
              </div>
              <button
                className="si-close-btn"
                onClick={() => setSelectedInvoice(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="si-modal-body">
              <div className="si-detail-status">
                <span className={`si-status ${statusClass(selectedInvoice.status)}`}>
                  {selectedInvoice.status}
                </span>
                <span>Supplier reference: {selectedInvoice.supplierInvoice}</span>
              </div>

              <div className="si-detail-grid">
                <div>
                  <span>Purchase order</span>
                  <strong>{selectedInvoice.purchaseOrder}</strong>
                </div>
                <div>
                  <span>Goods received reference</span>
                  <strong>{selectedInvoice.receivedReference || "Not linked"}</strong>
                </div>
                <div>
                  <span>Invoice date</span>
                  <strong>{formatDate(selectedInvoice.invoiceDate)}</strong>
                </div>
                <div>
                  <span>Due date</span>
                  <strong>{formatDate(selectedInvoice.dueDate)}</strong>
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
                  <strong className="si-outstanding-value">
                    {formatCurrency(getBalance(selectedInvoice))}
                  </strong>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div className="si-notes-box">
                  <strong>Notes</strong>
                  <p>{selectedInvoice.notes}</p>
                </div>
              )}

              <div className="si-detail-warning">
                <ShieldCheck size={17} />
                Invoice approval should follow quantity, price and delivery
                verification. Payment recording belongs in Supplier Payments.
              </div>
            </div>

            <div className="si-modal-footer si-detail-footer">
              {selectedInvoice.status === "Pending Review" && (
                <>
                  <button
                    className="si-btn si-btn-danger"
                    onClick={() =>
                      updateInvoiceStatus(selectedInvoice.id, "Disputed")
                    }
                  >
                    <AlertCircle size={16} />
                    Dispute invoice
                  </button>
                  <button
                    className="si-btn si-btn-primary"
                    onClick={() =>
                      updateInvoiceStatus(selectedInvoice.id, "Approved")
                    }
                  >
                    <CheckCircle2 size={16} />
                    Approve invoice
                  </button>
                </>
              )}

              {selectedInvoice.status === "Approved" && (
                <span className="si-approved-note">
                  <CheckCircle2 size={16} />
                  Approved for payment processing
                </span>
              )}

              <button
                className="si-btn si-btn-secondary"
                onClick={() => setSelectedInvoice(null)}
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

export default SupplierInvoices;
