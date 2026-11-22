
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ClipboardList,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  X,
  Package,
  CalendarDays,
  User,
  FileText,
} from "lucide-react";
import "../../styles/inventory.css";

const initialAdjustments = [
  {
    id: "ADJ-00032",
    date: "2026-11-21",
    product: "Vitamin C 1000mg",
    batch: "VTC-2026-008",
    systemQuantity: 150,
    physicalQuantity: 145,
    difference: -5,
    reason: "Damaged packaging",
    employee: "Peter Eze",
    status: "Approved",
    notes: "Five units had damaged packaging during inspection.",
  },
  {
    id: "ADJ-00031",
    date: "2026-11-21",
    product: "Paracetamol 500mg",
    batch: "PCM-2026-001",
    systemQuantity: 332,
    physicalQuantity: 330,
    difference: -2,
    reason: "Stock count discrepancy",
    employee: "Mary James",
    status: "Pending",
    notes: "Physical count was two units below the system quantity.",
  },
  {
    id: "ADJ-00030",
    date: "2026-11-20",
    product: "Amoxicillin 500mg",
    batch: "AMX-2026-014",
    systemQuantity: 85,
    physicalQuantity: 90,
    difference: 5,
    reason: "Stock count discrepancy",
    employee: "John Okafor",
    status: "Approved",
    notes: "Five additional units were identified during the stock count.",
  },
  {
    id: "ADJ-00029",
    date: "2026-11-19",
    product: "Vitamin C 1000mg",
    batch: "VTC-2026-008",
    systemQuantity: 153,
    physicalQuantity: 150,
    difference: -3,
    reason: "Stock count discrepancy",
    employee: "Mary James",
    status: "Approved",
    notes: "Count reconciled after physical verification.",
  },
  {
    id: "ADJ-00028",
    date: "2026-11-18",
    product: "Metformin 500mg",
    batch: "MET-2026-022",
    systemQuantity: 260,
    physicalQuantity: 260,
    difference: 0,
    reason: "Routine stock count",
    employee: "Sarah Williams",
    status: "Rejected",
    notes: "No stock difference was found.",
  },
];

const products = [
  {
    name: "Paracetamol 500mg",
    batch: "PCM-2026-001",
    quantity: 320,
  },
  {
    name: "Amoxicillin 500mg",
    batch: "AMX-2026-014",
    quantity: 85,
  },
  {
    name: "Vitamin C 1000mg",
    batch: "VTC-2026-008",
    quantity: 145,
  },
  {
    name: "Cetirizine 10mg",
    batch: "CTZ-2025-031",
    quantity: 12,
  },
  {
    name: "Metformin 500mg",
    batch: "MET-2026-022",
    quantity: 260,
  },
];

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function AdjustmentStatus({ status }) {
  const className =
    status === "Approved"
      ? "adjustment-approved"
      : status === "Pending"
        ? "adjustment-pending"
        : "adjustment-rejected";

  return (
    <span className={`adjustment-status ${className}`}>
      {status}
    </span>
  );
}

