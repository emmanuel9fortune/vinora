
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Eye,
  Printer,
  RotateCcw,
  X,
  Receipt,
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import "../../styles/pos.css";

const demoSales = [
  {
    id: "SALE-1048",
    invoice: "INV-2026-1048",
    date: "2026-11-26T14:32:00",
    customer: "Walk-in Customer",
    cashier: "Grace Okafor",
    payment: "Cash",
    status: "Completed",
    items: [
      { name: "Paracetamol 500mg", qty: 2, price: 1200 },
      { name: "Vitamin C 1000mg", qty: 1, price: 2500 },
    ],
    discount: 0,
    paid: 4900,
  },
  {
    id: "SALE-1047",
    invoice: "INV-2026-1047",
    date: "2026-11-26T13:18:00",
    customer: "Chinedu Eze",
    cashier: "Grace Okafor",
    payment: "Transfer",
    status: "Completed",
    items: [
      { name: "Omeprazole 20mg", qty: 2, price: 1800 },
      { name: "ORS Sachet", qty: 5, price: 500 },
    ],
    discount: 300,
    paid: 6100,
  },
  {
    id: "SALE-1046",
    invoice: "INV-2026-1046",
    date: "2026-11-26T11:46:00",
    customer: "Amina Bello",
    cashier: "Daniel James",
    payment: "POS",
    status: "Completed",
    items: [{ name: "Multivitamins", qty: 1, price: 4200 }],
    discount: 0,
    paid: 4200,
  },
  {
    id: "SALE-1045",
    invoice: "INV-2026-1045",
    date: "2026-11-25T17:05:00",
    customer: "Walk-in Customer",
    cashier: "Daniel James",
    payment: "Cash",
    status: "Refund Requested",
    items: [{ name: "Ibuprofen 400mg", qty: 2, price: 1500 }],
    discount: 0,
    paid: 3000,
  },
  {
    id: "SALE-1044",
    invoice: "INV-2026-1044",
    date: "2026-11-25T15:20:00",
    customer: "Peter Ade",
    cashier: "Grace Okafor",
    payment: "Credit",
    status: "Completed",
    items: [{ name: "Metformin 500mg", qty: 3, price: 1600 }],
    discount: 0,
    paid: 4800,
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

export default function SalesHistory() {
  const [sales, setSales] = useState(demoSales);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedSale, setSelectedSale] = useState(null);
  const [refundSale, setRefundSale] = useState(null);
  const [refundReason, setRefundReason] = useState("");

  const filteredSales = useMemo(() => {
    const term = search.toLowerCase().trim();

    return sales.filter((sale) => {
      const matchesSearch =
        !term ||
        sale.invoice.toLowerCase().includes(term) ||
        sale.customer.toLowerCase().includes(term) ||
        sale.cashier.toLowerCase().includes(term);

      const matchesPayment =
        paymentFilter === "All" || sale.payment === paymentFilter;

      const matchesStatus =
        statusFilter === "All" || sale.status === statusFilter;

      return matchesSearch && matchesPayment && matchesStatus;
    });
  }, [sales, search, paymentFilter, statusFilter]);

  const totalSales = sales
    .filter((sale) => sale.status === "Completed")
    .reduce((sum, sale) => sum + sale.paid, 0);

  const completedCount = sales.filter(
    (sale) => sale.status === "Completed"
  ).length;

  const refundCount = sales.filter(
    (sale) => sale.status === "Refund Requested"
  ).length;

  const openRefund = (sale) => {
    setRefundSale(sale);
    setRefundReason("");
  };

  const submitRefund = (event) => {
    event.preventDefault();
    if (!refundSale || !refundReason.trim()) return;

    setSales((current) =>
      current.map((sale) =>
        sale.id === refundSale.id
          ? { ...sale, status: "Refund Requested" }
          : sale
      )
    );

    setRefundSale(null);
    setSelectedSale(null);
  };

  const printReceipt = (sale) => {
    const receiptWindow = window.open("", "_blank", "width=420,height=700");
    if (!receiptWindow) return;

    const rows = sale.items
      .map(
        (item) => `
          <tr>
            <td>${item.name}<br />${item.qty} × ${money(item.price)}</td>
            <td style="text-align:right">${money(item.qty * item.price)}</td>
          </tr>`
      )
      .join("");

    receiptWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${sale.invoice}</title>
          <style>
            body{font:14px Arial,sans-serif;padding:24px;color:#111}
            h2,p{text-align:center;margin:6px 0}
            table{width:100%;border-collapse:collapse;margin:24px 0}
            td{padding:10px 0;border-bottom:1px dashed #ccc}
            .total{font-size:18px;font-weight:bold;text-align:right}
          </style>
        </head>
        <body>
          <h2>Vinora</h2>
          <p>Sales Receipt</p>
          <p>${sale.invoice}</p>
          <p>${dateText(sale.date)}</p>
          <p>${sale.customer}</p>
          <table>${rows}</table>
          <p>Payment: ${sale.payment}</p>
          <p class="total">Total: ${money(sale.paid)}</p>
          <p>Thank you for your purchase</p>
          <script>window.onload=()=>window.print();</script>
        </body>
      </html>
    `);
    receiptWindow.document.close();
  };

  return (
    <div className="sales-history-page">
      <div className="sales-history-header">
        <div>
          <div className="sales-history-breadcrumb">
            <Link to="/pos">POS</Link>
            <span>/</span>
            <span>Sales History</span>
          </div>
          <h1>Sales History</h1>
          <p>Review transactions, receipts and refund requests.</p>
        </div>

        <Link to="/pos" className="sales-history-back">
          <Receipt size={17} />
          Back to POS
        </Link>
      </div>

      <div className="sales-history-stats">
        <div className="sales-history-stat">
          <span>Completed transactions</span>
          <strong>{completedCount}</strong>
        </div>
        <div className="sales-history-stat">
          <span>Recorded sales</span>
          <strong>{money(totalSales)}</strong>
        </div>
        <div className="sales-history-stat">
          <span>Refund requests</span>
          <strong>{refundCount}</strong>
        </div>
      </div>

      <section className="sales-history-panel">
        <div className="sales-history-panel-heading">
          <div>
            <h2>Transactions</h2>
            <p>{filteredSales.length} records found</p>
          </div>
        </div>

        <div className="sales-history-filters">
          <div className="sales-history-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search invoice, customer or cashier..."
            />
          </div>

          <label className="sales-history-select">
            <span>Payment</span>
            <select
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value)}
            >
              <option>All</option>
              <option>Cash</option>
              <option>Transfer</option>
              <option>POS</option>
              <option>Credit</option>
            </select>
            <ChevronDown size={15} />
          </label>

          <label className="sales-history-select">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option>All</option>
              <option>Completed</option>
              <option>Refund Requested</option>
            </select>
            <ChevronDown size={15} />
          </label>
        </div>

        <div className="sales-history-table-wrap">
          <table className="sales-history-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date & time</th>
                <th>Customer</th>
                <th>Cashier</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td>
                    <strong>{sale.invoice}</strong>
                  </td>
                  <td>{dateText(sale.date)}</td>
                  <td>{sale.customer}</td>
                  <td>{sale.cashier}</td>
                  <td>{sale.payment}</td>
                  <td className="sales-history-amount">{money(sale.paid)}</td>
                  <td>
                    <span
                      className={`sales-history-status ${
                        sale.status === "Completed" ? "completed" : "pending"
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td>
                    <div className="sales-history-actions">
                      <button
                        title="View transaction"
                        onClick={() => setSelectedSale(sale)}
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        title="Print receipt"
                        onClick={() => printReceipt(sale)}
                      >
                        <Printer size={17} />
                      </button>
                      <button
                        title="Request refund"
                        disabled={sale.status !== "Completed"}
                        onClick={() => openRefund(sale)}
                      >
                        <RotateCcw size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan="8" className="sales-history-empty">
                    No transactions match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedSale && (
        <div className="sales-history-overlay" onClick={() => setSelectedSale(null)}>
          <div
            className="sales-history-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sales-history-modal-header">
              <div>
                <span>Transaction details</span>
                <h2>{selectedSale.invoice}</h2>
              </div>
              <button onClick={() => setSelectedSale(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="sales-history-detail-grid">
              <div><span>Customer</span><strong>{selectedSale.customer}</strong></div>
              <div><span>Cashier</span><strong>{selectedSale.cashier}</strong></div>
              <div><span>Date</span><strong>{dateText(selectedSale.date)}</strong></div>
              <div><span>Payment</span><strong>{selectedSale.payment}</strong></div>
            </div>

            <h3 className="sales-history-items-title">Items purchased</h3>
            <div className="sales-history-line-items">
              {selectedSale.items.map((item, index) => (
                <div className="sales-history-line" key={`${item.name}-${index}`}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.qty} × {money(item.price)}</span>
                  </div>
                  <strong>{money(item.qty * item.price)}</strong>
                </div>
              ))}
            </div>

            <div className="sales-history-total-row">
              <span>Discount</span>
              <strong>{money(selectedSale.discount)}</strong>
            </div>
            <div className="sales-history-total-row grand">
              <span>Total paid</span>
              <strong>{money(selectedSale.paid)}</strong>
            </div>

            <div className="sales-history-modal-actions">
              <button
                className="sales-history-secondary"
                onClick={() => printReceipt(selectedSale)}
              >
                <Printer size={16} /> Print receipt
              </button>
              <button
                className="sales-history-primary"
                disabled={selectedSale.status !== "Completed"}
                onClick={() => openRefund(selectedSale)}
              >
                <RotateCcw size={16} /> Request refund
              </button>
            </div>
          </div>
        </div>
      )}

      {refundSale && (
        <div className="sales-history-overlay" onClick={() => setRefundSale(null)}>
          <form
            className="sales-history-modal sales-history-refund-modal"
            onSubmit={submitRefund}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sales-history-modal-header">
              <div>
                <span>Refund request</span>
                <h2>{refundSale.invoice}</h2>
              </div>
              <button type="button" onClick={() => setRefundSale(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="sales-history-refund-notice">
              This demo marks the sale as refund requested. It does not issue
              money or return stock.
            </div>

            <label className="sales-history-refund-label">
              Refund reason
              <textarea
                value={refundReason}
                onChange={(event) => setRefundReason(event.target.value)}
                placeholder="Enter the reason for the refund..."
                required
                rows="4"
              />
            </label>

            <div className="sales-history-modal-actions">
              <button
                type="button"
                className="sales-history-secondary"
                onClick={() => setRefundSale(null)}
              >
                Cancel
              </button>
              <button type="submit" className="sales-history-primary">
                Submit request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
