
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  UserRound,
  ScanBarcode,
  CreditCard,
  Banknote,
  Wallet,
  X,
  CheckCircle2,
  Package,
  History,
  RotateCcw,
  Clock3,
} from "lucide-react";
import "../../styles/pos.css";
import { Link } from "react-router-dom";

const products = [
  { id: "PRD-001", name: "Paracetamol 500mg", category: "Pain Relief", price: 2500, stock: 120, unit: "pack" },
  { id: "PRD-002", name: "Amoxicillin 500mg", category: "Antibiotics", price: 6000, stock: 45, unit: "pack" },
  { id: "PRD-003", name: "Vitamin C 1000mg", category: "Vitamins", price: 4500, stock: 80, unit: "bottle" },
  { id: "PRD-004", name: "Cetirizine 10mg", category: "Allergy", price: 1800, stock: 65, unit: "pack" },
  { id: "PRD-005", name: "Metformin 500mg", category: "Diabetes", price: 3200, stock: 52, unit: "pack" },
  { id: "PRD-006", name: "Omeprazole 20mg", category: "Digestive Health", price: 5200, stock: 34, unit: "pack" },
  { id: "PRD-007", name: "ORS Sachet", category: "Digestive Health", price: 700, stock: 150, unit: "sachet" },
  { id: "PRD-008", name: "Artemether/Lumefantrine", category: "Antimalarials", price: 8500, stock: 28, unit: "pack" },
  { id: "PRD-009", name: "Ibuprofen 400mg", category: "Pain Relief", price: 2200, stock: 75, unit: "pack" },
  { id: "PRD-010", name: "Multivitamin Tablets", category: "Vitamins", price: 3800, stock: 40, unit: "bottle" },
];

const customers = [
  { id: "CUS-0001", name: "John Adebayo" },
  { id: "CUS-0002", name: "Wellness Family Clinic" },
  { id: "CUS-0003", name: "Michael Eze" },
  { id: "CUS-0004", name: "Grace Okafor" },
];

const money = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

