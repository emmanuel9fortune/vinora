
import { useMemo, useState } from "react";
import {
  Search,
  PackageCheck,
  Truck,
  ClipboardList,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Eye,
  X,
  Plus,
  Minus,
  CalendarDays,
  Boxes,
  Filter,
  RotateCcw,
} from "lucide-react";
import "../../styles/purchases.css";

const initialOrders = [
  {
    id: "PO-2026-0018",
    supplier: "MedPlus Distribution Ltd",
    orderDate: "2026-11-12",
    expectedDate: "2026-11-25",
    status: "Approved",
    items: [
      {
        id: 1,
        name: "Paracetamol 500mg",
        ordered: 500,
        received: 0,
        unit: "Tablets",
        cost: 35,
      },
      {
        id: 2,
        name: "Amoxicillin 500mg",
        ordered: 200,
        received: 0,
        unit: "Capsules",
        cost: 120,
      },
      {
        id: 3,
        name: "Vitamin C 1000mg",
        ordered: 150,
        received: 0,
        unit: "Tablets",
        cost: 85,
      },
    ],
  },
  {
    id: "PO-2026-0017",
    supplier: "HealthBridge Pharmaceuticals",
    orderDate: "2026-11-10",
    expectedDate: "2026-11-23",
    status: "Partially Received",
    items: [
      {
        id: 1,
        name: "Cetirizine 10mg",
        ordered: 300,
        received: 100,
        unit: "Tablets",
        cost: 45,
      },
      {
        id: 2,
        name: "Metformin 500mg",
        ordered: 250,
        received: 100,
        unit: "Tablets",
        cost: 65,
      },
    ],
  },
  {
    id: "PO-2026-0016",
    supplier: "PrimeCare Medical Supplies",
    orderDate: "2026-11-08",
    expectedDate: "2026-11-22",
    status: "Approved",
    items: [
      {
        id: 1,
        name: "Omeprazole 20mg",
        ordered: 180,
        received: 0,
        unit: "Capsules",
        cost: 95,
      },
      {
        id: 2,
        name: "Artemether/Lumefantrine",
        ordered: 100,
        received: 0,
        unit: "Packs",
        cost: 650,
      },
    ],
  },
  {
    id: "PO-2026-0015",
    supplier: "Wellness Pharma Nigeria",
    orderDate: "2026-11-05",
    expectedDate: "2026-11-18",
    status: "Fully Received",
    items: [
      {
        id: 1,
        name: "Vitamin C 1000mg",
        ordered: 100,
        received: 100,
        unit: "Tablets",
        cost: 85,
      },
    ],
  },
];

