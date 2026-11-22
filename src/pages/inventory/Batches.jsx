
import { useMemo, useState } from "react";
import {
  Search,
  Package,
  Layers3,
  AlertTriangle,
  CalendarDays,
  Clock3,
  CheckCircle2,
  Eye,
  X,
  Building2,
  Hash,
  Boxes,
  ChevronDown,
  Filter
} from "lucide-react";
import "../../styles/inventory.css";

const initialBatches = [
  {
    id: 1,
    product: "Paracetamol 500mg",
    genericName: "Paracetamol",
    batchNumber: "PCM-2026-001",
    category: "Analgesics",
    supplier: "Emzor Pharmaceutical",
    receivedDate: "2026-10-12",
    expiryDate: "2027-10-12",
    quantityReceived: 1000,
    quantityRemaining: 720,
    purchasePrice: 450,
    sellingPrice: 650,
    status: "Active",
  },
  {
    id: 2,
    product: "Amoxicillin 500mg",
    genericName: "Amoxicillin",
    batchNumber: "AMX-2026-014",
    category: "Antibiotics",
    supplier: "Fidson Healthcare",
    receivedDate: "2026-08-15",
    expiryDate: "2026-12-15",
    quantityReceived: 500,
    quantityRemaining: 180,
    purchasePrice: 1800,
    sellingPrice: 2400,
    status: "Expiring Soon",
  },
  {
    id: 3,
    product: "Vitamin C 1000mg",
    genericName: "Ascorbic Acid",
    batchNumber: "VTC-2026-008",
    category: "Vitamins",
    supplier: "Orange Drugs",
    receivedDate: "2026-09-20",
    expiryDate: "2027-09-20",
    quantityReceived: 800,
    quantityRemaining: 640,
    purchasePrice: 900,
    sellingPrice: 1300,
    status: "Active",
  },
  {
    id: 4,
    product: "Cetirizine 10mg",
    genericName: "Cetirizine",
    batchNumber: "CTZ-2025-003",
    category: "Antihistamines",
    supplier: "May & Baker",
    receivedDate: "2025-10-01",
    expiryDate: "2026-10-01",
    quantityReceived: 300,
    quantityRemaining: 35,
    purchasePrice: 500,
    sellingPrice: 800,
    status: "Expired",
  },
  {
    id: 5,
    product: "Metformin 500mg",
    genericName: "Metformin",
    batchNumber: "MTF-2026-021",
    category: "Antidiabetics",
    supplier: "Emzor Pharmaceutical",
    receivedDate: "2026-11-02",
    expiryDate: "2028-04-02",
    quantityReceived: 1200,
    quantityRemaining: 1100,
    purchasePrice: 700,
    sellingPrice: 1000,
    status: "Active",
  },
  {
    id: 6,
    product: "Artemether/Lumefantrine",
    genericName: "Artemether + Lumefantrine",
    batchNumber: "ALU-2026-005",
    category: "Antimalarials",
    supplier: "Greenlife Pharmaceuticals",
    receivedDate: "2026-06-10",
    expiryDate: "2027-01-10",
    quantityReceived: 600,
    quantityRemaining: 210,
    purchasePrice: 1200,
    sellingPrice: 1700,
    status: "Expiring Soon",
  },
];

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

const getDaysUntilExpiry = (expiryDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(`${expiryDate}T00:00:00`);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
};

const getBatchStatus = (expiryDate) => {
  const days = getDaysUntilExpiry(expiryDate);

  if (days < 0) return "Expired";
  if (days <= 90) return "Expiring Soon";
  return "Active";
};

const getStatusClass = (status) => {
  if (status === "Expired") return "batch-status-expired";
  if (status === "Expiring Soon") return "batch-status-warning";
  return "batch-status-active";
};

