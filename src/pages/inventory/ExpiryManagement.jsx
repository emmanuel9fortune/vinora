
import { useMemo, useState } from "react";
import {
  Search,
  CalendarClock,
  AlertTriangle,
  Package,
  ShieldAlert,
  Clock,
  Eye,
  X,
  ClipboardCheck,
  RotateCcw,
  Trash2,
  Ban,
} from "lucide-react";
import "../../styles/inventory.css";

const makeDate = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split("T")[0];
};

// Demonstration records. These will eventually come from the API.
const initialBatches = [
  {
    id: 1,
    product: "Paracetamol 500mg",
    batch: "PCM-2026-001",
    supplier: "Emzor Pharmaceuticals",
    expiryDate: makeDate(-12),
    quantity: 120,
    unitCost: 85,
  },
  {
    id: 2,
    product: "Amoxicillin 500mg",
    batch: "AMX-2026-014",
    supplier: "Fidson Healthcare",
    expiryDate: makeDate(12),
    quantity: 85,
    unitCost: 210,
  },
  {
    id: 3,
    product: "Vitamin C 1000mg",
    batch: "VTC-2026-008",
    supplier: "Juhel Nigeria",
    expiryDate: makeDate(25),
    quantity: 64,
    unitCost: 150,
  },
  {
    id: 4,
    product: "Cetirizine 10mg",
    batch: "CTZ-2026-022",
    supplier: "Emzor Pharmaceuticals",
    expiryDate: makeDate(48),
    quantity: 90,
    unitCost: 95,
  },
  {
    id: 5,
    product: "Metformin 500mg",
    batch: "MTF-2026-011",
    supplier: "Swiss Pharma",
    expiryDate: makeDate(76),
    quantity: 150,
    unitCost: 115,
  },
  {
    id: 6,
    product: "Omeprazole 20mg",
    batch: "OMP-2026-019",
    supplier: "Greenlife Pharmaceuticals",
    expiryDate: makeDate(125),
    quantity: 42,
    unitCost: 180,
  },
  {
    id: 7,
    product: "Artemether/Lumefantrine",
    batch: "AL-2026-031",
    supplier: "Mopson Pharmaceutical",
    expiryDate: makeDate(205),
    quantity: 38,
    unitCost: 320,
  },
];

const getDaysRemaining = (expiryDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(`${expiryDate}T00:00:00`);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
};

const getExpiryStatus = (days) => {
  if (days < 0) return "expired";
  if (days <= 30) return "critical";
  if (days <= 60) return "warning";
  if (days <= 90) return "upcoming";
  if (days <= 180) return "watch";
  return "healthy";
};

