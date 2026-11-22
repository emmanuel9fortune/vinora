
import { useMemo, useState } from "react";
import {
  Search,
  ArrowDownToLine,
  ArrowUpFromLine,
  RotateCcw,
  AlertTriangle,
  SlidersHorizontal,
  Eye,
  X,
  CalendarDays,
  Package,
  History,
  ArrowLeftRight,
  Filter
} from "lucide-react";
import "../../styles/inventory.css";

const movements = [
  {
    id: "MOV-00081",
    date: "2026-11-22T10:35:00",
    product: "Paracetamol 500mg",
    batch: "PCM-2026-001",
    type: "Sale",
    direction: "out",
    quantity: 12,
    before: 332,
    after: 320,
    reference: "SALE-00142",
    employee: "John Okafor",
    reason: "POS sale",
  },
  {
    id: "MOV-00080",
    date: "2026-11-22T09:20:00",
    product: "Amoxicillin 500mg",
    batch: "AMX-2026-014",
    type: "Customer return",
    direction: "in",
    quantity: 2,
    before: 83,
    after: 85,
    reference: "RET-00018",
    employee: "Mary James",
    reason: "Inspected and approved for restocking",
  },
  {
    id: "MOV-00079",
    date: "2026-11-21T16:15:00",
    product: "Vitamin C 1000mg",
    batch: "VTC-2026-008",
    type: "Damage",
    direction: "out",
    quantity: 5,
    before: 150,
    after: 145,
    reference: "ADJ-00032",
    employee: "Peter Eze",
    reason: "Damaged packaging",
  },
  {
    id: "MOV-00078",
    date: "2026-11-21T12:40:00",
    product: "Paracetamol 500mg",
    batch: "PCM-2026-001",
    type: "Sale",
    direction: "out",
    quantity: 8,
    before: 340,
    after: 332,
    reference: "SALE-00139",
    employee: "John Okafor",
    reason: "POS sale",
  },
  {
    id: "MOV-00077",
    date: "2026-11-20T14:05:00",
    product: "Metformin 500mg",
    batch: "MET-2026-022",
    type: "Stock received",
    direction: "in",
    quantity: 400,
    before: 0,
    after: 400,
    reference: "GRN-00024",
    employee: "Sarah Williams",
    reason: "Supplier goods received",
  },
  {
    id: "MOV-00076",
    date: "2026-11-20T11:30:00",
    product: "Cetirizine 10mg",
    batch: "CTZ-2025-031",
    type: "Expiry write-off",
    direction: "out",
    quantity: 10,
    before: 22,
    after: 12,
    reference: "WOF-00007",
    employee: "Peter Eze",
    reason: "Expired stock write-off",
  },
  {
    id: "MOV-00075",
    date: "2026-11-19T15:10:00",
    product: "Vitamin C 1000mg",
    batch: "VTC-2026-008",
    type: "Stock adjustment",
    direction: "out",
    quantity: 3,
    before: 153,
    after: 150,
    reference: "ADJ-00029",
    employee: "Mary James",
    reason: "Physical stock count correction",
  },
  {
    id: "MOV-00074",
    date: "2026-11-19T10:00:00",
    product: "Amoxicillin 500mg",
    batch: "AMX-2026-014",
    type: "Sale",
    direction: "out",
    quantity: 15,
    before: 100,
    after: 85,
    reference: "SALE-00131",
    employee: "John Okafor",
    reason: "POS sale",
  },
  {
    id: "MOV-00073",
    date: "2026-11-18T13:25:00",
    product: "Paracetamol 500mg",
    batch: "PCM-2026-001",
    type: "Supplier return",
    direction: "out",
    quantity: 5,
    before: 345,
    after: 340,
    reference: "SR-00012",
    employee: "Sarah Williams",
    reason: "Supplier return approved",
  },
];

const formatDateTime = (value) =>
  new Date(value).toLocaleString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function MovementBadge({ type }) {
  const classes = {
    Sale: "movement-sale",
    "Stock received": "movement-received",
    "Customer return": "movement-return",
    "Supplier return": "movement-adjustment",
    Damage: "movement-damage",
    "Expiry write-off": "movement-damage",
    "Stock adjustment": "movement-adjustment",
  };

  return (
    <span className={`movement-type-badge ${classes[type] || ""}`}>
      {type}
    </span>
  );
}