export default function Batches() {
  const [batches] = useState(initialBatches);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState(null);

  const batchesWithStatus = useMemo(
    () =>
      batches.map((batch) => ({
        ...batch,
        status: getBatchStatus(batch.expiryDate),
      })),
    [batches]
  );

  const filteredBatches = useMemo(() => {
    return batchesWithStatus.filter((batch) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        batch.product.toLowerCase().includes(searchValue) ||
        batch.batchNumber.toLowerCase().includes(searchValue) ||
        batch.supplier.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || batch.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [batchesWithStatus, search, statusFilter]);

  const totalUnits = batchesWithStatus.reduce(
    (total, batch) => total + batch.quantityRemaining,
    0
  );

  const activeCount = batchesWithStatus.filter(
    (batch) => batch.status === "Active"
  ).length;

  const expiringCount = batchesWithStatus.filter(
    (batch) => batch.status === "Expiring Soon"
  ).length;

  const expiredCount = batchesWithStatus.filter(
    (batch) => batch.status === "Expired"
  ).length;

  const totalStockValue = batchesWithStatus.reduce(
    (total, batch) =>
      total + batch.quantityRemaining * batch.purchasePrice,
    0
  );

  return (
    <div className="inventory-page batches-page">
      <div className="inventory-page-header">
        <div>
          <div className="inventory-breadcrumb">
            Inventory <span>/</span> Stock Batches
          </div>

          <h1>Stock Batches</h1>

          <p>
            Monitor received stock, batch quantities, supplier details and
            product expiry dates.
          </p>
        </div>

        <div className="batch-header-actions">
          <div className="batch-record-count">
            <Layers3 size={16} />
            {batches.length} batch records
          </div>
        </div>
      </div>

      <div className="batch-summary-grid">
        <div className="batch-summary-card">
          <div className="batch-summary-top">
            <span>Total batches</span>
            <div className="batch-summary-icon batch-icon-blue">
              <Layers3 size={19} />
            </div>
          </div>
          <h2>{batches.length}</h2>
          <p>Recorded stock batches</p>
        </div>

        <div className="batch-summary-card">
          <div className="batch-summary-top">
            <span>Remaining units</span>
            <div className="batch-summary-icon batch-icon-purple">
              <Boxes size={19} />
            </div>
          </div>
          <h2>{totalUnits.toLocaleString("en-NG")}</h2>
          <p>Units across all batches</p>
        </div>

        <div className="batch-summary-card">
          <div className="batch-summary-top">
            <span>Expiring soon</span>
            <div className="batch-summary-icon batch-icon-orange">
              <Clock3 size={19} />
            </div>
          </div>
          <h2>{expiringCount}</h2>
          <p>Expiring within 90 days</p>
        </div>

        <div className="batch-summary-card">
          <div className="batch-summary-top">
            <span>Expired batches</span>
            <div className="batch-summary-icon batch-icon-red">
              <AlertTriangle size={19} />
            </div>
          </div>
          <h2>{expiredCount}</h2>
          <p>Require stock review</p>
        </div>
      </div>

      <div className="batch-value-strip">
        <div className="batch-value-icon">
          <Package size={20} />
        </div>
        <div>
          <span>Remaining inventory value at purchase cost</span>
          <strong>{formatCurrency(totalStockValue)}</strong>
        </div>
        <span className="batch-value-note">Based on demo batch quantities</span>
      </div>

      <div className="batch-table-card">
        <div className="batch-table-heading">
          <div>
            <h2>All stock batches</h2>
            <p>Review and track every received batch.</p>
          </div>
        </div>

        <div className="batch-toolbar">
          <div className="batch-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search product, batch number or supplier..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
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

          <div className="batch-filter">
            <Filter size={16} />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter batches by status"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Expiring Soon">Expiring soon</option>
              <option value="Expired">Expired</option>
            </select>
            <ChevronDown size={15} />
          </div>
        </div>

        <div className="batch-table-wrapper">
          <table className="batch-table">
            <thead>
              <tr>
                <th>Product / Batch</th>
                <th>Supplier</th>
                <th>Received date</th>
                <th>Expiry date</th>
                <th>Remaining qty.</th>
                <th>Purchase cost</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredBatches.map((batch) => {
                const daysLeft = getDaysUntilExpiry(batch.expiryDate);

                return (
                  <tr key={batch.id}>
                    <td>
                      <div className="batch-product-cell">
                        <div className="batch-product-icon">
                          <Package size={17} />
                        </div>
                        <div>
                          <strong>{batch.product}</strong>
                          <span>{batch.batchNumber}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="batch-supplier">{batch.supplier}</span>
                    </td>

                    <td>{formatDate(batch.receivedDate)}</td>

                    <td>
                      <div className="batch-expiry-cell">
                        <span>{formatDate(batch.expiryDate)}</span>
                        {daysLeft >= 0 && daysLeft <= 90 && (
                          <small>{daysLeft} days left</small>
                        )}
                        {daysLeft < 0 && (
                          <small className="batch-expired-text">
                            Expired {Math.abs(daysLeft)} days ago
                          </small>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="batch-quantity-cell">
                        <strong>
                          {batch.quantityRemaining.toLocaleString("en-NG")}
                        </strong>
                        <span>
                          of {batch.quantityReceived.toLocaleString("en-NG")}
                        </span>
                      </div>
                    </td>

                    <td>{formatCurrency(batch.purchasePrice)}</td>

                    <td>
                      <span
                        className={`batch-status ${getStatusClass(batch.status)}`}
                      >
                        <span />
                        {batch.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="batch-view-button"
                        onClick={() => setSelectedBatch(batch)}
                        title="View batch details"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredBatches.length === 0 && (
            <div className="batch-empty-state">
              <Package size={32} />
              <strong>No batches found</strong>
              <p>Try changing your search or status filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        <div className="batch-table-footer">
          Showing {filteredBatches.length} of {batches.length} batch records
        </div>
      </div>

      {selectedBatch && (
        <div
          className="batch-modal-overlay"
          onClick={() => setSelectedBatch(null)}
        >
          <div
            className="batch-detail-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="batch-modal-header">
              <div>
                <span>STOCK BATCH DETAILS</span>
                <h2>{selectedBatch.product}</h2>
                <p>{selectedBatch.batchNumber}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBatch(null)}
                aria-label="Close batch details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="batch-modal-status">
              <span
                className={`batch-status ${getStatusClass(
                  getBatchStatus(selectedBatch.expiryDate)
                )}`}
              >
                <span />
                {getBatchStatus(selectedBatch.expiryDate)}
              </span>
            </div>

            <div className="batch-detail-grid">
              <div>
                <span>Product name</span>
                <strong>{selectedBatch.product}</strong>
              </div>
              <div>
                <span>Generic name</span>
                <strong>{selectedBatch.genericName}</strong>
              </div>
              <div>
                <span>Batch number</span>
                <strong>{selectedBatch.batchNumber}</strong>
              </div>
              <div>
                <span>Category</span>
                <strong>{selectedBatch.category}</strong>
              </div>
              <div>
                <span>Supplier</span>
                <strong>
                  <Building2 size={15} />
                  {selectedBatch.supplier}
                </strong>
              </div>
              <div>
                <span>Received date</span>
                <strong>
                  <CalendarDays size={15} />
                  {formatDate(selectedBatch.receivedDate)}
                </strong>
              </div>
              <div>
                <span>Expiry date</span>
                <strong>
                  <CalendarDays size={15} />
                  {formatDate(selectedBatch.expiryDate)}
                </strong>
              </div>
              <div>
                <span>Batch reference</span>
                <strong>
                  <Hash size={15} />
                  {selectedBatch.batchNumber}
                </strong>
              </div>
            </div>

            <div className="batch-detail-quantity">
              <div>
                <span>Quantity received</span>
                <strong>
                  {selectedBatch.quantityReceived.toLocaleString("en-NG")}
                </strong>
              </div>
              <div>
                <span>Remaining quantity</span>
                <strong>
                  {selectedBatch.quantityRemaining.toLocaleString("en-NG")}
                </strong>
              </div>
              <div>
                <span>Quantity used / removed</span>
                <strong>
                  {(
                    selectedBatch.quantityReceived -
                    selectedBatch.quantityRemaining
                  ).toLocaleString("en-NG")}
                </strong>
              </div>
            </div>

            <div className="batch-detail-prices">
              <div>
                <span>Purchase price per unit</span>
                <strong>{formatCurrency(selectedBatch.purchasePrice)}</strong>
              </div>
              <div>
                <span>Selling price per unit</span>
                <strong>{formatCurrency(selectedBatch.sellingPrice)}</strong>
              </div>
            </div>

            <div className="batch-modal-note">
              <CheckCircle2 size={17} />
              Batch details are currently displayed using demonstration data.
            </div>

            <div className="batch-modal-actions">
              <button
                type="button"
                onClick={() => setSelectedBatch(null)}
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