export default function POS() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [discount, setDiscount] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [showCheckout, setShowCheckout] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountAmount = Math.min(
    subtotal,
    Math.max(0, Number(discount) || 0)
  );

  const total = Math.max(0, subtotal - discountAmount);

  const selectedCustomer = customers.find(
    (customer) => customer.id === customerId
  );

  const addToCart = (product) => {
    if (product.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        if (existing.quantity >= product.stock) return prev;

        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, change) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== productId) return item;

          const quantity = Math.min(
            item.stock,
            item.quantity + change
          );

          return { ...item, quantity };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const completeSale = () => {
    if (cart.length === 0) return;

    const sale = {
      invoice: `INV-${Date.now().toString().slice(-6)}`,
      customer: selectedCustomer?.name || "Walk-in Customer",
      items: cart,
      subtotal,
      discount: discountAmount,
      total,
      paymentMethod,
      date: new Date().toLocaleString("en-NG"),
    };

    setCompletedSale(sale);
    setShowCheckout(false);
    setCart([]);
    setDiscount("0");
    setCustomerId("");
  };

  const closeCompletedSale = () => {
    setCompletedSale(null);
  };

  return (
    <div className="pos-page">
      <div className="pos-header">
        <div>
          <div className="pos-breadcrumb">Sales / Point of Sale</div>
          <h1>Point of Sale</h1>
          <p>Search products and process customer sales.</p>
        </div>


        <div className="customers-header-actions">
            <Link to="/pos/refunds" className="sales-history-back">
                <RotateCcw size={17} />
                Refunds & Returns
            </Link>

            <Link to="/pos/sales-history" className="pos-history-link">
                <History size={17} />
                Sales History
            </Link>

            <Link to="/pos/shifts" className="pos-history-link">
                <Clock3 size={17} />
                Cashier Shifts
            </Link>
                        
            <div className="pos-register-status">
            <span />
            Register open
            </div>
        </div>
      </div>

      <div className="pos-workspace">
        <section className="pos-products-panel">
          <div className="pos-search-row">
            <div className="pos-search">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search product name or SKU..."
              />
            </div>

            <button
              className="pos-scan-button"
              title="Barcode scanner input"
              onClick={() => document.querySelector(".pos-search input")?.focus()}
            >
              <ScanBarcode size={20} />
            </button>
          </div>

          <div className="pos-category-list">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="pos-product-count">
            <span>Products</span>
            <span>{filteredProducts.length} items</span>
          </div>

          <div className="pos-product-grid">
            {filteredProducts.map((product) => {
              const cartItem = cart.find((item) => item.id === product.id);

              return (
                <button
                  className="pos-product-card"
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                >
                  <div className="pos-product-image">
                    <Package size={25} />
                    {cartItem && (
                      <span className="pos-product-cart-count">
                        {cartItem.quantity}
                      </span>
                    )}
                  </div>

                  <div className="pos-product-info">
                    <strong>{product.name}</strong>
                    <span>{product.category}</span>
                    <div className="pos-product-bottom">
                      <b>{money(product.price)}</b>
                      <small>{product.stock} in stock</small>
                    </div>
                  </div>

                  <div className="pos-product-add">
                    <Plus size={16} />
                  </div>
                </button>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="pos-empty-products">
                <Package size={28} />
                <strong>No products found</strong>
                <span>Try another search or category.</span>
              </div>
            )}
          </div>
        </section>

        <aside className="pos-cart-panel">
          <div className="pos-cart-header">
            <div>
              <h2>Current Sale</h2>
              <span>
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>

            <button
              className="pos-clear-cart"
              onClick={() => setCart([])}
              disabled={cart.length === 0}
            >
              Clear
            </button>
          </div>

          <div className="pos-customer-select">
            <UserRound size={17} />
            <select
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
            >
              <option value="">Walk-in Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pos-cart-items">
            {cart.map((item) => (
              <div className="pos-cart-item" key={item.id}>
                <div className="pos-cart-item-top">
                  <div>
                    <strong>{item.name}</strong>
                    <span>{money(item.price)} / {item.unit}</span>
                  </div>

                  <button
                    className="pos-remove-item"
                    title="Remove item"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="pos-cart-item-bottom">
                  <div className="pos-quantity-control">
                    <button onClick={() => updateQuantity(item.id, -1)}>
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <strong>{money(item.price * item.quantity)}</strong>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div className="pos-empty-cart">
                <div>
                  <ShoppingCart size={30} />
                </div>
                <strong>Your cart is empty</strong>
                <span>Select products to add them to this sale.</span>
              </div>
            )}
          </div>

          <div className="pos-cart-summary">
            <div>
              <span>Subtotal</span>
              <strong>{money(subtotal)}</strong>
            </div>

            <label className="pos-discount-row">
              <span>Discount (₦)</span>
              <input
                type="number"
                min="0"
                max={subtotal}
                value={discount}
                onChange={(event) => setDiscount(event.target.value)}
              />
            </label>

            <div className="pos-total-row">
              <span>Total</span>
              <strong>{money(total)}</strong>
            </div>
          </div>

          <div className="pos-payment-methods">
            <span>Payment method</span>
            <div className="pos-payment-options">
              {[
                { label: "Cash", icon: Banknote },
                { label: "Transfer", icon: Wallet },
                { label: "POS", icon: CreditCard },
                { label: "Credit", icon: UserRound },
              ].map((method) => {
                const Icon = method.icon;

                return (
                  <button
                    key={method.label}
                    className={paymentMethod === method.label ? "active" : ""}
                    onClick={() => setPaymentMethod(method.label)}
                  >
                    <Icon size={17} />
                    {method.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            className="pos-checkout-button"
            disabled={cart.length === 0}
            onClick={() => setShowCheckout(true)}
          >
            Checkout
            <span>{money(total)}</span>
          </button>
        </aside>
      </div>

      {showCheckout && (
        <div
          className="pos-modal-overlay"
          onClick={() => setShowCheckout(false)}
        >
          <div
            className="pos-checkout-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pos-modal-header">
              <div>
                <span>Confirm sale</span>
                <h2>Checkout</h2>
              </div>
              <button onClick={() => setShowCheckout(false)}>
                <X size={19} />
              </button>
            </div>

            <div className="pos-checkout-details">
              <div>
                <span>Customer</span>
                <strong>{selectedCustomer?.name || "Walk-in Customer"}</strong>
              </div>
              <div>
                <span>Items</span>
                <strong>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </strong>
              </div>
              <div>
                <span>Payment method</span>
                <strong>{paymentMethod}</strong>
              </div>
              <div>
                <span>Discount</span>
                <strong>{money(discountAmount)}</strong>
              </div>
            </div>

            <div className="pos-checkout-total">
              <span>Amount due</span>
              <strong>{money(total)}</strong>
            </div>

            {paymentMethod === "Credit" && !selectedCustomer && (
              <div className="pos-credit-warning">
                Select a customer before completing a credit sale.
              </div>
            )}

            <div className="pos-modal-actions">
              <button
                className="pos-cancel-button"
                onClick={() => setShowCheckout(false)}
              >
                Back to sale
              </button>
              <button
                className="pos-confirm-button"
                disabled={paymentMethod === "Credit" && !selectedCustomer}
                onClick={completeSale}
              >
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {completedSale && (
        <div className="pos-modal-overlay">
          <div className="pos-checkout-modal pos-sale-success">
            <div className="pos-success-icon">
              <CheckCircle2 size={34} />
            </div>
            <h2>Sale completed</h2>
            <p>Demo transaction recorded in this session.</p>

            <div className="pos-success-invoice">
              <span>Invoice number</span>
              <strong>{completedSale.invoice}</strong>
            </div>

            <div className="pos-success-total">
              <span>Total</span>
              <strong>{money(completedSale.total)}</strong>
            </div>

            <button
              className="pos-confirm-button"
              onClick={closeCompletedSale}
            >
              New Sale
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
