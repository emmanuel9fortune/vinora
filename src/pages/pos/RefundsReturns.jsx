
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw,
  X,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import "../../styles/pos.css";

const initialRefunds = [
  {
    id: "RFD-2026-008",
    invoice: "INV-2026-1045",
    customer: "Walk-in Customer",
    requestedBy: "Daniel James",
    date: "2026-11-26T10:45:00",
    reason: "Customer reported that the wrong product was purchased.",
    refundAmount: 3000,
    paymentMethod: "Cash",
    status: "Pending Approval",
    items: [
      {
        name: "Ibuprofen 400mg",
        qty: 2,
        price: 1500,
        disposition: "Quarantine",
      },
    ],
  },
  {
    id: "RFD-2026-007",
    invoice: "INV-2026-1039",
    customer: "Amina Bello",
    requestedBy: "Grace Okafor",
    date: "2026-11-25T15:20:00",
    reason: "Product packaging was damaged.",
    refundAmount: 4200,
    paymentMethod: "Transfer",
    status: "Pending Approval",
    items: [
      {
        name: "Multivitamins",
        qty: 1,
        price: 4200,
        disposition: "Quarantine",
      },
    ],
  },
  {
    id: "RFD-2026-006",
    invoice: "INV-2026-1028",
    customer: "Peter Ade",
    requestedBy: "Grace Okafor",
    date: "2026-11-24T12:10:00",
    reason: "Refund approved after inspection.",
    refundAmount: 1600,
    paymentMethod: "Cash",
    status: "Approved",
    items: [
      {
        name: "Metformin 500mg",
        qty: 1,
        price: 1600,
        disposition: "Restock",
      },
    ],
  },
  {
    id: "RFD-2026-005",
    invoice: "INV-2026-1017",
    customer: "Chinedu Eze",
    requestedBy: "Daniel James",
    date: "2026-11-23T09:35:00",
    reason: "Refund request did not meet the return policy.",
    refundAmount: 2500,
    paymentMethod: "Transfer",
    status: "Rejected",
    items: [
      {
        name: "Vitamin C 1000mg",
        qty: 1,
        price: 2500,
        disposition: "Quarantine",
      },
    ],
  },
];

const money = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

