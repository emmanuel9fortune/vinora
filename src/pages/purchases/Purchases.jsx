
import { useMemo, useState } from "react";
import {
  ShoppingCart,
  ClipboardList,
  PackageCheck,
  Wallet,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye,
  FileText,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
} from "lucide-react";
import "../../styles/purchases.css";
import { Link } from "react-router-dom";

const initialPurchases = [
  {
    id: "PO-2026-001",
    supplier: "MedPlus Distribution Ltd",
    date: "22 Nov 2026",
    items: 12,
    amount: 1850000,
    received: 1850000,
    status: "Received",
    paymentStatus: "Paid",
  },
  {
    id: "PO-2026-002",
    supplier: "HealthBridge Pharmaceuticals",
    date: "21 Nov 2026",
    items: 8,
    amount: 920000,
    received: 460000,
    status: "Partially Received",
    paymentStatus: "Partially Paid",
  },
  {
    id: "PO-2026-003",
    supplier: "PrimeCare Medical Supplies",
    date: "20 Nov 2026",
    items: 15,
    amount: 2450000,
    received: 0,
    status: "Pending",
    paymentStatus: "Unpaid",
  },
  {
    id: "PO-2026-004",
    supplier: "Wellness Pharma Nigeria",
    date: "18 Nov 2026",
    items: 6,
    amount: 675000,
    received: 675000,
    status: "Received",
    paymentStatus: "Paid",
  },
  {
    id: "PO-2026-005",
    supplier: "MedPlus Distribution Ltd",
    date: "16 Nov 2026",
    items: 10,
    amount: 1280000,
    received: 0,
    status: "Pending",
    paymentStatus: "Unpaid",
  },
  {
    id: "PO-2026-006",
    supplier: "HealthBridge Pharmaceuticals",
    date: "14 Nov 2026",
    items: 9,
    amount: 740000,
    received: 740000,
    status: "Received",
    paymentStatus: "Partially Paid",
  },
];

const money = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

