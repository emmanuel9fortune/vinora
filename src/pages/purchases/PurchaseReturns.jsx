
import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock,
  Eye,
  FileText,
  Filter,
  Package,
  Plus,
  Search,
  Truck,
  X,
} from "lucide-react";
import "../../styles/purchases.css";

const initialReturns = [
  {
    id: "RET-2026-0012",
    supplier: "MedPlus Distribution Ltd",
    product: "Paracetamol 500mg",
    batch: "PCM-2026-014",
    quantity: 24,
    unit: "packs",
    reason: "Damaged goods",
    date: "2026-11-20",
    status: "Pending Approval",
    amount: 19200,
    notes: "Outer cartons were damaged during delivery.",
    grn: "GRN-2026-0018",
    creditRef: "",
  },
  {
    id: "RET-2026-0011",
    supplier: "HealthBridge Pharmaceuticals",
    product: "Amoxicillin 500mg",
    batch: "AMX-2026-008",
    quantity: 10,
    unit: "packs",
    reason: "Incorrect product",
    date: "2026-11-19",
    status: "Approved",
    amount: 12500,
    notes: "Supplier delivered the wrong pack size.",
    grn: "GRN-2026-0015",
    creditRef: "",
  },
  {
    id: "RET-2026-0010",
    supplier: "PrimeCare Medical Supplies",
    product: "Vitamin C 1000mg",
    batch: "VTC-2026-003",
    quantity: 8,
    unit: "bottles",
    reason: "Near expiry",
    date: "2026-11-17",
    status: "Dispatched",
    amount: 16000,
    notes: "Supplier agreed to accept the near-expiry stock.",
    grn: "GRN-2026-0011",
    creditRef: "CN-2026-0081",
  },
  {
    id: "RET-2026-0009",
    supplier: "Wellness Pharma Nigeria",
    product: "Cetirizine 10mg",
    batch: "CTZ-2026-006",
    quantity: 5,
    unit: "packs",
    reason: "Defective product",
    date: "2026-11-15",
    status: "Rejected",
    amount: 4500,
    notes: "Supplier inspection found no manufacturing defect.",
    grn: "GRN-2026-0009",
    creditRef: "",
  },
];

const suppliers = [
  "MedPlus Distribution Ltd",
  "HealthBridge Pharmaceuticals",
  "PrimeCare Medical Supplies",
  "Wellness Pharma Nigeria",
];

const products = [
  {
    name: "Paracetamol 500mg",
    batch: "PCM-2026-014",
    supplier: "MedPlus Distribution Ltd",
    available: 120,
    unit: "packs",
    cost: 800,
  },
  {
    name: "Amoxicillin 500mg",
    batch: "AMX-2026-008",
    supplier: "HealthBridge Pharmaceuticals",
    available: 65,
    unit: "packs",
    cost: 1250,
  },
  {
    name: "Vitamin C 1000mg",
    batch: "VTC-2026-003",
    supplier: "PrimeCare Medical Supplies",
    available: 42,
    unit: "bottles",
    cost: 2000,
  },
  {
    name: "Cetirizine 10mg",
    batch: "CTZ-2026-006",
    supplier: "Wellness Pharma Nigeria",
    available: 90,
    unit: "packs",
    cost: 900,
  },
  {
    name: "Metformin 500mg",
    batch: "MET-2026-002",
    supplier: "MedPlus Distribution Ltd",
    available: 75,
    unit: "packs",
    cost: 1100,
  },
];

const statusClass = (status) => {
  if (status === "Dispatched") return "success";
  if (status === "Approved") return "info";
  if (status === "Rejected") return "danger";
  return "warning";
};

const formatCurrency = (amount) =>
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