export default function StockMovements() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [directionFilter, setDirectionFilter] = useState("All");
  const [selectedMovement, setSelectedMovement] = useState(null);

  const filteredMovements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return movements.filter((movement) => {
      const matchesSearch =
        !query ||
        movement.id.toLowerCase().includes(query) ||
        movement.product.toLowerCase().includes(query) ||
        movement.batch.toLowerCase().includes(query) ||
        movement.reference.toLowerCase().includes(query) ||
        movement.employee.toLowerCase().includes(query);

      const matchesType =
        typeFilter === "All" || movement.type === typeFilter;

      const matchesDirection =
        directionFilter === "All" ||
        movement.direction === directionFilter;

      return matchesSearch && matchesType && matchesDirection;
    });
  }, [search, typeFilter, directionFilter]);

  const totalReceived = movements
    .filter((movement) => movement.direction === "in")
    .reduce((sum, movement) => sum + movement.quantity, 0);

  const totalIssued = movements
    .filter((movement) => movement.direction === "out")
    .reduce((sum, movement) => sum + movement.quantity, 0);

  const salesCount = movements.filter(
    (movement) => movement.type === "Sale"
  ).length;

  const exceptionalCount = movements.filter((movement) =>
    ["Damage", "Expiry write-off", "Stock adjustment"].includes(movement.type)
  ).length;

  return (
    <div className="inventory-page stock-movements-page">
      <div className="inventory-page-header">
        <div>
          <div className="inventory-breadcrumb">
            Inventory <span>/</span> Stock Movements
          </div>
          <h1>Stock Movements</h1>
          <p>
            A complete audit trail of every stock movement in your organisation.
          </p>
        </div>
      </div>

      <div className="movement-summary-grid">
        <div className="movement-summary-card">
          <div className="movement-summary-icon blue">
            <History size={19} />
          </div>
          <span>Total movements</span>
          <strong>{movements.length}</strong>
          <small>Recorded transactions</small>
        </div>

        <div className="movement-summary-card">
          <div className="movement-summary-icon green">
            <ArrowDownToLine size={19} />
          </div>
          <span>Units received / returned</span>
          <strong>{totalReceived.toLocaleString()}</strong>
          <small>Stock moving into inventory</small>
        </div>

        <div className="movement-summary-card">
          <div className="movement-summary-icon orange">
            <ArrowUpFromLine size={19} />
          </div>
          <span>Units issued</span>
          <strong>{totalIssued.toLocaleString()}</strong>
          <small>Stock moving out of inventory</small>
        </div>

        <div className="movement-summary-card">
          <div className="movement-summary-icon red">
            <AlertTriangle size={19} />
          </div>
          <span>Exceptions</span>
          <strong>{exceptionalCount}</strong>
          <small>Adjustments, damage and write-offs</small>
        </div>
      </div>

      <section className="inventory-table-card">
        <div className="movement-section-heading">
          <div>
            <h2>Movement history</h2>
            <p>
              Each record captures the product, batch, quantity, employee and
              source transaction.
            </p>
          </div>
          <span className="movement-audit-label">
            <History size={15} />
            Audit trail
          </span>
        </div>

        <div className="movement-toolbar">
          <div className="inventory-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product, batch, reference or employee..."
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="batch-clear-search"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="movement-filters">
            <div className="batch-filter">
              <SlidersHorizontal size={15} />
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                aria-label="Filter by movement type"
              >
                <option value="All">All movement types</option>
                <option value="Sale">Sale</option>
                <option value="Stock received">Stock received</option>
                <option value="Customer return">Customer return</option>
                <option value="Supplier return">Supplier return</option>
                <option value="Damage">Damage</option>
                <option value="Expiry write-off">Expiry write-off</option>
                <option value="Stock adjustment">Stock adjustment</option>
              </select>
            </div>

            <div className="batch-filter">
              <ArrowLeftRight size={15} />
              <select
                value={directionFilter}
                onChange={(event) => setDirectionFilter(event.target.value)}
                aria-label="Filter by stock direction"
              >
                <option value="All">All directions</option>
                <option value="in">Stock in</option>
                <option value="out">Stock out</option>
              </select>
            </div>
          </div>
        </div>

        <div className="inventory-table-wrapper">
          <table className="inventory-table movement-table">
            <thead>
              <tr>
                <th>Movement</th>
                <th>Date & time</th>
                <th>Product / Batch</th>
                <th>Movement type</th>
                <th>Quantity</th>
                <th>Stock balance</th>
                <th>Reference</th>
                <th>Employee</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredMovements.map((movement) => (
                <tr key={movement.id}>
                  <td>
                    <span className="movement-id">{movement.id}</span>
                  </td>
                  <td>
                    <span className="movement-date">
                      {formatDateTime(movement.date)}
                    </span>
                  </td>
                  <td>
                    <div className="batch-product-name">{movement.product}</div>
                    <div className="batch-product-number">{movement.batch}</div>
                  </td>
                  <td>
                    <MovementBadge type={movement.type} />
                  </td>
                  <td>
                    <span
                      className={
                        movement.direction === "in"
                          ? "movement-quantity-in"
                          : "movement-quantity-out"
                      }
                    >
                      {movement.direction === "in" ? "+" : "−"}
                      {movement.quantity}
                    </span>
                  </td>
                  <td>
                    <span className="movement-balance">
                      {movement.before} <span>→</span> {movement.after}
                    </span>
                  </td>
                  <td>
                    <span className="movement-reference">
                      {movement.reference}
                    </span>
                  </td>
                  <td>{movement.employee}</td>
                  <td>
                    <button
                      type="button"
                      className="movement-view-button"
                      onClick={() => setSelectedMovement(movement)}
                      aria-label={`View ${movement.id}`}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredMovements.length === 0 && (
                <tr>
                  <td colSpan="9">
                    <div className="movement-empty-state">
                      <Package size={25} />
                      <strong>No movements found</strong>
                      <span>Try changing your search or filters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="movement-table-footer">
          Showing {filteredMovements.length} of {movements.length} movement
          records
        </div>
      </section>

      {selectedMovement && (
        <div
          className="product-modal-overlay"
          onClick={() => setSelectedMovement(null)}
        >
          <div
            className="product-modal movement-detail-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="product-modal-header">
              <div>
                <span className="movement-modal-eyebrow">Movement record</span>
                <h2>{selectedMovement.id}</h2>
              </div>
              <button
                type="button"
                className="product-modal-close"
                onClick={() => setSelectedMovement(null)}
                aria-label="Close movement details"
              >
                <X size={19} />
              </button>
            </div>

            <div className="movement-detail-content">
              <div className="movement-detail-product">
                <div className="movement-detail-icon">
                  <Package size={23} />
                </div>
                <div>
                  <strong>{selectedMovement.product}</strong>
                  <span>{selectedMovement.batch}</span>
                </div>
              </div>

              <div className="movement-detail-grid">
                <div>
                  <span>Movement type</span>
                  <MovementBadge type={selectedMovement.type} />
                </div>
                <div>
                  <span>Movement date</span>
                  <strong>{formatDateTime(selectedMovement.date)}</strong>
                </div>
                <div>
                  <span>Quantity moved</span>
                  <strong>
                    {selectedMovement.direction === "in" ? "+" : "−"}
                    {selectedMovement.quantity} units
                  </strong>
                </div>
                <div>
                  <span>Stock before</span>
                  <strong>{selectedMovement.before} units</strong>
                </div>
                <div>
                  <span>Stock after</span>
                  <strong>{selectedMovement.after} units</strong>
                </div>
                <div>
                  <span>Source reference</span>
                  <strong>{selectedMovement.reference}</strong>
                </div>
                <div>
                  <span>Recorded by</span>
                  <strong>{selectedMovement.employee}</strong>
                </div>
                <div>
                  <span>Reason / description</span>
                  <strong>{selectedMovement.reason}</strong>
                </div>
              </div>

              <div className="movement-immutable-note">
                <History size={17} />
                <p>
                  This is a historical stock record. Movement records cannot be
                  edited or deleted. Corrections must be recorded as a new
                  reversal or adjustment.
                </p>
              </div>
            </div>

            <div className="product-modal-actions">
              <button
                type="button"
                className="product-cancel-button"
                onClick={() => setSelectedMovement(null)}
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