function Purchases() {
  const [purchases] = useState(initialPurchases);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const totalPurchases = purchases.reduce(
    (total, purchase) => total + purchase.amount,
    0
  );

  const pendingOrders = purchases.filter(
    (purchase) => purchase.status === "Pending"
  ).length;

  const receivedOrders = purchases.filter(
    (purchase) => purchase.status === "Received"
  ).length;

  const outstandingPayments = purchases.reduce(
    (total, purchase) =>
      total + Math.max(purchase.amount - purchase.received, 0),
    0
  );

  const filteredPurchases = useMemo(() => {
    return purchases.filter((purchase) => {
      const searchMatch =
        purchase.id.toLowerCase().includes(search.toLowerCase()) ||
        purchase.supplier.toLowerCase().includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "All" || purchase.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [purchases, search, statusFilter]);

  const statusClass = (status) => {
    if (status === "Received") return "received";
    if (status === "Pending") return "pending";
    return "partial";
  };

  const paymentClass = (status) => {
    if (status === "Paid") return "paid";
    if (status === "Unpaid") return "unpaid";
    return "partial-payment";
  };

  return (
    <div className="purchases-page">
      <div className="purchases-header">
        <div>
          <div className="purchases-breadcrumb">
            Purchasing <span>/</span> Overview
          </div>
          <h1>Purchases</h1>
          <p>
            Monitor purchase orders, stock receipts and supplier payments.
          </p>
        </div>

        <button className="purchases-primary-btn">
          <Plus size={18} />
          New Purchase Order
        </button>
      </div>

      <div className="purchases-stats">
        <div className="purchases-stat-card">
          <div className="purchases-stat-top">
            <div className="purchases-stat-icon purple">
              <ShoppingCart size={21} />
            </div>
            <span className="purchases-stat-trend positive">
              <ArrowUpRight size={14} /> 12.5%
            </span>
          </div>
          <span className="purchases-stat-label">Total Purchases</span>
          <h2>{money(totalPurchases)}</h2>
          <small>Recorded purchase orders</small>
        </div>

        <div className="purchases-stat-card">
          <div className="purchases-stat-top">
            <div className="purchases-stat-icon orange">
              <ClipboardList size={21} />
            </div>
            <span className="purchases-stat-period">Current</span>
          </div>
          <span className="purchases-stat-label">Pending Orders</span>
          <h2>{pendingOrders}</h2>
          <small>Awaiting stock delivery</small>
        </div>

        <div className="purchases-stat-card">
          <div className="purchases-stat-top">
            <div className="purchases-stat-icon green">
              <PackageCheck size={21} />
            </div>
            <span className="purchases-stat-period">Current</span>
          </div>
          <span className="purchases-stat-label">Received Orders</span>
          <h2>{receivedOrders}</h2>
          <small>Fully received orders</small>
        </div>

        <div className="purchases-stat-card">
          <div className="purchases-stat-top">
            <div className="purchases-stat-icon blue">
              <Wallet size={21} />
            </div>
            <span className="purchases-stat-period">Outstanding</span>
          </div>
          <span className="purchases-stat-label">Outstanding Payments</span>
          <h2>{money(outstandingPayments)}</h2>
          <small>Illustrative demo balance</small>
        </div>
      </div>

      <div className="purchases-overview-grid">
        <section className="purchases-panel purchases-activity-panel">
          <div className="purchases-panel-heading">
            <div>
              <h2>Recent Purchase Orders</h2>
              <p>Track the latest orders placed with suppliers.</p>
            </div>
            <button className="purchases-text-btn">View all</button>
          </div>

          <div className="purchases-toolbar">
            <div className="purchases-search">
              <Search size={17} />
              <input
                placeholder="Search order or supplier..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter purchase orders"
            >
              <option value="All">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Partially Received">Partially Received</option>
              <option value="Received">Received</option>
            </select>
          </div>

          <div className="purchases-table-wrapper">
            <table className="purchases-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Supplier</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Order Status</th>
                  <th>Payment</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td>
                      <strong className="purchases-order-id">
                        {purchase.id}
                      </strong>
                    </td>
                    <td>{purchase.supplier}</td>
                    <td>{purchase.date}</td>
                    <td className="purchases-amount">
                      {money(purchase.amount)}
                    </td>
                    <td>
                      <span
                        className={`purchases-status ${statusClass(
                          purchase.status
                        )}`}
                      >
                        {purchase.status}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`purchases-payment ${paymentClass(
                          purchase.paymentStatus
                        )}`}
                      >
                        {purchase.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <div className="purchases-row-menu">
                        <button
                          className="purchases-menu-trigger"
                          onClick={() =>
                            setMenuId(
                              menuId === purchase.id ? null : purchase.id
                            )
                          }
                          aria-label={`Actions for ${purchase.id}`}
                        >
                          <MoreHorizontal size={19} />
                        </button>

                        {menuId === purchase.id && (
                          <div className="purchases-dropdown">
                            <button
                              onClick={() => {
                                setSelectedPurchase(purchase);
                                setMenuId(null);
                              }}
                            >
                              <Eye size={15} /> View details
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredPurchases.length === 0 && (
                  <tr>
                    <td colSpan="7">
                      <div className="purchases-empty">
                        <ShoppingCart size={27} />
                        <strong>No purchase orders found</strong>
                        <span>Try another search or status filter.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="purchases-panel purchases-quick-panel">
          <div className="purchases-panel-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Common purchasing tasks.</p>
            </div>
          </div>

          <div className="purchases-quick-actions">
            <Link to="/purchases/orders" className="purchases-quick-action">
              <div className="purchases-quick-icon green">
                <Plus size={19} />
              </div>
              <div>
                <strong>Create Purchase Order</strong>
                <span>Order products from a supplier</span>
              </div>
              <ArrowUpRight size={17} />
            </Link>

            <Link to="/purchases/goods-received" className="purchases-quick-action">
              <div className="purchases-quick-icon blue">
                <Truck size={19} />
              </div>
              <div>
                <strong>Receive Goods</strong>
                <span>Record a supplier delivery</span>
              </div>
              <ArrowUpRight size={17} />
            </Link>

            <Link to="/purchases/invoices" className="purchases-quick-action">
              <div className="purchases-quick-icon purple">
                <FileText size={19} />
              </div>
              <div>
                <strong>Supplier Invoices</strong>
                <span>Review invoices and balances</span>
              </div>
              <ArrowUpRight size={17} />
            </Link>

            <Link to="/purchases/payments" className="purchases-quick-action">
              <div className="purchases-quick-icon orange">
                <Wallet size={19} />
              </div>
              <div>
                <strong>Record Payment</strong>
                <span>Record a supplier payment</span>
              </div>
              <ArrowUpRight size={17} />
            </Link>

            <Link to="/purchases/returns" className="purchases-quick-action">
                <div className="purchases-quick-icon red">
                    <RotateCcw size={19} />
                </div>
                <div>
                    <strong>Purchase Returns</strong>
                    <span>Manage stock returned to suppliers</span>
                </div>
                <ArrowUpRight size={17} />
            </Link>
          </div>

          <div className="purchases-panel-note">
            <AlertCircle size={17} />
            <span>
              Stock is added to inventory only after goods are received and
              verified.
            </span>
          </div>
        </section>
      </div>

      <section className="purchases-panel purchases-bottom-panel">
        <div className="purchases-panel-heading">
          <div>
            <h2>Purchasing Activity</h2>
            <p>A snapshot of your current purchasing workflow.</p>
          </div>
        </div>

        <div className="purchases-workflow">
          <div className="purchases-workflow-item">
            <div className="purchases-workflow-icon orange">
              <Clock3 size={19} />
            </div>
            <div>
              <strong>Pending Orders</strong>
              <span>Orders awaiting delivery</span>
            </div>
            <b>{pendingOrders}</b>
          </div>

          <div className="purchases-workflow-item">
            <div className="purchases-workflow-icon blue">
              <Truck size={19} />
            </div>
            <div>
              <strong>Partially Received</strong>
              <span>Orders with outstanding quantities</span>
            </div>
            <b>
              {
                purchases.filter(
                  (purchase) => purchase.status === "Partially Received"
                ).length
              }
            </b>
          </div>

          <div className="purchases-workflow-item">
            <div className="purchases-workflow-icon green">
              <CheckCircle2 size={19} />
            </div>
            <div>
              <strong>Completed Orders</strong>
              <span>Orders fully received</span>
            </div>
            <b>{receivedOrders}</b>
          </div>
        </div>
      </section>

      {selectedPurchase && (
        <div
          className="purchases-modal-overlay"
          onMouseDown={() => setSelectedPurchase(null)}
        >
          <div
            className="purchases-detail-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="purchases-modal-heading">
              <div>
                <span>Purchase order details</span>
                <h2>{selectedPurchase.id}</h2>
              </div>
              <button onClick={() => setSelectedPurchase(null)}>×</button>
            </div>

            <div className="purchases-detail-list">
              <div>
                <span>Supplier</span>
                <strong>{selectedPurchase.supplier}</strong>
              </div>
              <div>
                <span>Order date</span>
                <strong>{selectedPurchase.date}</strong>
              </div>
              <div>
                <span>Items</span>
                <strong>{selectedPurchase.items}</strong>
              </div>
              <div>
                <span>Order amount</span>
                <strong>{money(selectedPurchase.amount)}</strong>
              </div>
              <div>
                <span>Received value</span>
                <strong>{money(selectedPurchase.received)}</strong>
              </div>
              <div>
                <span>Order status</span>
                <strong>{selectedPurchase.status}</strong>
              </div>
              <div>
                <span>Payment status</span>
                <strong>{selectedPurchase.paymentStatus}</strong>
              </div>
            </div>

            <button
              className="purchases-primary-btn purchases-modal-close"
              onClick={() => setSelectedPurchase(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Purchases;
