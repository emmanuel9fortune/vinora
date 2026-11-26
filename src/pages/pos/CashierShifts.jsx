
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Eye,
  Clock3,
  Wallet,
  CircleDollarSign,
  CheckCircle2,
  X,
  ChevronDown,
} from "lucide-react";
import "../../styles/pos.css";

const initialShifts = [
  {
    id: "SHIFT-0081",
    cashier: "Grace Okafor",
    terminal: "POS Terminal 01",
    date: "2026-11-26",
    openedAt: "2026-11-26T08:00:00",
    closedAt: null,
    openingCash: 20000,
    cashSales: 48500,
    cashRefunds: 0,
    cashPayouts: 5000,
    cashDrops: 10000,
    actualCash: null,
    status: "Open",
  },
  {
    id: "SHIFT-0080",
    cashier: "Daniel James",
    terminal: "POS Terminal 01",
    date: "2026-11-25",
    openedAt: "2026-11-25T08:05:00",
    closedAt: "2026-11-25T17:02:00",
    openingCash: 15000,
    cashSales: 72600,
    cashRefunds: 3000,
    cashPayouts: 4500,
    cashDrops: 12000,
    actualCash: 68100,
    status: "Reconciled",
  },
  {
    id: "SHIFT-0079",
    cashier: "Grace Okafor",
    terminal: "POS Terminal 01",
    date: "2026-11-24",
    openedAt: "2026-11-24T08:12:00",
    closedAt: "2026-11-24T16:55:00",
    openingCash: 20000,
    cashSales: 59800,
    cashRefunds: 1500,
    cashPayouts: 2500,
    cashDrops: 8000,
    actualCash: 67800,
    status: "Reconciled",
  },
];

const money = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