const dateText = (value) =>
  new Date(value).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function RefundsReturns() {
  const [refunds, setRefunds] = useState(initialRefunds);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [decisionRefund, setDecisionRefund] = useState(null);
  const [decision, setDecision] = useState("Approve");
  const [decisionReason, setDecisionReason] = useState("");
  const [refundMethod, setRefundMethod] = useState("Original payment method");
  const [itemDispositions, setItemDispositions] = useState({});

  const filteredRefunds = useMemo(() => {
    const term = search.toLowerCase().trim();

    return refunds.filter((refund) => {
      const matchesSearch =
        !term ||
        refund.id.toLowerCase().includes(term) ||
        refund.invoice.toLowerCase().includes(term) ||
        refund.customer.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || refund.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [refunds, search, statusFilter]);

  const pendingCount = refunds.filter(
    (refund) => refund.status === "Pending Approval"
  ).length;

  const approvedCount = refunds.filter(
    (refund) => refund.status === "Approved"
  ).length;

  const rejectedCount = refunds.filter(
    (refund) => refund.status === "Rejected"
  ).length;

  const approvedTotal = refunds
    .filter((refund) => refund.status === "Approved")
    .reduce((sum, refund) => sum + refund.refundAmount, 0);

  const openDecision = (refund, nextDecision) => {
    setDecisionRefund(refund);
    setDecision(nextDecision);
    setDecisionReason("");
    setRefundMethod(refund.paymentMethod || "Original payment method");

    const defaults = {};
    refund.items.forEach((item, index) => {
      defaults[`${refund.id}-${index}`] = item.disposition || "Quarantine";
    });
    setItemDispositions(defaults);
  };

  const submitDecision = (event) => {
    event.preventDefault();
    if (!decisionRefund) return;

    setRefunds((current) =>
      current.map((refund) => {
        if (refund.id !== decisionRefund.id) return refund;

        if (decision === "Reject") {
          return {
            ...refund,
            status: "Rejected",
            decisionReason: decisionReason.trim(),
          };
        }

        return {
          ...refund,
          status: "Approved",
          paymentMethod: refundMethod,
          decisionReason: decisionReason.trim(),
          items: refund.items.map((item, index) => ({
            ...item,
            disposition:
              itemDispositions[`${refund.id}-${index}`] || "Quarantine",
          })),
        };
      })
    );

    setDecisionRefund(null);
    setSelectedRefund(null);
  };

  const statusClass = (status) => {
    if (status === "Approved") return "approved";
    if (status === "Rejected") return "rejected";
    return "pending";
  };

  return (
    <div className="refunds-page">
      <div className="refunds-header">
        <div>
          <div className="refunds-breadcrumb">
            <Link to="/pos">POS</Link>
            <span>/</span>
            <span>Refunds & Returns</span>
          </div>
          <h1>Refunds & Returns</h1>
          <p>Review refund requests and manage returned products.</p>
        </div>

        <Link to="/pos/sales-history" className="refunds-history-link">
          <RotateCcw size={17} />
          Sales History
        </Link>
      </div>

      <div className="refunds-stats">
        <div className="refunds-stat">
          <span>Pending approval</span>
          <strong>{pendingCount}</strong>
        </div>
        <div className="refunds-stat">
          <span>Approved requests</span>
          <strong>{approvedCount}</strong>
        </div>
        <div className="refunds-stat">
          <span>Rejected requests</span>
          <strong>{rejectedCount}</strong>
        </div>
        <div className="refunds-stat">
          <span>Approved refund value</span>
          <strong>{money(approvedTotal)}</strong>
        </div>
      </div>

      <div className="refunds-notice">
        <AlertTriangle size={18} />
        <p>
          Approval is a demo workflow. In production, refunds require permission,
          payment confirmation and a linked stock movement or disposition record.
        </p>
      </div>

      <section className="refunds-panel">
        <div className="refunds-panel-heading">
          <div>
            <h2>Refund requests</h2>
            <p>{filteredRefunds.length} requests found</p>
          </div>
        </div>

        <div className="refunds-filters">
          <div className="refunds-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search request, invoice or customer..."
            />
          </div>

          <label className="refunds-select">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option>All</option>
              <option>Pending Approval</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
            <ChevronDown size={15} />
          </label>
        </div>

        <div className="refunds-table-wrap">
          <table className="refunds-table">
            <thead>
              <tr>
                <th>Request</th>
                <th>Original invoice</th>
                <th>Customer</th>
                <th>Request date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRefunds.map((refund) => (
                <tr key={refund.id}>
                  <td><strong>{refund.id}</strong></td>
                  <td>{refund.invoice}</td>
                  <td>{refund.customer}</td>
                  <td>{dateText(refund.date)}</td>
                  <td className="refunds-amount">{money(refund.refundAmount)}</td>
                  <td>
                    <span className={`refunds-status ${statusClass(refund.status)}`}>
                      {refund.status}
                    </span>
                  </td>
                  <td>
                    <div className="refunds-actions">
                      <button
                        title="View request"
                        onClick={() => setSelectedRefund(refund)}
                      >
                        <Eye size={17} />
                      </button>
                      {refund.status === "Pending Approval" && (
                        <>
                          <button
                            title="Approve refund"
                            className="refunds-approve-action"
                            onClick={() => openDecision(refund, "Approve")}
                          >
                            <CheckCircle2 size={17} />
                          </button>
                          <button
                            title="Reject refund"
                            className="refunds-reject-action"
                            onClick={() => openDecision(refund, "Reject")}
                          >
                            <XCircle size={17} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRefunds.length === 0 && (
                <tr>
                  <td colSpan="7" className="refunds-empty">
                    No refund requests match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedRefund && (
        <div className="refunds-overlay" onClick={() => setSelectedRefund(null)}>
          <div className="refunds-modal" onClick={(event) => event.stopPropagation()}>
            <div className="refunds-modal-header">
              <div>
                <span>Refund request details</span>
                <h2>{selectedRefund.id}</h2>
              </div>
              <button onClick={() => setSelectedRefund(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="refunds-detail-grid">
              <div><span>Original invoice</span><strong>{selectedRefund.invoice}</strong></div>
              <div><span>Customer</span><strong>{selectedRefund.customer}</strong></div>
              <div><span>Requested by</span><strong>{selectedRefund.requestedBy}</strong></div>
              <div><span>Request date</span><strong>{dateText(selectedRefund.date)}</strong></div>
            </div>

            <div className="refunds-reason">
              <span>Reason for return</span>
              <p>{selectedRefund.reason}</p>
            </div>

            <h3>Returned items</h3>
            <div className="refunds-item-list">
              {selectedRefund.items.map((item, index) => (
                <div className="refunds-item-row" key={`${item.name}-${index}`}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>Quantity: {item.qty}</span>
                    <span>Disposition: {item.disposition}</span>
                  </div>
                  <strong>{money(item.qty * item.price)}</strong>
                </div>
              ))}
            </div>

            <div className="refunds-total">
              <span>Requested refund</span>
              <strong>{money(selectedRefund.refundAmount)}</strong>
            </div>

            {selectedRefund.status === "Pending Approval" && (
              <div className="refunds-modal-actions">
                <button
                  className="refunds-secondary"
                  onClick={() => openDecision(selectedRefund, "Reject")}
                >
                  <XCircle size={16} /> Reject
                </button>
                <button
                  className="refunds-primary"
                  onClick={() => openDecision(selectedRefund, "Approve")}
                >
                  <CheckCircle2 size={16} /> Review & approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {decisionRefund && (
        <div className="refunds-overlay" onClick={() => setDecisionRefund(null)}>
          <form
            className="refunds-modal"
            onSubmit={submitDecision}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="refunds-modal-header">
              <div>
                <span>{decision === "Approve" ? "Approve refund" : "Reject request"}</span>
                <h2>{decisionRefund.id}</h2>
              </div>
              <button type="button" onClick={() => setDecisionRefund(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="refunds-review-summary">
              <span>Refund amount</span>
              <strong>{money(decisionRefund.refundAmount)}</strong>
            </div>

            {decision === "Approve" && (
              <>
                <label className="refunds-form-label">
                  Refund payment method
                  <select
                    value={refundMethod}
                    onChange={(event) => setRefundMethod(event.target.value)}
                  >
                    <option>Original payment method</option>
                    <option>Cash</option>
                    <option>Transfer</option>
                    <option>POS reversal</option>
                  </select>
                </label>

                <h3 className="refunds-disposition-title">Item disposition</h3>
                <p className="refunds-form-help">
                  Choose what should happen to each returned item after inspection.
                </p>

                {decisionRefund.items.map((item, index) => (
                  <label className="refunds-form-label" key={`${item.name}-${index}`}>
                    {item.name} · Qty {item.qty}
                    <select
                      value={
                        itemDispositions[`${decisionRefund.id}-${index}`] ||
                        "Quarantine"
                      }
                      onChange={(event) =>
                        setItemDispositions((current) => ({
                          ...current,
                          [`${decisionRefund.id}-${index}`]: event.target.value,
                        }))
                      }
                    >
                      <option>Quarantine</option>
                      <option>Restock</option>
                      <option>Dispose</option>
                    </select>
                  </label>
                ))}
              </>
            )}

            <label className="refunds-form-label">
              {decision === "Approve" ? "Approval note (optional)" : "Reason for rejection"}
              <textarea
                value={decisionReason}
                onChange={(event) => setDecisionReason(event.target.value)}
                rows="3"
                placeholder={
                  decision === "Approve"
                    ? "Add an internal note..."
                    : "Explain why this request is rejected..."
                }
                required={decision === "Reject"}
              />
            </label>

            <div className="refunds-modal-actions">
              <button
                type="button"
                className="refunds-secondary"
                onClick={() => setDecisionRefund(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={decision === "Approve" ? "refunds-primary" : "refunds-danger"}
              >
                {decision === "Approve" ? "Approve request" : "Reject request"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