const initialReceipts = [
  {
    id: "GRN-2026-0009",
    orderId: "PO-2026-0017",
    supplier: "HealthBridge Pharmaceuticals",
    receivedDate: "2026-11-20",
    reference: "HB-INV-8841",
    itemsCount: 2,
    quantity: 200,
    status: "Confirmed",
    receivedBy: "Chinedu Okafor",
  },
  {
    id: "GRN-2026-0008",
    orderId: "PO-2026-0015",
    supplier: "Wellness Pharma Nigeria",
    receivedDate: "2026-11-18",
    reference: "WPN-INV-2201",
    itemsCount: 1,
    quantity: 100,
    status: "Confirmed",
    receivedBy: "Amina Yusuf",
  },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function GoodsReceived() {
  const [orders, setOrders] = useState(initialOrders);
  const [receipts, setReceipts] = useState(initialReceipts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewReceipt, setViewReceipt] = useState(null);
  const [receivingOrder, setReceivingOrder] = useState(null);
  const [receiptForm, setReceiptForm] = useState({
    reference: "",
    receivedDate: new Date().toISOString().slice(0, 10),
    notes: "",
    receivedBy: "Current User",
  });
  const [receiveItems, setReceiveItems] = useState([]);

  const availableOrders = useMemo(
    () =>
      orders.filter((order) =>
        order.items.some((item) => item.received < item.ordered)
      ),
    [orders]
  );

  const filteredOrders = availableOrders.filter((order) => {
    const query = search.toLowerCase();

    const matchesSearch =
      order.id.toLowerCase().includes(query) ||
      order.supplier.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredReceipts = receipts.filter((receipt) => {
    const query = search.toLowerCase();

    return (
      receipt.id.toLowerCase().includes(query) ||
      receipt.orderId.toLowerCase().includes(query) ||
      receipt.supplier.toLowerCase().includes(query) ||
      receipt.reference.toLowerCase().includes(query)
    );
  });

  const totalPending = availableOrders.length;

  const partiallyReceived = orders.filter(
    (order) => order.status === "Partially Received"
  ).length;

  const totalReceivedQuantity = receipts.reduce(
    (total, receipt) => total + receipt.quantity,
    0
  );

  const totalReceipts = receipts.length;

  const openReceiving = (order) => {
    setReceivingOrder(order);
    setReceiptForm({
      reference: "",
      receivedDate: new Date().toISOString().slice(0, 10),
      notes: "",
      receivedBy: "Current User",
    });

    setReceiveItems(
      order.items.map((item) => ({
        ...item,
        receiveNow: 0,
        batchNumber: "",
        expiryDate: "",
      }))
    );
  };

  const updateReceiveItem = (itemId, field, value) => {
    setReceiveItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const receiveQuantity = (item) =>
    Number(item.receiveNow) || 0;

  const totalReceivingQuantity = receiveItems.reduce(
    (total, item) => total + receiveQuantity(item),
    0
  );

  const totalReceivingValue = receiveItems.reduce(
    (total, item) => total + receiveQuantity(item) * item.cost,
    0
  );

  const confirmReceipt = () => {
    if (!receivingOrder) return;

    if (!receiptForm.reference.trim()) {
      alert("Enter the supplier delivery or invoice reference.");
      return;
    }

    if (!receiptForm.receivedDate) {
      alert("Select the date the goods were received.");
      return;
    }

    if (totalReceivingQuantity <= 0) {
      alert("Enter a received quantity for at least one product.");
      return;
    }

    for (const item of receiveItems) {
      const quantity = receiveQuantity(item);
      const remaining = item.ordered - item.received;

      if (quantity < 0 || quantity > remaining) {
        alert(
          `The received quantity for ${item.name} cannot exceed the outstanding quantity of ${remaining}.`
        );
        return;
      }

      if (quantity > 0 && !item.batchNumber.trim()) {
        alert(`Enter a batch number for ${item.name}.`);
        return;
      }

      if (quantity > 0 && !item.expiryDate) {
        alert(`Enter an expiry date for ${item.name}.`);
        return;
      }

      if (
        quantity > 0 &&
        item.expiryDate < receiptForm.receivedDate
      ) {
        alert(`The expiry date for ${item.name} cannot be before the receiving date.`);
        return;
      }
    }

    const updatedOrders = orders.map((order) => {
      if (order.id !== receivingOrder.id) return order;

      const updatedItems = order.items.map((item) => {
        const receivedItem = receiveItems.find(
          (entry) => entry.id === item.id
        );

        return {
          ...item,
          received:
            item.received + (Number(receivedItem?.receiveNow) || 0),
        };
      });

      const isFullyReceived = updatedItems.every(
        (item) => item.received >= item.ordered
      );

      const hasReceivedItems = updatedItems.some(
        (item) => item.received > 0
      );

      return {
        ...order,
        items: updatedItems,
        status: isFullyReceived
          ? "Fully Received"
          : hasReceivedItems
          ? "Partially Received"
          : order.status,
      };
    });

    const newReceipt = {
      id: `GRN-2026-${String(receipts.length + 10).padStart(4, "0")}`,
      orderId: receivingOrder.id,
      supplier: receivingOrder.supplier,
      receivedDate: receiptForm.receivedDate,
      reference: receiptForm.reference.trim(),
      itemsCount: receiveItems.filter(
        (item) => receiveQuantity(item) > 0
      ).length,
      quantity: totalReceivingQuantity,
      status: "Confirmed",
      receivedBy: receiptForm.receivedBy,
      notes: receiptForm.notes,
      value: totalReceivingValue,
      items: receiveItems
        .filter((item) => receiveQuantity(item) > 0)
        .map((item) => ({
          name: item.name,
          quantity: receiveQuantity(item),
          unit: item.unit,
          cost: item.cost,
          batchNumber: item.batchNumber,
          expiryDate: item.expiryDate,
        })),
    };

    setOrders(updatedOrders);
    setReceipts((current) => [newReceipt, ...current]);
    setReceivingOrder(null);
    setReceiveItems([]);
    setActiveTab("receipts");
  };

  const statusClass = (status) => {
    if (status === "Fully Received" || status === "Confirmed") {
      return "gr-status-success";
    }

    if (status === "Partially Received") {
      return "gr-status-warning";
    }

    if (status === "Approved") {
      return "gr-status-info";
    }

    return "gr-status-neutral";
  };

  return (
    <div className="goods-received-page">
      <div className="gr-page-header">
        <div>
          <div className="gr-breadcrumb">Purchasing / Goods Received</div>
          <h1>Goods Received</h1>
          <p>
            Record and verify deliveries against your approved purchase orders.
          </p>
        </div>

        <div className="gr-header-actions">
          <button
            className="gr-btn gr-btn-secondary"
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
            }}
          >
            <RotateCcw size={16} />
            Reset filters
          </button>
        </div>
      </div>

      <div className="gr-stat-grid">
        <div className="gr-stat-card">
          <div className="gr-stat-icon gr-stat-blue">
            <ClipboardList size={20} />
          </div>
          <div>
            <span>Orders awaiting delivery</span>
            <h2>{totalPending}</h2>
            <small>Orders with outstanding quantities</small>
          </div>
        </div>

        <div className="gr-stat-card">
          <div className="gr-stat-icon gr-stat-orange">
            <Clock3 size={20} />
          </div>
          <div>
            <span>Partially received</span>
            <h2>{partiallyReceived}</h2>
            <small>Orders still awaiting remaining items</small>
          </div>
        </div>

        <div className="gr-stat-card">
          <div className="gr-stat-icon gr-stat-green">
            <PackageCheck size={20} />
          </div>
          <div>
            <span>Confirmed receipts</span>
            <h2>{totalReceipts}</h2>
            <small>Goods received records</small>
          </div>
        </div>

        <div className="gr-stat-card">
          <div className="gr-stat-icon gr-stat-purple">
            <Boxes size={20} />
          </div>
          <div>
            <span>Units received</span>
            <h2>{totalReceivedQuantity.toLocaleString()}</h2>
            <small>Total quantity across receipts</small>
          </div>
        </div>
      </div>

      <div className="gr-notice">
        <AlertCircle size={19} />
        <div>
          <strong>Receiving control</strong>
          <p>
            Only record quantities physically checked and accepted. Every
            received product must have a batch number and expiry date where
            applicable. Confirming a receipt will create a receiving record.
          </p>
        </div>
      </div>

      <div className="gr-content-card">
        <div className="gr-tabs">
          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            <Truck size={16} />
            Orders to receive
            <span>{availableOrders.length}</span>
          </button>

          <button
            className={activeTab === "receipts" ? "active" : ""}
            onClick={() => setActiveTab("receipts")}
          >
            <PackageCheck size={16} />
            Receiving history
            <span>{receipts.length}</span>
          </button>
        </div>

        <div className="gr-toolbar">
          <div className="gr-search">
            <Search size={17} />
            <input
              type="text"
              placeholder={
                activeTab === "orders"
                  ? "Search order or supplier..."
                  : "Search receipt, order or supplier..."
              }
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {activeTab === "orders" && (
            <div className="gr-filter">
              <Filter size={16} />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="All">All statuses</option>
                <option value="Approved">Approved</option>
                <option value="Partially Received">Partially received</option>
              </select>
            </div>
          )}
        </div>

        {activeTab === "orders" ? (
          <div className="gr-table-wrap">
            <table className="gr-table">
              <thead>
                <tr>
                  <th>Purchase order</th>
                  <th>Supplier</th>
                  <th>Expected date</th>
                  <th>Items</th>
                  <th>Receiving progress</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => {
                  const totalOrdered = order.items.reduce(
                    (sum, item) => sum + item.ordered,
                    0
                  );
                  const totalReceived = order.items.reduce(
                    (sum, item) => sum + item.received,
                    0
                  );
                  const progress =
                    totalOrdered > 0
                      ? Math.round((totalReceived / totalOrdered) * 100)
                      : 0;

                  return (
                    <tr key={order.id}>
                      <td>
                        <strong className="gr-primary-text">{order.id}</strong>
                        <small>Placed {formatDate(order.orderDate)}</small>
                      </td>

                      <td>{order.supplier}</td>

                      <td>{formatDate(order.expectedDate)}</td>

                      <td>{order.items.length} products</td>

                      <td>
                        <div className="gr-progress-cell">
                          <div className="gr-progress-label">
                            <span>{progress}%</span>
                            <small>
                              {totalReceived.toLocaleString()} /{" "}
                              {totalOrdered.toLocaleString()}
                            </small>
                          </div>
                          <div className="gr-progress-track">
                            <div
                              className="gr-progress-fill"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={`gr-status ${statusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>

                      <td>
                        <div className="gr-row-actions">
                          <button
                            className="gr-icon-btn"
                            title="View order"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye size={17} />
                          </button>
                          <button
                            className="gr-btn gr-btn-primary gr-btn-small"
                            onClick={() => openReceiving(order)}
                          >
                            Receive goods
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="7">
                      <div className="gr-empty">
                        <PackageCheck size={30} />
                        <strong>No outstanding orders found</strong>
                        <span>
                          Approved orders with outstanding quantities will
                          appear here.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="gr-table-wrap">
            <table className="gr-table">
              <thead>
                <tr>
                  <th>Receipt number</th>
                  <th>Purchase order</th>
                  <th>Supplier</th>
                  <th>Received date</th>
                  <th>Reference</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredReceipts.map((receipt) => (
                  <tr key={receipt.id}>
                    <td>
                      <strong className="gr-primary-text">{receipt.id}</strong>
                    </td>
                    <td>{receipt.orderId}</td>
                    <td>{receipt.supplier}</td>
                    <td>{formatDate(receipt.receivedDate)}</td>
                    <td>{receipt.reference}</td>
                    <td>{receipt.quantity.toLocaleString()}</td>
                    <td>
                      <span className={`gr-status ${statusClass(receipt.status)}`}>
                        {receipt.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="gr-icon-btn"
                        title="View receipt"
                        onClick={() => setViewReceipt(receipt)}
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredReceipts.length === 0 && (
                  <tr>
                    <td colSpan="8">
                      <div className="gr-empty">
                        <ClipboardList size={30} />
                        <strong>No receiving records found</strong>
                        <span>
                          Confirmed deliveries will appear in this history.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {receivingOrder && (
        <div className="gr-modal-backdrop">
          <div className="gr-modal gr-receiving-modal">
            <div className="gr-modal-header">
              <div>
                <span className="gr-modal-eyebrow">Goods receiving</span>
                <h2>Receive purchase order</h2>
                <p>{receivingOrder.id} · {receivingOrder.supplier}</p>
              </div>
              <button
                className="gr-close-btn"
                onClick={() => setReceivingOrder(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="gr-modal-body">
              <div className="gr-receipt-meta">
                <label>
                  Supplier invoice / delivery reference
                  <input
                    value={receiptForm.reference}
                    onChange={(event) =>
                      setReceiptForm({
                        ...receiptForm,
                        reference: event.target.value,
                      })
                    }
                    placeholder="e.g. INV-2026-001"
                  />
                </label>

                <label>
                  Date received
                  <input
                    type="date"
                    value={receiptForm.receivedDate}
                    onChange={(event) =>
                      setReceiptForm({
                        ...receiptForm,
                        receivedDate: event.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <div className="gr-receive-heading">
                <div>
                  <h3>Products on this order</h3>
                  <p>Enter the quantity physically received for each item.</p>
                </div>
              </div>

              <div className="gr-receive-items">
                {receiveItems.map((item) => {
                  const remaining = item.ordered - item.received;

                  return (
                    <div className="gr-receive-item" key={item.id}>
                      <div className="gr-receive-product">
                        <div className="gr-product-icon">
                          <Boxes size={18} />
                        </div>
                        <div>
                          <strong>{item.name}</strong>
                          <span>
                            Ordered: {item.ordered} {item.unit} · Previously
                            received: {item.received}
                          </span>
                          <small>
                            Outstanding: <b>{remaining} {item.unit}</b>
                          </small>
                        </div>
                      </div>

                      <div className="gr-receive-fields">
                        <label>
                          Receive now ({item.unit})
                          <input
                            type="number"
                            min="0"
                            max={remaining}
                            value={item.receiveNow}
                            onChange={(event) =>
                              updateReceiveItem(
                                item.id,
                                "receiveNow",
                                event.target.value
                              )
                            }
                          />
                        </label>

                        <label>
                          Batch number
                          <input
                            value={item.batchNumber}
                            onChange={(event) =>
                              updateReceiveItem(
                                item.id,
                                "batchNumber",
                                event.target.value
                              )
                            }
                            placeholder="Enter batch number"
                            disabled={receiveQuantity(item) <= 0}
                          />
                        </label>

                        <label>
                          Expiry date
                          <input
                            type="date"
                            value={item.expiryDate}
                            onChange={(event) =>
                              updateReceiveItem(
                                item.id,
                                "expiryDate",
                                event.target.value
                              )
                            }
                            disabled={receiveQuantity(item) <= 0}
                          />
                        </label>
                      </div>

                      <div className="gr-receive-cost">
                        Unit cost: {formatCurrency(item.cost)}
                        <strong>
                          {formatCurrency(
                            receiveQuantity(item) * item.cost
                          )}
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>

              <label className="gr-notes-field">
                Receiving notes
                <textarea
                  rows="3"
                  value={receiptForm.notes}
                  onChange={(event) =>
                    setReceiptForm({
                      ...receiptForm,
                      notes: event.target.value,
                    })
                  }
                  placeholder="Record shortages, damaged packaging or other observations..."
                />
              </label>

              <div className="gr-receive-summary">
                <div>
                  <span>Products being received</span>
                  <strong>
                    {receiveItems.filter(
                      (item) => receiveQuantity(item) > 0
                    ).length}
                  </strong>
                </div>
                <div>
                  <span>Total units received</span>
                  <strong>{totalReceivingQuantity.toLocaleString()}</strong>
                </div>
                <div>
                  <span>Receiving value</span>
                  <strong>{formatCurrency(totalReceivingValue)}</strong>
                </div>
              </div>

              <div className="gr-receive-warning">
                <AlertCircle size={17} />
                Confirm only after physically checking the delivery. In a
                connected system, confirmation will create stock batches and
                immutable stock movement records.
              </div>
            </div>

            <div className="gr-modal-footer">
              <button
                className="gr-btn gr-btn-secondary"
                onClick={() => setReceivingOrder(null)}
              >
                Cancel
              </button>
              <button
                className="gr-btn gr-btn-primary"
                onClick={confirmReceipt}
              >
                <CheckCircle2 size={17} />
                Confirm goods received
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="gr-modal-backdrop">
          <div className="gr-modal gr-detail-modal">
            <div className="gr-modal-header">
              <div>
                <span className="gr-modal-eyebrow">Purchase order details</span>
                <h2>{selectedOrder.id}</h2>
                <p>{selectedOrder.supplier}</p>
              </div>
              <button
                className="gr-close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="gr-modal-body">
              <div className="gr-detail-meta">
                <div>
                  <span>Order date</span>
                  <strong>{formatDate(selectedOrder.orderDate)}</strong>
                </div>
                <div>
                  <span>Expected delivery</span>
                  <strong>{formatDate(selectedOrder.expectedDate)}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{selectedOrder.status}</strong>
                </div>
              </div>

              <h3>Ordered products</h3>
              <div className="gr-detail-list">
                {selectedOrder.items.map((item) => (
                  <div key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>
                        {item.received} received of {item.ordered} {item.unit}
                      </span>
                    </div>
                    <strong>{formatCurrency(item.cost * item.ordered)}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="gr-modal-footer">
              <button
                className="gr-btn gr-btn-secondary"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
              <button
                className="gr-btn gr-btn-primary"
                onClick={() => {
                  const order = selectedOrder;
                  setSelectedOrder(null);
                  openReceiving(order);
                }}
              >
                Receive goods
              </button>
            </div>
          </div>
        </div>
      )}

      {viewReceipt && (
        <div className="gr-modal-backdrop">
          <div className="gr-modal gr-detail-modal">
            <div className="gr-modal-header">
              <div>
                <span className="gr-modal-eyebrow">Receiving record</span>
                <h2>{viewReceipt.id}</h2>
                <p>{viewReceipt.supplier}</p>
              </div>
              <button
                className="gr-close-btn"
                onClick={() => setViewReceipt(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="gr-modal-body">
              <div className="gr-detail-meta">
                <div>
                  <span>Purchase order</span>
                  <strong>{viewReceipt.orderId}</strong>
                </div>
                <div>
                  <span>Received date</span>
                  <strong>{formatDate(viewReceipt.receivedDate)}</strong>
                </div>
                <div>
                  <span>Supplier reference</span>
                  <strong>{viewReceipt.reference}</strong>
                </div>
              </div>

              <div className="gr-detail-meta">
                <div>
                  <span>Received by</span>
                  <strong>{viewReceipt.receivedBy}</strong>
                </div>
                <div>
                  <span>Total quantity</span>
                  <strong>{viewReceipt.quantity}</strong>
                </div>
                <div>
                  <span>Receiving value</span>
                  <strong>
                    {formatCurrency(viewReceipt.value || 0)}
                  </strong>
                </div>
              </div>

              <h3>Received products</h3>
              <div className="gr-detail-list">
                {(viewReceipt.items || []).map((item, index) => (
                  <div key={`${item.name}-${index}`}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>
                        {item.quantity} {item.unit} · Batch {item.batchNumber}
                      </span>
                      <small>Expiry: {item.expiryDate ? formatDate(item.expiryDate) : "Not recorded"}</small>
                    </div>
                    <strong>
                      {formatCurrency(item.quantity * item.cost)}
                    </strong>
                  </div>
                ))}
              </div>

              {viewReceipt.notes && (
                <div className="gr-receipt-notes">
                  <span>Receiving notes</span>
                  <p>{viewReceipt.notes}</p>
                </div>
              )}
            </div>

            <div className="gr-modal-footer">
              <button
                className="gr-btn gr-btn-secondary"
                onClick={() => setViewReceipt(null)}
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

export default GoodsReceived;
