
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ShoppingCart,
  Clock3,
  CheckCircle2,
  PackageCheck,
  XCircle,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  Building2,
  Package,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import "../../styles/purchases.css";

const suppliers = [
  "MedPlus Distribution Ltd",
  "HealthBridge Pharmaceuticals",
  "PrimeCare Medical Supplies",
  "Wellness Pharma Nigeria",
];

const products = [
  { id: 1, name: "Paracetamol 500mg", sku: "MED-001", cost: 850 },
  { id: 2, name: "Amoxicillin 500mg", sku: "MED-002", cost: 1450 },
  { id: 3, name: "Vitamin C 1000mg", sku: "MED-003", cost: 2200 },
  { id: 4, name: "Cetirizine 10mg", sku: "MED-004", cost: 650 },
  { id: 5, name: "Metformin 500mg", sku: "MED-005", cost: 1200 },
  { id: 6, name: "Omeprazole 20mg", sku: "MED-006", cost: 1750 },
];

const initialOrders = [
  {
    id: "PO-2026-001",
    supplier: "MedPlus Distribution Ltd",
    orderDate: "2026-11-22",
    expectedDate: "2026-11-28",
    status: "Received",
    items: [
      { productId: 1, name: "Paracetamol 500mg", quantity: 1000, unitCost: 850 },
      { productId: 3, name: "Vitamin C 1000mg", quantity: 200, unitCost: 2200 },
    ],
    notes: "Regular stock replenishment.",
  },
  {
    id: "PO-2026-002",
    supplier: "HealthBridge Pharmaceuticals",
    orderDate: "2026-11-23",
    expectedDate: "2026-11-29",
    status: "Partially Received",
    items: [
      { productId: 2, name: "Amoxicillin 500mg", quantity: 400, unitCost: 1450 },
      { productId: 4, name: "Cetirizine 10mg", quantity: 300, unitCost: 650 },
    ],
    notes: "",
  },
  {
    id: "PO-2026-003",
    supplier: "PrimeCare Medical Supplies",
    orderDate: "2026-11-24",
    expectedDate: "2026-12-02",
    status: "Pending Approval",
    items: [
      { productId: 5, name: "Metformin 500mg", quantity: 500, unitCost: 1200 },
      { productId: 6, name: "Omeprazole 20mg", quantity: 200, unitCost: 1750 },
    ],
    notes: "Requires manager approval.",
  },
  {
    id: "PO-2026-004",
    supplier: "Wellness Pharma Nigeria",
    orderDate: "2026-11-20",
    expectedDate: "2026-11-27",
    status: "Approved",
    items: [
      { productId: 3, name: "Vitamin C 1000mg", quantity: 300, unitCost: 2200 },
    ],
    notes: "",
  },
  {
    id: "PO-2026-005",
    supplier: "MedPlus Distribution Ltd",
    orderDate: "2026-11-18",
    expectedDate: "2026-11-24",
    status: "Cancelled",
    items: [
      { productId: 4, name: "Cetirizine 10mg", quantity: 250, unitCost: 650 },
    ],
    notes: "Cancelled by management.",
  },
];

const emptyItem = {
  productId: "",
  quantity: 1,
  unitCost: "",
};

const emptyForm = {
  supplier: "",
  expectedDate: "",
  notes: "",
  items: [{ ...emptyItem }],
};