const dateText = (value) =>
  value
    ? new Date(value).toLocaleString("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

const expectedCash = (shift) =>
  shift.openingCash +
  shift.cashSales -
  shift.cashRefunds -
  shift.cashPayouts -
  shift.cashDrops;

export default function CashierShifts() {
  const [shifts, setShifts] = useState(initialShifts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedShift, setSelectedShift] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [closeShift, setCloseShift] = useState(null);

  const [cashier, setCashier] = useState("Grace Okafor");
  const [terminal, setTerminal] = useState("POS Terminal 01");
  const [openingCash, setOpeningCash] = useState("20000");
  const [actualCash, setActualCash] = useState("");
  const [closingNote, setClosingNote] = useState("");

  const activeShift = shifts.find((shift) => shift.status === "Open");

  const filteredShifts = useMemo(() => {
    const term = search.toLowerCase().trim();

    return shifts.filter((shift) => {
      const matchesSearch =
        !term ||
        shift.id.toLowerCase().includes(term) ||
        shift.cashier.toLowerCase().includes(term) ||
        shift.terminal.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || shift.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [shifts, search, statusFilter]);

  const totalCashSales = shifts.reduce(
    (sum, shift) => sum + shift.cashSales,
    0
  );

  const reconciledCount = shifts.filter(
    (shift) => shift.status === "Reconciled"
  ).length;

  const openShift = (event) => {
    event.preventDefault();

    const amount = Number(openingCash);
    if (!Number.isFinite(amount) || amount < 0) return;

    if (activeShift) {
      alert("There is already an open shift in this demo.");
      return;
    }

    const newShift = {
      id: `SHIFT-${String(82 + shifts.length - initialShifts.length).padStart(4, "0")}`,
      cashier,
      terminal,
      date: new Date().toISOString().slice(0, 10),
      openedAt: new Date().toISOString(),
      closedAt: null,
      openingCash: amount,
      cashSales: 0,
      cashRefunds: 0,
      cashPayouts: 0,
      cashDrops: 0,
      actualCash: null,
      status: "Open",
      closingNote: "",
    };

    setShifts((current) => [newShift, ...current]);
    setOpenModal(false);
  };

  const submitCloseShift = (event) => {
    event.preventDefault();
    if (!closeShift) return;

    const counted = Number(actualCash);
    if (!Number.isFinite(counted) || counted < 0) return;

    setShifts((current) =>
      current.map((shift) =>
        shift.id === closeShift.id
          ? {
              ...shift,
              actualCash: counted,
              closedAt: new Date().toISOString(),
              status: "Reconciled",
              closingNote: closingNote.trim(),
            }
          : shift
      )
    );

    setCloseShift(null);
    setActualCash("");
    setClosingNote("");
  };

  const startCloseShift = (shift) => {
    setCloseShift(shift);
    setActualCash("");
    setClosingNote("");
  };

  const variance =
    closeShift && actualCash !== ""
      ? Number(actualCash) - expectedCash(closeShift)
      : null;

  return (
    <div className="cashier-shifts-page">
      <div className="cashier-shifts-header">
        <div>
          <div className="cashier-shifts-breadcrumb">
            <Link to="/pos">POS</Link>
            <span>/</span>
            <span>Cashier Shifts</span>
          </div>
          <h1>Cashier Shifts</h1>
          <p>Manage till opening, closing and cash reconciliation.</p>
        </div>

        <div className="cashier-shifts-header-actions">
          <Link to="/pos/sales-history" className="cashier-shifts-secondary-link">
            Sales History
          </Link>
          <button
            className="cashier-shifts-primary-button"
            onClick={() => setOpenModal(true)}
            disabled={Boolean(activeShift)}
          >
            <Clock3 size={17} />
            Open shift
          </button>
        </div>
      </div>

      {activeShift && (
        <div className="cashier-shifts-active-notice">
          <div className="cashier-shifts-active-icon">
            <CheckCircle2 size={19} />
          </div>
          <div>
            <strong>Active shift: {activeShift.id}</strong>
            <p>
              {activeShift.cashier} · {activeShift.terminal} · Opened{" "}
              {dateText(activeShift.openedAt)}
            </p>
          </div>
          <button onClick={() => startCloseShift(activeShift)}>
            Close shift
          </button>
        </div>
      )}

      <div className="cashier-shifts-stats">
        <div className="cashier-shifts-stat">
          <span>Cash sales recorded</span>
          <strong>{money(totalCashSales)}</strong>
          <small>Across demo shifts</small>
        </div>
        <div className="cashier-shifts-stat">
          <span>Reconciled shifts</span>
          <strong>{reconciledCount}</strong>
          <small>Closed and counted</small>
        </div>
        <div className="cashier-shifts-stat">
          <span>Open shifts</span>
          <strong>{shifts.filter((shift) => shift.status === "Open").length}</strong>
          <small>Currently active</small>
        </div>
      </div>

      <section className="cashier-shifts-panel">
        <div className="cashier-shifts-panel-heading">
          <div>
            <h2>Shift history</h2>
            <p>View shift totals and cash reconciliation.</p>
          </div>
        </div>

        <div className="cashier-shifts-filters">
          <div className="cashier-shifts-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search shift, cashier or terminal..."
            />
          </div>

          <label className="cashier-shifts-select">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option>All</option>
              <option>Open</option>
              <option>Reconciled</option>
            </select>
            <ChevronDown size={15} />
          </label>
        </div>

        <div className="cashier-shifts-table-wrap">
          <table className="cashier-shifts-table">
            <thead>
              <tr>
                <th>Shift ID</th>
                <th>Cashier</th>
                <th>Terminal</th>
                <th>Opened</th>
                <th>Opening cash</th>
                <th>Cash sales</th>
                <th>Expected cash</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShifts.map((shift) => (
                <tr key={shift.id}>
                  <td><strong>{shift.id}</strong></td>
                  <td>{shift.cashier}</td>
                  <td>{shift.terminal}</td>
                  <td>{dateText(shift.openedAt)}</td>
                  <td>{money(shift.openingCash)}</td>
                  <td className="cashier-shifts-amount">
                    {money(shift.cashSales)}
                  </td>
                  <td className="cashier-shifts-amount">
                    {money(expectedCash(shift))}
                  </td>
                  <td>
                    <span
                      className={`cashier-shifts-status ${shift.status.toLowerCase()}`}
                    >
                      {shift.status}
                    </span>
                  </td>
                  <td>
                    <div className="cashier-shifts-actions">
                      <button
                        title="View shift"
                        onClick={() => setSelectedShift(shift)}
                      >
                        <Eye size={17} />
                      </button>
                      {shift.status === "Open" && (
                        <button
                          title="Close shift"
                          onClick={() => startCloseShift(shift)}
                        >
                          <Wallet size={17} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredShifts.length === 0 && (
                <tr>
                  <td colSpan="9" className="cashier-shifts-empty">
                    No shifts match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {openModal && (
        <div
          className="cashier-shifts-overlay"
          onClick={() => setOpenModal(false)}
        >
          <form
            className="cashier-shifts-modal"
            onSubmit={openShift}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cashier-shifts-modal-header">
              <div>
                <span>Start a new shift</span>
                <h2>Open till</h2>
              </div>
              <button type="button" onClick={() => setOpenModal(false)}>
                <X size={20} />
              </button>
            </div>

            <label className="cashier-shifts-form-label">
              Cashier
              <select
                value={cashier}
                onChange={(event) => setCashier(event.target.value)}
              >
                <option>Grace Okafor</option>
                <option>Daniel James</option>
                <option>Mary Johnson</option>
              </select>
            </label>

            <label className="cashier-shifts-form-label">
              POS terminal
              <select
                value={terminal}
                onChange={(event) => setTerminal(event.target.value)}
              >
                <option>POS Terminal 01</option>
                <option>POS Terminal 02</option>
              </select>
            </label>

            <label className="cashier-shifts-form-label">
              Opening cash float (₦)
              <input
                type="number"
                min="0"
                step="1"
                value={openingCash}
                onChange={(event) => setOpeningCash(event.target.value)}
                required
              />
            </label>

            <div className="cashier-shifts-modal-actions">
              <button
                type="button"
                className="cashier-shifts-secondary-button"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="cashier-shifts-primary-button">
                Open shift
              </button>
            </div>
          </form>
        </div>
      )}

      {closeShift && (
        <div
          className="cashier-shifts-overlay"
          onClick={() => setCloseShift(null)}
        >
          <form
            className="cashier-shifts-modal"
            onSubmit={submitCloseShift}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cashier-shifts-modal-header">
              <div>
                <span>Close and reconcile</span>
                <h2>{closeShift.id}</h2>
              </div>
              <button type="button" onClick={() => setCloseShift(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="cashier-shifts-reconcile-summary">
              <div>
                <span>Opening cash</span>
                <strong>{money(closeShift.openingCash)}</strong>
              </div>
              <div>
                <span>Cash sales</span>
                <strong>{money(closeShift.cashSales)}</strong>
              </div>
              <div>
                <span>Cash refunds</span>
                <strong>{money(closeShift.cashRefunds)}</strong>
              </div>
              <div>
                <span>Cash payouts</span>
                <strong>{money(closeShift.cashPayouts)}</strong>
              </div>
              <div>
                <span>Cash drops</span>
                <strong>{money(closeShift.cashDrops)}</strong>
              </div>
              <div className="expected">
                <span>Expected cash in till</span>
                <strong>{money(expectedCash(closeShift))}</strong>
              </div>
            </div>

            <label className="cashier-shifts-form-label">
              Actual cash counted (₦)
              <input
                type="number"
                min="0"
                step="1"
                value={actualCash}
                onChange={(event) => setActualCash(event.target.value)}
                required
              />
            </label>

            {variance !== null && Number.isFinite(variance) && (
              <div
                className={`cashier-shifts-variance ${
                  variance === 0 ? "balanced" : "difference"
                }`}
              >
                <span>
                  {variance === 0
                    ? "Till is balanced"
                    : variance < 0
                    ? "Cash shortage"
                    : "Cash overage"}
                </span>
                <strong>{money(Math.abs(variance))}</strong>
              </div>
            )}

            <label className="cashier-shifts-form-label">
              Closing note
              <textarea
                value={closingNote}
                onChange={(event) => setClosingNote(event.target.value)}
                placeholder="Explain any cash difference or add a closing note..."
                rows="3"
              />
            </label>

            <div className="cashier-shifts-modal-actions">
              <button
                type="button"
                className="cashier-shifts-secondary-button"
                onClick={() => setCloseShift(null)}
              >
                Cancel
              </button>
              <button type="submit" className="cashier-shifts-primary-button">
                Confirm close
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedShift && (
        <div
          className="cashier-shifts-overlay"
          onClick={() => setSelectedShift(null)}
        >
          <div
            className="cashier-shifts-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cashier-shifts-modal-header">
              <div>
                <span>Shift details</span>
                <h2>{selectedShift.id}</h2>
              </div>
              <button onClick={() => setSelectedShift(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="cashier-shifts-reconcile-summary">
              <div>
                <span>Cashier</span>
                <strong>{selectedShift.cashier}</strong>
              </div>
              <div>
                <span>Terminal</span>
                <strong>{selectedShift.terminal}</strong>
              </div>
              <div>
                <span>Opened</span>
                <strong>{dateText(selectedShift.openedAt)}</strong>
              </div>
              <div>
                <span>Closed</span>
                <strong>{dateText(selectedShift.closedAt)}</strong>
              </div>
              <div>
                <span>Opening cash</span>
                <strong>{money(selectedShift.openingCash)}</strong>
              </div>
              <div>
                <span>Cash sales</span>
                <strong>{money(selectedShift.cashSales)}</strong>
              </div>
              <div>
                <span>Expected cash</span>
                <strong>{money(expectedCash(selectedShift))}</strong>
              </div>
              <div>
                <span>Actual cash</span>
                <strong>
                  {selectedShift.actualCash === null
                    ? "Not counted"
                    : money(selectedShift.actualCash)}
                </strong>
              </div>
              {selectedShift.actualCash !== null && (
                <div className="expected">
                  <span>Cash variance</span>
                  <strong>
                    {money(
                      selectedShift.actualCash - expectedCash(selectedShift)
                    )}
                  </strong>
                </div>
              )}
            </div>

            {selectedShift.closingNote && (
              <div className="cashier-shifts-detail-note">
                <span>Closing note</span>
                <p>{selectedShift.closingNote}</p>
              </div>
            )}

            {selectedShift.status === "Open" && (
              <div className="cashier-shifts-modal-actions">
                <button
                  className="cashier-shifts-primary-button"
                  onClick={() => {
                    setSelectedShift(null);
                    startCloseShift(selectedShift);
                  }}
                >
                  Close shift
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