export default function StockAdjustments() {
  const [adjustments, setAdjustments] = useState(initialAdjustments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState(null);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    product: "",
    physicalQuantity: "",
    reason: "",
    notes: "",
  });

  const filteredAdjustments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return adjustments.filter((item) => {
      const matchesSearch =
        !query ||
        item.id.toLowerCase().includes(query) ||
        item.product.toLowerCase().includes(query) ||
        item.batch.toLowerCase().includes(query) ||
        item.employee.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [adjustments, search, statusFilter]);

  const pendingCount = adjustments.filter(
    (item) => item.status === "Pending"
  ).length;

  const approvedCount = adjustments.filter(
    (item) => item.status === "Approved"
  ).length;

  const positiveCount = adjustments.filter(
    (item) => item.difference > 0 && item.status === "Approved"
  ).length;

  const negativeCount = adjustments.filter(
    (item) => item.difference < 0 && item.status === "Approved"
  ).length;

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      product: "",
      physicalQuantity: "",
      reason: "",
      notes: "",
    });
    setFormError("");
  };

  const submitAdjustment = (event) => {
    event.preventDefault();

    const selectedProduct = products.find(
      (product) => product.batch === form.product
    );

    if (!selectedProduct) {
      setFormError("Please select a product and batch.");
      return;
    }

    if (
      form.physicalQuantity === "" ||
      !Number.isInteger(Number(form.physicalQuantity)) ||
      Number(form.physicalQuantity) < 0
    ) {
      setFormError("Enter a valid physical quantity (zero or greater).");
      return;
    }

    if (!form.reason) {
      setFormError("Please select an adjustment reason.");
      return;
    }

    const physicalQuantity = Number(form.physicalQuantity);
    const difference = physicalQuantity - selectedProduct.quantity;

    if (difference === 0) {
      setFormError("There is no difference to adjust.");
      return;
    }

    const newAdjustment = {
      id: `ADJ-${String(Date.now()).slice(-6)}`,
      date: new Date().toISOString().slice(0, 10),
      product: selectedProduct.name,
      batch: selectedProduct.batch,
      systemQuantity: selectedProduct.quantity,
      physicalQuantity,
      difference,
      reason: form.reason,
      employee: "Current user",
      status: "Pending",
      notes: form.notes.trim() || "No additional notes provided.",
    };

    setAdjustments((previous) => [newAdjustment, ...previous]);
    setShowModal(false);
    resetForm();
  };

  const reviewAdjustment = (id, status) => {
    setAdjustments((previous) =>
      previous.map((item) =>
        item.id === id && item.status === "Pending"
          ? { ...item, status }
          : item
      )
    );

    setSelectedAdjustment((previous) =>
      previous?.id === id ? { ...previous, status } : previous
    );
  };

  return (
    <div className="inventory-page stock-adjustments-page">
      <div className="inventory-page-header">
        <div>
          <div className="inventory-breadcrumb">
            Inventory <span>/</span> Stock Adjustments
          </div>
          <h1>Stock Adjustments</h1>
          <p>
            Record stock count differences, investigate discrepancies and
            manage adjustment approvals.
          </p>
        </div>

        <button
          type="button"
          className="inventory-primary-button"
          onClick={() => setShowModal(true)}
        >
          <Plus size={17} />
          New adjustment
        </button>
      </div>

      <div className="adjustment-summary-grid">
        <div className="adjustment-summary-card">
          <div className="adjustment-summary-icon blue">
            <ClipboardList size={19} />
          </div>
          <span>Total adjustments</span>
          <strong>{adjustments.length}</strong>
          <small>All recorded requests</small>
        </div>

        <div className="adjustment-summary-card">
          <div className="adjustment-summary-icon orange">
            <Clock3 size={19} />
          </div>
          <span>Pending approval</span>
          <strong>{pendingCount}</strong>
          <small>Awaiting review</small>
        </div>

        <div className="adjustment-summary-card">
          <div className="adjustment-summary-icon green">
            <CheckCircle2 size={19} />
          </div>
          <span>Approved</span>
          <strong>{approvedCount}</strong>
          <small>Reviewed requests</small>
        </div>

        <div className="adjustment-summary-card">
          <div className="adjustment-summary-icon red">
            <AlertTriangle size={19} />
          </div>
          <span>Rejected</span>
          <strong>
            {adjustments.filter((item) => item.status === "Rejected").length}
          </strong>
          <small>Requests not approved</small>
        </div>
      </div>

      <div className="adjustment-insight-grid">
        <div className="adjustment-insight-card">
          <span>Approved stock increases</span>
          <strong className="adjustment-positive">
            +{positiveCount} <small>records</small>
          </strong>
        </div>
        <div className="adjustment-insight-card">
          <span>Approved stock decreases</span>
          <strong className="adjustment-negative">
            −{negativeCount} <small>records</small>
          </strong>
        </div>
        <div className="adjustment-insight-card">
          <span>Approval workflow</span>
          <strong className="adjustment-workflow">
            Review required
          </strong>
        </div>
      </div>

      <section className="inventory-table-card">
        <div className="movement-section-heading">
          <div>
            <h2>Adjustment history</h2>
            <p>
              Review submitted adjustments and their approval status.
            </p>
          </div>
        </div>

        <div className="movement-toolbar">
          <div className="inventory-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search adjustment, product or batch..."
            />
            {search && (
              <button
                type="button"
                className="batch-clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="batch-filter-control">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by approval status"
            >
              <option value="All">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="inventory-table-wrapper">
          <table className="inventory-table adjustment-table">
            <thead>
              <tr>
                <th>Adjustment ID</th>
                <th>Date</th>
                <th>Product / Batch</th>
                <th>System qty.</th>
                <th>Physical qty.</th>
                <th>Difference</th>
                <th>Reason</th>
                <th>Requested by</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredAdjustments.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong className="adjustment-id">{item.id}</strong>
                  </td>
                  <td>{formatDate(item.date)}</td>
                  <td>
                    <div className="batch-product-name">{item.product}</div>
                    <div className="batch-product-number">{item.batch}</div>
                  </td>
                  <td>{item.systemQuantity}</td>
                  <td>{item.physicalQuantity}</td>
                  <td>
                    <strong
                      className={
                        item.difference > 0
                          ? "adjustment-positive"
                          : item.difference < 0
                            ? "adjustment-negative"
                            : ""
                      }
                    >
                      {item.difference > 0 ? "+" : ""}
                      {item.difference}
                    </strong>
                  </td>
                  <td>{item.reason}</td>
                  <td>{item.employee}</td>
                  <td>
                    <AdjustmentStatus status={item.status} />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="movement-view-button"
                      onClick={() => setSelectedAdjustment(item)}
                      aria-label={`View ${item.id}`}
                    >
                      <FileText size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredAdjustments.length === 0 && (
                <tr>
                  <td colSpan="10">
                    <div className="movement-empty-state">
                      <ClipboardList size={25} />
                      <strong>No adjustments found</strong>
                      <span>Try changing your search or filters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="movement-table-footer">
          Showing {filteredAdjustments.length} of {adjustments.length} records
        </div>
      </section>

      {showModal && (
        <div
          className="product-modal-overlay"
          onClick={() => {
            setShowModal(false);
            resetForm();
          }}
        >
          <form
            className="product-modal adjustment-form-modal"
            onSubmit={submitAdjustment}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="product-modal-header">
              <div>
                <h2>New stock adjustment</h2>
                <p>Submit a physical stock count for approval.</p>
              </div>
              <button
                type="button"
                className="product-modal-close"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                aria-label="Close adjustment form"
              >
                <X size={19} />
              </button>
            </div>

            <div className="adjustment-form-body">
              <label className="product-form-field">
                <span>Product and batch *</span>
                <select
                  value={form.product}
                  onChange={(event) => {
                    updateForm("product", event.target.value);
                    setFormError("");
                  }}
                >
                  <option value="">Select product / batch</option>
                  {products.map((product) => (
                    <option key={product.batch} value={product.batch}>
                      {product.name} — {product.batch}
                    </option>
                  ))}
                </select>
              </label>

              {form.product && (
                <div className="adjustment-system-quantity">
                  <Package size={17} />
                  <span>Current system quantity</span>
                  <strong>
                    {products.find((item) => item.batch === form.product)
                      ?.quantity ?? 0}{" "}
                    units
                  </strong>
                </div>
              )}

              <label className="product-form-field">
                <span>Physical quantity counted *</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.physicalQuantity}
                  onChange={(event) => {
                    updateForm("physicalQuantity", event.target.value);
                    setFormError("");
                  }}
                  placeholder="Enter actual physical quantity"
                />
              </label>

              {form.product && form.physicalQuantity !== "" && (
                <div className="adjustment-difference-preview">
                  <span>Calculated difference</span>
                  <strong>
                    {Number(form.physicalQuantity) -
                      (products.find((item) => item.batch === form.product)
                        ?.quantity ?? 0) >
                    0
                      ? "+"
                      : ""}
                    {Number(form.physicalQuantity) -
                      (products.find((item) => item.batch === form.product)
                        ?.quantity ?? 0)}{" "}
                    units
                  </strong>
                </div>
              )}

              <label className="product-form-field">
                <span>Adjustment reason *</span>
                <select
                  value={form.reason}
                  onChange={(event) => {
                    updateForm("reason", event.target.value);
                    setFormError("");
                  }}
                >
                  <option value="">Select reason</option>
                  <option value="Stock count discrepancy">
                    Stock count discrepancy
                  </option>
                  <option value="Damaged stock">Damaged stock</option>
                  <option value="Expired stock">Expired stock</option>
                  <option value="Lost or missing stock">
                    Lost or missing stock
                  </option>
                  <option value="Opening stock correction">
                    Opening stock correction
                  </option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="product-form-field">
                <span>Additional notes</span>
                <textarea
                  rows="3"
                  value={form.notes}
                  onChange={(event) => updateForm("notes", event.target.value)}
                  placeholder="Explain the discrepancy or provide supporting details..."
                />
              </label>

              {formError && (
                <div className="adjustment-form-error">{formError}</div>
              )}

              <div className="adjustment-pending-note">
                <Clock3 size={16} />
                <span>
                  This adjustment will be submitted as pending. It will not
                  change stock quantities until approved.
                </span>
              </div>
            </div>

            <div className="product-modal-actions">
              <button
                type="button"
                className="product-cancel-button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button type="submit" className="inventory-primary-button">
                Submit for approval
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedAdjustment && (
        <div
          className="product-modal-overlay"
          onClick={() => setSelectedAdjustment(null)}
        >
          <div
            className="product-modal adjustment-detail-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="product-modal-header">
              <div>
                <span className="movement-modal-eyebrow">
                  Adjustment record
                </span>
                <h2>{selectedAdjustment.id}</h2>
              </div>
              <button
                type="button"
                className="product-modal-close"
                onClick={() => setSelectedAdjustment(null)}
                aria-label="Close adjustment details"
              >
                <X size={19} />
              </button>
            </div>

            <div className="adjustment-detail-body">
              <div className="adjustment-detail-product">
                <div className="movement-detail-icon">
                  <Package size={23} />
                </div>
                <div>
                  <strong>{selectedAdjustment.product}</strong>
                  <span>{selectedAdjustment.batch}</span>
                </div>
              </div>

              <div className="adjustment-detail-grid">
                <div>
                  <span>Date</span>
                  <strong>{formatDate(selectedAdjustment.date)}</strong>
                </div>
                <div>
                  <span>Requested by</span>
                  <strong>{selectedAdjustment.employee}</strong>
                </div>
                <div>
                  <span>System quantity</span>
                  <strong>{selectedAdjustment.systemQuantity}</strong>
                </div>
                <div>
                  <span>Physical quantity</span>
                  <strong>{selectedAdjustment.physicalQuantity}</strong>
                </div>
                <div>
                  <span>Difference</span>
                  <strong
                    className={
                      selectedAdjustment.difference > 0
                        ? "adjustment-positive"
                        : "adjustment-negative"
                    }
                  >
                    {selectedAdjustment.difference > 0 ? "+" : ""}
                    {selectedAdjustment.difference}
                  </strong>
                </div>
                <div>
                  <span>Reason</span>
                  <strong>{selectedAdjustment.reason}</strong>
                </div>
              </div>

              <div className="adjustment-detail-notes">
                <span>Notes</span>
                <p>{selectedAdjustment.notes}</p>
              </div>

              <div className="adjustment-detail-status">
                <span>Approval status</span>
                <AdjustmentStatus status={selectedAdjustment.status} />
              </div>
            </div>

            <div className="product-modal-actions">
              {selectedAdjustment.status === "Pending" && (
                <>
                  <button
                    type="button"
                    className="adjustment-reject-button"
                    onClick={() =>
                      reviewAdjustment(selectedAdjustment.id, "Rejected")
                    }
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="inventory-primary-button"
                    onClick={() =>
                      reviewAdjustment(selectedAdjustment.id, "Approved")
                    }
                  >
                    <CheckCircle2 size={16} />
                    Approve
                  </button>
                </>
              )}
              <button
                type="button"
                className="product-cancel-button"
                onClick={() => setSelectedAdjustment(null)}
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