const money = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(value || 0);

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function PurchaseOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [menuId, setMenuId] = useState(null);
  const [notice, setNotice] = useState("");

  const totalValue = orders.reduce(
    (sum, order) =>
      order.status === "Cancelled"
        ? sum
        : sum + order.items.reduce(
            (itemSum, item) =>
              itemSum + Number(item.quantity) * Number(item.unitCost),
            0
          ),
    0
  );

  const pendingCount = orders.filter(
    (order) => order.status === "Pending Approval"
  ).length;

  const approvedCount = orders.filter(
    (order) => order.status === "Approved"
  ).length;

  const receivedCount = orders.filter(
    (order) => order.status === "Received"
  ).length;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        order.id.toLowerCase().includes(searchText) ||
        order.supplier.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const getOrderTotal = (order) =>
    order.items.reduce(
      (sum, item) =>
        sum + Number(item.quantity) * Number(item.unitCost),
      0
    );

  const getTotalItems = (order) =>
    order.items.reduce((sum, item) => sum + Number(item.quantity), 0);

  const getStatusClass = (status) => {
    switch (status) {
      case "Received":
        return "received";
      case "Approved":
        return "approved";
      case "Partially Received":
        return "partial";
      case "Cancelled":
        return "cancelled";
      default:
        return "pending";
    }
  };

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  };

  const openCreateModal = () => {
    setEditingOrder(null);
    setForm({
      ...emptyForm,
      items: [{ ...emptyItem }],
    });
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (order) => {
    if (order.status !== "Pending Approval") {
      showNotice("Only orders awaiting approval can be edited.");
      return;
    }

    setEditingOrder(order);
    setForm({
      supplier: order.supplier,
      expectedDate: order.expectedDate,
      notes: order.notes || "",
      items: order.items.map((item) => ({
        productId: String(item.productId),
        quantity: item.quantity,
        unitCost: item.unitCost,
      })),
    });
    setFormError("");
    setMenuId(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingOrder(null);
    setForm(emptyForm);
    setFormError("");
  };

  const updateItem = (index, field, value) => {
    setForm((previous) => ({
      ...previous,
      items: previous.items.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        if (field === "productId") {
          const product = products.find(
            (entry) => String(entry.id) === value
          );

          return {
            ...item,
            productId: value,
            unitCost: product ? product.cost : "",
          };
        }

        return { ...item, [field]: value };
      }),
    }));
  };

  const addItem = () => {
    setForm((previous) => ({
      ...previous,
      items: [...previous.items, { ...emptyItem }],
    }));
  };

  const removeItem = (index) => {
    setForm((previous) => ({
      ...previous,
      items:
        previous.items.length === 1
          ? previous.items
          : previous.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const formTotal = form.items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0) * Number(item.unitCost || 0),
    0
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.supplier) {
      setFormError("Please select a supplier.");
      return;
    }

    if (!form.expectedDate) {
      setFormError("Please select an expected delivery date.");
      return;
    }

    const invalidItem = form.items.some(
      (item) =>
        !item.productId ||
        Number(item.quantity) <= 0 ||
        Number(item.unitCost) < 0 ||
        item.unitCost === ""
    );

    if (invalidItem) {
      setFormError(
        "Select a product and enter a valid quantity and unit cost for every item."
      );
      return;
    }

    const duplicateProducts =
      new Set(form.items.map((item) => item.productId)).size !==
      form.items.length;

    if (duplicateProducts) {
      setFormError("A product can only appear once in an order. Update its quantity instead.");
      return;
    }

    const preparedItems = form.items.map((item) => {
      const product = products.find(
        (entry) => String(entry.id) === String(item.productId)
      );

      return {
        productId: product.id,
        name: product.name,
        quantity: Number(item.quantity),
        unitCost: Number(item.unitCost),
      };
    });

    if (editingOrder) {
      setOrders((previous) =>
        previous.map((order) =>
          order.id === editingOrder.id
            ? {
                ...order,
                supplier: form.supplier,
                expectedDate: form.expectedDate,
                notes: form.notes.trim(),
                items: preparedItems,
              }
            : order
        )
      );

      showNotice("Purchase order updated successfully.");
    } else {
      const newOrder = {
        id: `PO-${new Date().getFullYear()}-${String(
          Math.max(
            0,
            ...orders.map((order) =>
              Number(order.id.split("-").pop()) || 0
            )
          ) + 1
        ).padStart(3, "0")}`,
        supplier: form.supplier,
        orderDate: new Date().toISOString().slice(0, 10),
        expectedDate: form.expectedDate,
        status: "Pending Approval",
        items: preparedItems,
        notes: form.notes.trim(),
      };

      setOrders((previous) => [newOrder, ...previous]);
      showNotice("Purchase order created and submitted for approval.");
    }

    closeModal();
  };

  const approveOrder = (order) => {
    if (order.status !== "Pending Approval") return;

    setOrders((previous) =>
      previous.map((entry) =>
        entry.id === order.id
          ? { ...entry, status: "Approved" }
          : entry
      )
    );

    setSelectedOrder(null);
    setMenuId(null);
    showNotice(`${order.id} approved successfully.`);
  };

  const cancelOrder = (order) => {
    if (["Received", "Partially Received", "Cancelled"].includes(order.status)) {
      showNotice("This order cannot be cancelled from this screen.");
      return;
    }

    setOrders((previous) =>
      previous.map((entry) =>
        entry.id === order.id
          ? { ...entry, status: "Cancelled" }
          : entry
      )
    );

    setSelectedOrder(null);
    setMenuId(null);
    showNotice(`${order.id} cancelled.`);
  };

  return (
    <div className="purchase-orders-page">
      <div className="purchase-orders-header">
        <div>
          <div className="purchase-orders-breadcrumb">
            Purchasing <span>/</span> Purchase Orders
          </div>
          <h1>Purchase Orders</h1>
          <p>
            Create, review and manage orders placed with your suppliers.
          </p>
        </div>

        <button
          className="po-primary-btn"
          onClick={openCreateModal}
        >
          <Plus size={18} />
          Create Purchase Order
        </button>
      </div>

      {notice && (
        <div className="po-notice">
          <AlertCircle size={17} />
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="po-stats">
        <div className="po-stat-card">
          <div className="po-stat-icon purple">
            <ShoppingCart size={21} />
          </div>
          <span>Total Order Value</span>
          <h2>{money(totalValue)}</h2>
          <small>Excludes cancelled orders</small>
        </div>

        <div className="po-stat-card">
          <div className="po-stat-icon orange">
            <Clock3 size={21} />
          </div>
          <span>Awaiting Approval</span>
          <h2>{pendingCount}</h2>
          <small>Orders requiring review</small>
        </div>

        <div className="po-stat-card">
          <div className="po-stat-icon blue">
            <Package size={21} />
          </div>
          <span>Approved Orders</span>
          <h2>{approvedCount}</h2>
          <small>Awaiting or in delivery</small>
        </div>

        <div className="po-stat-card">
          <div className="po-stat-icon green">
            <PackageCheck size={21} />
          </div>
          <span>Fully Received</span>
          <h2>{receivedCount}</h2>
          <small>Completed purchase orders</small>
        </div>
      </div>

      <section className="po-content-card">
        <div className="po-section-heading">
          <div>
            <h2>All Purchase Orders</h2>
            <p>Review order details and monitor delivery progress.</p>
          </div>
          <span className="po-record-count">
            {filteredOrders.length} records
          </span>
        </div>

        <div className="po-toolbar">
          <div className="po-search">
            <Search size={17} />
            <input
              placeholder="Search order ID or supplier..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter purchase order status"
          >
            <option value="All">All statuses</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Partially Received">Partially Received</option>
            <option value="Received">Received</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="po-table-wrapper">
          <table className="po-table">
            <thead>
              <tr>
                <th>Purchase Order</th>
                <th>Supplier</th>
                <th>Order Date</th>
                <th>Expected Delivery</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong className="po-order-id">{order.id}</strong>
                  </td>
                  <td>
                    <div className="po-supplier-cell">
                      <Building2 size={15} />
                      {order.supplier}
                    </div>
                  </td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td>{formatDate(order.expectedDate)}</td>
                  <td>{getTotalItems(order).toLocaleString()}</td>
                  <td className="po-amount">{money(getOrderTotal(order))}</td>
                  <td>
                    <span className={`po-status ${getStatusClass(order.status)}`}>
                      <span />
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className="po-menu-container">
                      <button
                        className="po-menu-trigger"
                        onClick={() =>
                          setMenuId(menuId === order.id ? null : order.id)
                        }
                        aria-label={`Actions for ${order.id}`}
                      >
                        <MoreHorizontal size={19} />
                      </button>

                      {menuId === order.id && (
                        <div className="po-dropdown">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setMenuId(null);
                            }}
                          >
                            <Eye size={15} /> View details
                          </button>

                          {order.status === "Pending Approval" && (
                            <button onClick={() => openEditModal(order)}>
                              <Pencil size={15} /> Edit order
                            </button>
                          )}

                          {order.status === "Pending Approval" && (
                            <button
                              className="approve-action"
                              onClick={() => approveOrder(order)}
                            >
                              <CheckCircle2 size={15} /> Approve order
                            </button>
                          )}

                          {!["Received", "Partially Received", "Cancelled"].includes(
                            order.status
                          ) && (
                            <button
                              className="cancel-action"
                              onClick={() => cancelOrder(order)}
                            >
                              <XCircle size={15} /> Cancel order
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="8">
                    <div className="po-empty-state">
                      <ShoppingCart size={30} />
                      <strong>No purchase orders found</strong>
                      <span>Try changing your search or filters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="po-information">
        <div className="po-information-icon">
          <AlertCircle size={19} />
        </div>
        <div>
          <strong>Purchase order and inventory control</strong>
          <p>
            Purchase orders record what your organisation intends to buy.
            They do not increase stock quantities. Inventory is updated only
            after delivered goods have been checked and recorded through Goods
            Received.
          </p>
        </div>
      </div>

      {modalOpen && (
        <div className="po-modal-overlay" onMouseDown={closeModal}>
          <div
            className="po-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="po-modal-header">
              <div>
                <span>Purchasing</span>
                <h2>
                  {editingOrder ? "Edit Purchase Order" : "Create Purchase Order"}
                </h2>
                <p>
                  Enter supplier details and the products you want to order.
                </p>
              </div>
              <button onClick={closeModal} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="po-form-grid">
                <div className="po-form-group">
                  <label>Supplier <span>*</span></label>
                  <div className="po-select-wrapper">
                    <select
                      value={form.supplier}
                      onChange={(event) =>
                        setForm({ ...form, supplier: event.target.value })
                      }
                    >
                      <option value="">Select supplier</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier} value={supplier}>
                          {supplier}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={15} />
                  </div>
                </div>

                <div className="po-form-group">
                  <label>Expected Delivery Date <span>*</span></label>
                  <input
                    type="date"
                    value={form.expectedDate}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(event) =>
                      setForm({ ...form, expectedDate: event.target.value })
                    }
                  />
                </div>
              </div>

              <div className="po-items-heading">
                <div>
                  <h3>Order Items</h3>
                  <p>Add the products and quantities to purchase.</p>
                </div>
                <button
                  type="button"
                  className="po-add-item-btn"
                  onClick={addItem}
                >
                  <Plus size={15} /> Add Item
                </button>
              </div>

              <div className="po-form-items">
                {form.items.map((item, index) => (
                  <div className="po-form-item" key={index}>
                    <div className="po-form-item-top">
                      <strong>Item {index + 1}</strong>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={form.items.length === 1}
                        aria-label={`Remove item ${index + 1}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="po-item-fields">
                      <div className="po-form-group product-field">
                        <label>Product</label>
                        <select
                          value={item.productId}
                          onChange={(event) =>
                            updateItem(index, "productId", event.target.value)
                          }
                        >
                          <option value="">Select product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} ({product.sku})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="po-form-group">
                        <label>Quantity</label>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={item.quantity}
                          onChange={(event) =>
                            updateItem(index, "quantity", event.target.value)
                          }
                        />
                      </div>

                      <div className="po-form-group">
                        <label>Unit Cost (₦)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitCost}
                          onChange={(event) =>
                            updateItem(index, "unitCost", event.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="po-item-subtotal">
                      Subtotal:
                      <strong>
                        {money(
                          Number(item.quantity || 0) *
                            Number(item.unitCost || 0)
                        )}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>

              <div className="po-form-group po-notes-group">
                <label>Order Notes</label>
                <textarea
                  rows="3"
                  placeholder="Add delivery instructions or other notes..."
                  value={form.notes}
                  onChange={(event) =>
                    setForm({ ...form, notes: event.target.value })
                  }
                />
              </div>

              <div className="po-form-total">
                <span>Estimated Order Total</span>
                <strong>{money(formTotal)}</strong>
              </div>

              {formError && (
                <div className="po-form-error">
                  <AlertCircle size={16} />
                  {formError}
                </div>
              )}

              <div className="po-modal-actions">
                <button
                  type="button"
                  className="po-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="po-primary-btn">
                  {editingOrder ? "Save Changes" : "Create Purchase Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div
          className="po-modal-overlay"
          onMouseDown={() => setSelectedOrder(null)}
        >
          <div
            className="po-detail-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="po-modal-header">
              <div>
                <span>Purchase order details</span>
                <h2>{selectedOrder.id}</h2>
                <p>{selectedOrder.supplier}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="po-detail-meta">
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

            <h3 className="po-detail-items-title">Ordered Products</h3>

            <div className="po-detail-items">
              {selectedOrder.items.map((item, index) => (
                <div className="po-detail-item" key={`${item.productId}-${index}`}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      {item.quantity.toLocaleString()} × {money(item.unitCost)}
                    </span>
                  </div>
                  <strong>
                    {money(item.quantity * item.unitCost)}
                  </strong>
                </div>
              ))}
            </div>

            <div className="po-detail-total">
              <span>Order Total</span>
              <strong>{money(getOrderTotal(selectedOrder))}</strong>
            </div>

            {selectedOrder.notes && (
              <div className="po-detail-notes">
                <span>Notes</span>
                <p>{selectedOrder.notes}</p>
              </div>
            )}

            <div className="po-modal-actions">
              {selectedOrder.status === "Pending Approval" && (
                <button
                  className="po-primary-btn"
                  onClick={() => approveOrder(selectedOrder)}
                >
                  <CheckCircle2 size={16} />
                  Approve Order
                </button>
              )}
              <button
                className="po-cancel-btn"
                onClick={() => setSelectedOrder(null)}
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

export default PurchaseOrders;