function PurchaseReturns() {
  const [returns, setReturns] = useState(initialReturns);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDispatch, setShowDispatch] = useState(false);
  const [dispatchTarget, setDispatchTarget] = useState(null);
  const [creditReference, setCreditReference] = useState("");

  const [form, setForm] = useState({
    supplier: "",
    product: "",
    batch: "",
    quantity: "",
    reason: "",
    date: new Date().toISOString().slice(0, 10),
    grn: "",
    notes: "",
  });

  const selectedProduct = products.find(
    (item) => item.batch === form.batch
  );

  const estimatedAmount = selectedProduct
    ? Number(form.quantity || 0) * selectedProduct.cost
    : 0;

  const filteredReturns = useMemo(() => {
    return returns.filter((item) => {
      const matchesSearch = [
        item.id,
        item.supplier,
        item.product,
        item.batch,
        item.reason,
        item.grn,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [returns, search, statusFilter]);

  const pendingCount = returns.filter(
    (item) => item.status === "Pending Approval"
  ).length;

  const approvedCount = returns.filter(
    (item) => item.status === "Approved"
  ).length;

  const dispatchedCount = returns.filter(
    (item) => item.status === "Dispatched"
  ).length;

  const dispatchedValue = returns
    .filter((item) => item.status === "Dispatched")
    .reduce((total, item) => total + item.amount, 0);

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
      ...(field === "supplier"
        ? { product: "", batch: "" }
        : {}),
      ...(field === "product" ? { batch: "" } : {}),
    }));
  };

  const availableProducts = products.filter(
    (item) => item.supplier === form.supplier
  );

  const availableBatches = availableProducts.filter(
    (item) => item.name === form.product
  );

  const createReturn = (event) => {
    event.preventDefault();

    if (
      !form.supplier ||
      !form.product ||
      !form.batch ||
      !form.quantity ||
      !form.reason ||
      !form.grn
    ) {
      alert("Please complete all required fields.");
      return;
    }

    const quantity = Number(form.quantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      alert("Enter a valid whole-number quantity.");
      return;
    }

    if (!selectedProduct || quantity > selectedProduct.available) {
      alert("The return quantity exceeds the available batch quantity.");
      return;
    }

    const newReturn = {
      id: `RET-2026-${String(returns.length + 13).padStart(4, "0")}`,
      supplier: form.supplier,
      product: form.product,
      batch: form.batch,
      quantity,
      unit: selectedProduct.unit,
      reason: form.reason,
      date: form.date,
      status: "Pending Approval",
      amount: estimatedAmount,
      notes: form.notes,
      grn: form.grn,
      creditRef: "",
    };

    setReturns((previous) => [newReturn, ...previous]);
    setShowCreate(false);
    setForm({
      supplier: "",
      product: "",
      batch: "",
      quantity: "",
      reason: "",
      date: new Date().toISOString().slice(0, 10),
      grn: "",
      notes: "",
    });
  };

  const updateStatus = (id, status) => {
    setReturns((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );

    setSelectedReturn((previous) =>
      previous?.id === id ? { ...previous, status } : previous
    );
  };

  const openDetails = (item) => {
    setSelectedReturn(item);
    setShowDetails(true);
  };

  const openDispatch = (item) => {
    setDispatchTarget(item);
    setCreditReference("");
    setShowDispatch(true);
  };

  const confirmDispatch = (event) => {
    event.preventDefault();

    if (!dispatchTarget) return;

    updateStatus(dispatchTarget.id, "Dispatched");

    setReturns((previous) =>
      previous.map((item) =>
        item.id === dispatchTarget.id
          ? { ...item, creditRef: creditReference.trim() }
          : item
      )
    );

    setSelectedReturn((previous) =>
      previous?.id === dispatchTarget.id
        ? { ...previous, status: "Dispatched", creditRef: creditReference.trim() }
        : previous
    );

    setShowDispatch(false);
    setDispatchTarget(null);
    setCreditReference("");
  };

  return (
    <div className="purchase-returns-page">
      <div className="purchase-returns-header">
        <div>
          <div className="purchase-breadcrumb">
            Purchasing <span>/</span> Purchase Returns
          </div>
          <h1>Purchase Returns</h1>
          <p>
            Manage stock returned to suppliers and track return requests.
          </p>
        </div>

        <button
          className="returns-primary-btn"
          onClick={() => setShowCreate(true)}
        >
          <Plus size={18} />
          New Return
        </button>
      </div>

      <div className="returns-stats-grid">
        <div className="returns-stat-card">
          <div className="returns-stat-top">
            <span>Pending Approval</span>
            <span className="returns-stat-icon orange">
              <Clock size={19} />
            </span>
          </div>
          <h2>{pendingCount}</h2>
          <small>Awaiting review</small>
        </div>

        <div className="returns-stat-card">
          <div className="returns-stat-top">
            <span>Approved Returns</span>
            <span className="returns-stat-icon blue">
              <Check size={19} />
            </span>
          </div>
          <h2>{approvedCount}</h2>
          <small>Ready for dispatch</small>
        </div>

        <div className="returns-stat-card">
          <div className="returns-stat-top">
            <span>Dispatched Returns</span>
            <span className="returns-stat-icon green">
              <Truck size={19} />
            </span>
          </div>
          <h2>{dispatchedCount}</h2>
          <small>Confirmed with suppliers</small>
        </div>

        <div className="returns-stat-card">
          <div className="returns-stat-top">
            <span>Dispatched Value</span>
            <span className="returns-stat-icon purple">
              <ArrowUpRight size={19} />
            </span>
          </div>
          <h2 className="returns-stat-money">
            {formatCurrency(dispatchedValue)}
          </h2>
          <small>Estimated returned stock value</small>
        </div>
      </div>

      <div className="returns-information-banner">
        <div className="returns-banner-icon">
          <FileText size={20} />
        </div>
        <div>
          <strong>Stock control and return traceability</strong>
          <p>
            Return requests do not change inventory. Stock is deducted only
            after an approved return has been confirmed as dispatched.
          </p>
        </div>
      </div>

      <section className="returns-table-card">
        <div className="returns-table-heading">
          <div>
            <h2>Return Records</h2>
            <p>Review and manage supplier return transactions.</p>
          </div>
          <div className="returns-record-count">
            {filteredReturns.length} records
          </div>
        </div>

        <div className="returns-toolbar">
          <div className="returns-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search reference, supplier, product..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="returns-filter">
            <Filter size={17} />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All statuses</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Rejected">Rejected</option>
            </select>
            <ChevronDown size={15} />
          </div>
        </div>

        <div className="returns-table-wrapper">
          <table className="returns-table">
            <thead>
              <tr>
                <th>Return Reference</th>
                <th>Supplier</th>
                <th>Product / Batch</th>
                <th>Quantity</th>
                <th>Return Value</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredReturns.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong className="returns-reference">{item.id}</strong>
                    <small>{item.grn}</small>
                  </td>
                  <td>{item.supplier}</td>
                  <td>
                    <strong>{item.product}</strong>
                    <small>{item.batch}</small>
                  </td>
                  <td>
                    {item.quantity} {item.unit}
                  </td>
                  <td className="returns-value">
                    {formatCurrency(item.amount)}
                  </td>
                  <td>{formatDate(item.date)}</td>
                  <td>
                    <span
                      className={`returns-status ${statusClass(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="returns-view-btn"
                      onClick={() => openDetails(item)}
                      title="View return"
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredReturns.length === 0 && (
                <tr>
                  <td colSpan="8" className="returns-empty">
                    <Package size={28} />
                    <strong>No return records found</strong>
                    <span>Try changing your search or filter.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Create Return Modal */}
      {showCreate && (
        <div
          className="returns-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowCreate(false);
          }}
        >
          <div className="returns-modal">
            <div className="returns-modal-header">
              <div>
                <h2>Create Purchase Return</h2>
                <p>Provide the details of the stock being returned.</p>
              </div>
              <button onClick={() => setShowCreate(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={createReturn}>
              <div className="returns-form-grid">
                <label className="returns-form-full">
                  Supplier *
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

                <label className="returns-form-full">
                  Product *
                  <select
                    value={form.product}
                    onChange={(event) =>
                      updateForm("product", event.target.value)
                    }
                    disabled={!form.supplier}
                    required
                  >
                    <option value="">Select product</option>
                    {[
                      ...new Set(
                        availableProducts.map((item) => item.name)
                      ),
                    ].map((product) => (
                      <option key={product} value={product}>
                        {product}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="returns-form-full">
                  Original Batch *
                  <select
                    value={form.batch}
                    onChange={(event) =>
                      updateForm("batch", event.target.value)
                    }
                    disabled={!form.product}
                    required
                  >
                    <option value="">Select batch</option>
                    {availableBatches.map((batch) => (
                      <option key={batch.batch} value={batch.batch}>
                        {batch.batch} — {batch.available} {batch.unit} available
                      </option>
                    ))}
                  </select>
                </label>

                {selectedProduct && (
                  <div className="returns-batch-info returns-form-full">
                    <span>
                      Available quantity:{" "}
                      <strong>
                        {selectedProduct.available} {selectedProduct.unit}
                      </strong>
                    </span>
                    <span>
                      Unit cost:{" "}
                      <strong>{formatCurrency(selectedProduct.cost)}</strong>
                    </span>
                  </div>
                )}

                <label>
                  Return Quantity *
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct?.available || undefined}
                    step="1"
                    value={form.quantity}
                    onChange={(event) =>
                      updateForm("quantity", event.target.value)
                    }
                    placeholder="Enter quantity"
                    required
                  />
                </label>

                <label>
                  Return Date *
                  <input
                    type="date"
                    value={form.date}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(event) =>
                      updateForm("date", event.target.value)
                    }
                    required
                  />
                </label>

                <label>
                  Return Reason *
                  <select
                    value={form.reason}
                    onChange={(event) =>
                      updateForm("reason", event.target.value)
                    }
                    required
                  >
                    <option value="">Select reason</option>
                    <option>Damaged goods</option>
                    <option>Expired product</option>
                    <option>Near expiry</option>
                    <option>Incorrect product</option>
                    <option>Defective product</option>
                    <option>Incorrect quantity</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  Original GRN Reference *
                  <input
                    value={form.grn}
                    onChange={(event) =>
                      updateForm("grn", event.target.value)
                    }
                    placeholder="e.g. GRN-2026-0018"
                    required
                  />
                </label>

                <label className="returns-form-full">
                  Additional Notes
                  <textarea
                    rows="3"
                    value={form.notes}
                    onChange={(event) =>
                      updateForm("notes", event.target.value)
                    }
                    placeholder="Describe the reason for this return..."
                  />
                </label>
              </div>

              <div className="returns-estimate">
                <span>Estimated return value</span>
                <strong>{formatCurrency(estimatedAmount)}</strong>
                <small>
                  Based on the recorded batch unit cost. Final supplier credit
                  may differ.
                </small>
              </div>

              <div className="returns-modal-actions">
                <button
                  type="button"
                  className="returns-secondary-btn"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="returns-primary-btn">
                  Create Return Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Details Modal */}
      {showDetails && selectedReturn && (
        <div
          className="returns-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowDetails(false);
          }}
        >
          <div className="returns-modal returns-detail-modal">
            <div className="returns-modal-header">
              <div>
                <h2>Return Details</h2>
                <p>{selectedReturn.id}</p>
              </div>
              <button onClick={() => setShowDetails(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="returns-detail-status">
              <span
                className={`returns-status ${statusClass(selectedReturn.status)}`}
              >
                {selectedReturn.status}
              </span>
              <span>{formatDate(selectedReturn.date)}</span>
            </div>

            <div className="returns-detail-grid">
              <div>
                <small>Supplier</small>
                <strong>{selectedReturn.supplier}</strong>
              </div>
              <div>
                <small>Original GRN</small>
                <strong>{selectedReturn.grn}</strong>
              </div>
              <div>
                <small>Product</small>
                <strong>{selectedReturn.product}</strong>
              </div>
              <div>
                <small>Batch Number</small>
                <strong>{selectedReturn.batch}</strong>
              </div>
              <div>
                <small>Return Quantity</small>
                <strong>
                  {selectedReturn.quantity} {selectedReturn.unit}
                </strong>
              </div>
              <div>
                <small>Estimated Value</small>
                <strong>{formatCurrency(selectedReturn.amount)}</strong>
              </div>
              <div>
                <small>Reason</small>
                <strong>{selectedReturn.reason}</strong>
              </div>
              <div>
                <small>Supplier Credit Reference</small>
                <strong>{selectedReturn.creditRef || "Not recorded"}</strong>
              </div>
            </div>

            <div className="returns-detail-notes">
              <small>Additional Notes</small>
              <p>{selectedReturn.notes || "No additional notes provided."}</p>
            </div>

            <div className="returns-modal-actions">
              <button
                className="returns-secondary-btn"
                onClick={() => setShowDetails(false)}
              >
                Close
              </button>

              {selectedReturn.status === "Pending Approval" && (
                <>
                  <button
                    className="returns-danger-btn"
                    onClick={() => updateStatus(selectedReturn.id, "Rejected")}
                  >
                    <X size={16} /> Reject
                  </button>
                  <button
                    className="returns-primary-btn"
                    onClick={() => updateStatus(selectedReturn.id, "Approved")}
                  >
                    <Check size={16} /> Approve
                  </button>
                </>
              )}

              {selectedReturn.status === "Approved" && (
                <button
                  className="returns-primary-btn"
                  onClick={() => openDispatch(selectedReturn)}
                >
                  <Truck size={17} /> Confirm Dispatch
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Confirmation Modal */}
      {showDispatch && dispatchTarget && (
        <div className="returns-modal-overlay">
          <div className="returns-modal returns-dispatch-modal">
            <div className="returns-modal-header">
              <div>
                <h2>Confirm Supplier Dispatch</h2>
                <p>{dispatchTarget.id}</p>
              </div>
              <button onClick={() => setShowDispatch(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="returns-dispatch-warning">
              <ArrowDownLeft size={20} />
              <div>
                <strong>Confirm that the stock has left your premises.</strong>
                <p>
                  In the production system, this confirmation will create a
                  stock-out movement linked to the original batch.
                </p>
              </div>
            </div>

            <form onSubmit={confirmDispatch}>
              <label className="returns-form-full">
                Supplier Credit Note / Reference
                <input
                  value={creditReference}
                  onChange={(event) => setCreditReference(event.target.value)}
                  placeholder="Enter credit note reference, if available"
                />
              </label>

              <div className="returns-modal-actions">
                <button
                  type="button"
                  className="returns-secondary-btn"
                  onClick={() => setShowDispatch(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="returns-primary-btn">
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PurchaseReturns;