const statusLabels = {
  expired: "Expired",
  critical: "Critical",
  warning: "Expiring soon",
  upcoming: "Upcoming",
  watch: "Monitor",
  healthy: "Healthy",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function ExpiryManagement() {
  const [batches] = useState(initialBatches);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [disposition, setDisposition] = useState("quarantine");
  const [reason, setReason] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  const enrichedBatches = useMemo(
    () =>
      batches.map((batch) => {
        const daysRemaining = getDaysRemaining(batch.expiryDate);

        return {
          ...batch,
          daysRemaining,
          status: getExpiryStatus(daysRemaining),
          stockValue: batch.quantity * batch.unitCost,
        };
      }),
    [batches]
  );

  const filteredBatches = useMemo(() => {
    return enrichedBatches.filter((batch) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        batch.product.toLowerCase().includes(searchText) ||
        batch.batch.toLowerCase().includes(searchText) ||
        batch.supplier.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" || batch.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [enrichedBatches, search, statusFilter]);

  const summary = useMemo(() => {
    const expired = enrichedBatches.filter(
      (batch) => batch.daysRemaining < 0
    );

    const expiring30 = enrichedBatches.filter(
      (batch) => batch.daysRemaining >= 0 && batch.daysRemaining <= 30
    );

    const expiring60 = enrichedBatches.filter(
      (batch) => batch.daysRemaining >= 0 && batch.daysRemaining <= 60
    );

    const expiring90 = enrichedBatches.filter(
      (batch) => batch.daysRemaining >= 0 && batch.daysRemaining <= 90
    );

    const atRisk = enrichedBatches.filter(
      (batch) => batch.daysRemaining <= 90
    );

    return {
      expiredCount: expired.length,
      expiring30Count: expiring30.length,
      expiring60Count: expiring60.length,
      expiring90Count: expiring90.length,
      valueAtRisk: atRisk.reduce((total, batch) => total + batch.stockValue, 0),
      expiredValue: expired.reduce(
        (total, batch) => total + batch.stockValue,
        0
      ),
    };
  }, [enrichedBatches]);

  const openBatch = (batch) => {
    setSelectedBatch(batch);
    setDisposition(batch.daysRemaining < 0 ? "write-off" : "quarantine");
    setReason("");
    setRequestMessage("");
  };

  const submitDispositionRequest = (event) => {
    event.preventDefault();

    if (!reason.trim()) {
      setRequestMessage("Please provide a reason for this request.");
      return;
    }

    // Demo only: this does not change stock or create a real audit record.
    setRequestMessage(
      `Demo request prepared: ${disposition.replace("-", " ")} for batch ${selectedBatch.batch}. Backend approval and stock-ledger processing are not connected yet.`
    );
  };

  return (
    <div className="expiry-page">
      <div className="expiry-page-header">
        <div>
          <div className="expiry-breadcrumb">
            Inventory <span>/</span> Expiry Management
          </div>
          <h1>Expiry Management</h1>
          <p>
            Monitor product expiry dates and manage batches that require
            attention.
          </p>
        </div>

        <div className="expiry-header-note">
          <CalendarClock size={18} />
          <span>Expiry monitoring</span>
        </div>
      </div>

      <div className="expiry-alert-banner">
        <div className="expiry-alert-icon">
          <AlertTriangle size={20} />
        </div>
        <div>
          <strong>Review stock approaching expiry</strong>
          <p>
            {summary.expiredCount} expired batch(es) and{" "}
            {summary.expiring30Count} batch(es) expiring within 30 days need
            attention.
          </p>
        </div>
      </div>

      <div className="expiry-summary-grid">
        <div className="expiry-summary-card">
          <div className="expiry-summary-top">
            <span>Expired batches</span>
            <span className="expiry-summary-icon danger">
              <ShieldAlert size={18} />
            </span>
          </div>
          <strong>{summary.expiredCount}</strong>
          <small>{formatCurrency(summary.expiredValue)} stock value</small>
        </div>

        <div className="expiry-summary-card">
          <div className="expiry-summary-top">
            <span>Within 30 days</span>
            <span className="expiry-summary-icon danger">
              <AlertTriangle size={18} />
            </span>
          </div>
          <strong>{summary.expiring30Count}</strong>
          <small>Immediate attention</small>
        </div>

        <div className="expiry-summary-card">
          <div className="expiry-summary-top">
            <span>Within 60 days</span>
            <span className="expiry-summary-icon warning">
              <Clock size={18} />
            </span>
          </div>
          <strong>{summary.expiring60Count}</strong>
          <small>Requires monitoring</small>
        </div>

        <div className="expiry-summary-card">
          <div className="expiry-summary-top">
            <span>Within 90 days</span>
            <span className="expiry-summary-icon info">
              <CalendarClock size={18} />
            </span>
          </div>
          <strong>{summary.expiring90Count}</strong>
          <small>Upcoming expiry batches</small>
        </div>

        <div className="expiry-summary-card expiry-risk-card">
          <div className="expiry-summary-top">
            <span>Stock value at risk</span>
            <span className="expiry-summary-icon warning">
              <Package size={18} />
            </span>
          </div>
          <strong>{formatCurrency(summary.valueAtRisk)}</strong>
          <small>Expiring within 90 days, including expired stock</small>
        </div>
      </div>

      <div className="expiry-content-card">
        <div className="expiry-table-heading">
          <div>
            <h2>Batch expiry register</h2>
            <p>Review expiry dates and the value of stock at risk.</p>
          </div>
          <span className="expiry-record-count">
            {filteredBatches.length} records
          </span>
        </div>

        <div className="expiry-toolbar">
          <div className="expiry-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search product, batch or supplier..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter expiry status"
          >
            <option value="all">All statuses</option>
            <option value="expired">Expired</option>
            <option value="critical">Within 30 days</option>
            <option value="warning">31–60 days</option>
            <option value="upcoming">61–90 days</option>
            <option value="watch">91–180 days</option>
            <option value="healthy">Over 180 days</option>
          </select>
        </div>

        <div className="expiry-table-wrapper">
          <table className="expiry-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Batch number</th>
                <th>Supplier</th>
                <th>Expiry date</th>
                <th>Days remaining</th>
                <th>Quantity</th>
                <th>Stock value</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredBatches.map((batch) => (
                <tr key={batch.id}>
                  <td>
                    <strong>{batch.product}</strong>
                  </td>
                  <td>{batch.batch}</td>
                  <td>{batch.supplier}</td>
                  <td>{formatDate(batch.expiryDate)}</td>
                  <td>
                    <span
                      className={`expiry-days ${
                        batch.daysRemaining < 0
                          ? "is-expired"
                          : batch.daysRemaining <= 30
                            ? "is-critical"
                            : ""
                      }`}
                    >
                      {batch.daysRemaining < 0
                        ? `${Math.abs(batch.daysRemaining)} days overdue`
                        : `${batch.daysRemaining} days`}
                    </span>
                  </td>
                  <td>{batch.quantity.toLocaleString("en-NG")}</td>
                  <td>{formatCurrency(batch.stockValue)}</td>
                  <td>
                    <span className={`expiry-status ${batch.status}`}>
                      {statusLabels[batch.status]}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="expiry-view-button"
                      onClick={() => openBatch(batch)}
                      aria-label={`Inspect ${batch.batch}`}
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredBatches.length === 0 && (
                <tr>
                  <td colSpan="9" className="expiry-empty-state">
                    No batches match your search or selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="expiry-table-footer">
          <span>
            Showing {filteredBatches.length} of {batches.length} sample batches
          </span>
          <span>Values are based on recorded unit cost</span>
        </div>
      </div>

      {selectedBatch && (
        <div
          className="expiry-modal-overlay"
          onClick={() => setSelectedBatch(null)}
        >
          <div
            className="expiry-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="expiry-modal-header">
              <div>
                <span className="expiry-modal-eyebrow">Batch inspection</span>
                <h2>{selectedBatch.product}</h2>
                <p>{selectedBatch.batch}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBatch(null)}
                aria-label="Close batch inspection"
              >
                <X size={20} />
              </button>
            </div>

            <div className="expiry-detail-grid">
              <div>
                <span>Supplier</span>
                <strong>{selectedBatch.supplier}</strong>
              </div>
              <div>
                <span>Expiry date</span>
                <strong>{formatDate(selectedBatch.expiryDate)}</strong>
              </div>
              <div>
                <span>Quantity remaining</span>
                <strong>{selectedBatch.quantity}</strong>
              </div>
              <div>
                <span>Stock value</span>
                <strong>{formatCurrency(selectedBatch.stockValue)}</strong>
              </div>
              <div>
                <span>Days remaining</span>
                <strong>
                  {selectedBatch.daysRemaining < 0
                    ? `${Math.abs(selectedBatch.daysRemaining)} days overdue`
                    : `${selectedBatch.daysRemaining} days`}
                </strong>
              </div>
              <div>
                <span>Expiry status</span>
                <strong>{statusLabels[selectedBatch.status]}</strong>
              </div>
            </div>

            <div className="expiry-safety-note">
              <AlertTriangle size={17} />
              <p>
                Expired or potentially unsafe stock must not be sold or
                automatically returned to saleable inventory. Record the
                inspection and follow your organisation's authorised process.
              </p>
            </div>

            <form onSubmit={submitDispositionRequest}>
              <h3>Prepare a disposition request</h3>
              <p className="expiry-form-description">
                Choose what should happen to this batch. This demo only prepares
                a request; it does not alter stock.
              </p>

              <div className="expiry-disposition-options">
                <label>
                  <input
                    type="radio"
                    name="disposition"
                    value="quarantine"
                    checked={disposition === "quarantine"}
                    onChange={(event) => setDisposition(event.target.value)}
                  />
                  <Ban size={17} />
                  <span>Quarantine</span>
                </label>

                <label>
                  <input
                    type="radio"
                    name="disposition"
                    value="return-to-supplier"
                    checked={disposition === "return-to-supplier"}
                    onChange={(event) => setDisposition(event.target.value)}
                  />
                  <RotateCcw size={17} />
                  <span>Return to supplier</span>
                </label>

                <label>
                  <input
                    type="radio"
                    name="disposition"
                    value="write-off"
                    checked={disposition === "write-off"}
                    onChange={(event) => setDisposition(event.target.value)}
                  />
                  <ClipboardCheck size={17} />
                  <span>Write-off</span>
                </label>

                <label>
                  <input
                    type="radio"
                    name="disposition"
                    value="dispose"
                    checked={disposition === "dispose"}
                    onChange={(event) => setDisposition(event.target.value)}
                  />
                  <Trash2 size={17} />
                  <span>Dispose</span>
                </label>
              </div>

              <label className="expiry-reason-field">
                Reason for request
                <textarea
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Describe the inspection findings or reason for this action..."
                  rows="3"
                />
              </label>

              {requestMessage && (
                <div className="expiry-request-message">{requestMessage}</div>
              )}

              <div className="expiry-modal-actions">
                <button
                  type="button"
                  className="expiry-cancel-button"
                  onClick={() => setSelectedBatch(null)}
                >
                  Close
                </button>
                <button type="submit" className="expiry-submit-button">
                  Prepare request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpiryManagement;
