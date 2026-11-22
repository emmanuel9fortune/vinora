
import { useMemo, useState } from "react";
import {
  Plus, Search, Package, Edit3, X, Barcode,
  Filter, MoreHorizontal, ChevronDown
} from "lucide-react";
import "../../styles/inventory.css";

const initialProducts = [
  {
    id: 1,
    name: "Paracetamol",
    genericName: "Paracetamol",
    brand: "Emzor",
    sku: "MED-0001",
    barcode: "615400001001",
    category: "Pain Relief",
    type: "Medicine",
    strength: "500mg",
    dosageForm: "Tablet",
    purchasePrice: 800,
    sellingPrice: 1200,
    reorderLevel: 100,
    stock: 450,
    status: "Active"
  },
  {
    id: 2,
    name: "Amoxicillin",
    genericName: "Amoxicillin",
    brand: "Pfizer",
    sku: "MED-0002",
    barcode: "615400001002",
    category: "Antibiotics",
    type: "Medicine",
    strength: "500mg",
    dosageForm: "Capsule",
    purchasePrice: 2500,
    sellingPrice: 3500,
    reorderLevel: 100,
    stock: 35,
    status: "Active"
  },
  {
    id: 3,
    name: "Vitamin C",
    genericName: "Ascorbic Acid",
    brand: "Nature's Field",
    sku: "MED-0003",
    barcode: "615400001003",
    category: "Vitamins",
    type: "Medicine",
    strength: "1000mg",
    dosageForm: "Tablet",
    purchasePrice: 1800,
    sellingPrice: 2500,
    reorderLevel: 80,
    stock: 280,
    status: "Active"
  },
  {
    id: 4,
    name: "Digital Thermometer",
    genericName: "",
    brand: "HealthCare",
    sku: "GEN-0004",
    barcode: "615400001004",
    category: "Medical Equipment",
    type: "General Product",
    strength: "",
    dosageForm: "",
    purchasePrice: 3500,
    sellingPrice: 5000,
    reorderLevel: 20,
    stock: 65,
    status: "Active"
  }
];

const emptyForm = {
  name: "",
  genericName: "",
  brand: "",
  sku: "",
  barcode: "",
  category: "",
  type: "General Product",
  strength: "",
  dosageForm: "",
  purchasePrice: "",
  sellingPrice: "",
  reorderLevel: "",
  status: "Active"
};

const money = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(Number(amount) || 0);

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const term = search.toLowerCase();

      const matchesSearch = [
        product.name,
        product.genericName,
        product.brand,
        product.sku,
        product.barcode,
        product.category
      ].some((value) => value?.toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "All" || product.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);

    setForm({
      ...product,
      purchasePrice: String(product.purchasePrice),
      sellingPrice: String(product.sellingPrice),
      reorderLevel: String(product.reorderLevel)
    });

    setError("");
    setModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.sku.trim() || !form.category) {
      setError("Product name, SKU and category are required.");
      return;
    }

    if (
      Number(form.purchasePrice) < 0 ||
      Number(form.sellingPrice) < 0 ||
      Number(form.reorderLevel) < 0
    ) {
      setError("Prices and reorder level cannot be negative.");
      return;
    }

    const duplicateSku = products.some(
      (product) =>
        product.sku.toLowerCase() === form.sku.trim().toLowerCase() &&
        product.id !== editingId
    );

    if (duplicateSku) {
      setError("This SKU is already assigned to another product.");
      return;
    }

    const productData = {
      ...form,
      name: form.name.trim(),
      sku: form.sku.trim(),
      purchasePrice: Number(form.purchasePrice),
      sellingPrice: Number(form.sellingPrice),
      reorderLevel: Number(form.reorderLevel),
      stock: editingId
        ? products.find((product) => product.id === editingId).stock
        : 0
    };

    if (editingId) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingId
            ? { ...product, ...productData }
            : product
        )
      );
    } else {
      setProducts((current) => [
        ...current,
        {
          ...productData,
          id: Date.now()
        }
      ]);
    }

    setModalOpen(false);
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  };

  return (
    <div className="inventory-page products-page">
      <div className="inventory-page-heading">
        <div>
          <div className="inventory-eyebrow">WORKSPACE / INVENTORY / PRODUCTS</div>
          <h1>Products</h1>
          <p>Manage your organisation's complete product catalogue.</p>
        </div>

        <button
          className="inventory-primary-button"
          onClick={openAddModal}
        >
          <Plus size={17} />
          Add product
        </button>
      </div>

      <div className="products-summary">
        <div>
          <span>Total products</span>
          <strong>{products.length}</strong>
        </div>
        <div>
          <span>Active products</span>
          <strong>{products.filter(p => p.status === "Active").length}</strong>
        </div>
        <div>
          <span>Inactive products</span>
          <strong>{products.filter(p => p.status === "Inactive").length}</strong>
        </div>
        <div>
          <span>Low stock</span>
          <strong>
            {products.filter(p => p.stock > 0 && p.stock <= p.reorderLevel).length}
          </strong>
        </div>
      </div>

      <section className="inventory-panel">
        <div className="products-toolbar">
          <div className="inventory-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search name, SKU, barcode or brand..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="products-filter">
            <Filter size={16} />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Archived">Archived</option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>

        <div className="inventory-table-wrapper">
          <table className="inventory-table products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU / Barcode</th>
                <th>Category</th>
                <th>Purchase price</th>
                <th>Selling price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="inventory-product-name">
                      <div className="product-placeholder-icon">
                        <Package size={17} />
                      </div>
                      <div>
                        <strong>{product.name}</strong>
                        <span className="product-subtitle">
                          {product.brand || "No brand"}
                          {product.strength ? ` · ${product.strength}` : ""}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <strong>{product.sku}</strong>
                    <span className="product-subtitle">
                      {product.barcode || "No barcode"}
                    </span>
                  </td>

                  <td>{product.category}</td>
                  <td>{money(product.purchasePrice)}</td>
                  <td>{money(product.sellingPrice)}</td>

                  <td>
                    <strong>{product.stock}</strong>
                    <span className="product-subtitle">
                      Reorder: {product.reorderLevel}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`inventory-status ${
                        product.status === "Active"
                          ? "in-stock"
                          : product.status === "Inactive"
                          ? "low-stock"
                          : "out-of-stock"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="product-edit-button"
                      onClick={() => openEditModal(product)}
                      title="Edit product"
                    >
                      <Edit3 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="8" className="inventory-empty-state">
                    <Package size={25} />
                    <strong>No products found</strong>
                    <span>Try another search or add a new product.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="inventory-table-footer">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </section>

      {modalOpen && (
        <div
          className="product-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <div
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
          >
            <div className="product-modal-header">
              <div>
                <h2 id="product-modal-title">
                  {editingId ? "Edit product" : "Add new product"}
                </h2>
                <p>Enter the product information below.</p>
              </div>

              <button
                className="product-modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="product-form-grid">
                <label className="product-form-field full">
                  Product name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Paracetamol"
                    required
                  />
                </label>

                <label className="product-form-field">
                  Product type
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option>General Product</option>
                    <option>Medicine</option>
                    <option>Medical Equipment</option>
                    <option>Consumable</option>
                    <option>Service</option>
                  </select>
                </label>

                <label className="product-form-field">
                  Category *
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Pain Relief"
                    required
                  />
                </label>

                <label className="product-form-field">
                  Brand / Manufacturer
                  <input
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    placeholder="Brand or manufacturer"
                  />
                </label>

                <label className="product-form-field">
                  Generic name
                  <input
                    name="genericName"
                    value={form.genericName}
                    onChange={handleChange}
                    placeholder="Optional"
                  />
                </label>

                <label className="product-form-field">
                  SKU *
                  <input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="Unique product code"
                    required
                  />
                </label>

                <label className="product-form-field">
                  Barcode
                  <div className="product-input-icon">
                    <Barcode size={16} />
                    <input
                      name="barcode"
                      value={form.barcode}
                      onChange={handleChange}
                      placeholder="Barcode number"
                    />
                  </div>
                </label>

                {form.type === "Medicine" && (
                  <>
                    <label className="product-form-field">
                      Strength
                      <input
                        name="strength"
                        value={form.strength}
                        onChange={handleChange}
                        placeholder="e.g. 500mg"
                      />
                    </label>

                    <label className="product-form-field">
                      Dosage form
                      <select
                        name="dosageForm"
                        value={form.dosageForm}
                        onChange={handleChange}
                      >
                        <option value="">Select form</option>
                        <option>Tablet</option>
                        <option>Capsule</option>
                        <option>Syrup</option>
                        <option>Injection</option>
                        <option>Cream</option>
                        <option>Ointment</option>
                        <option>Drops</option>
                        <option>Other</option>
                      </select>
                    </label>
                  </>
                )}

                <label className="product-form-field">
                  Purchase price (NGN)
                  <input
                    type="number"
                    name="purchasePrice"
                    min="0"
                    step="0.01"
                    value={form.purchasePrice}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </label>

                <label className="product-form-field">
                  Selling price (NGN)
                  <input
                    type="number"
                    name="sellingPrice"
                    min="0"
                    step="0.01"
                    value={form.sellingPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </label>

                <label className="product-form-field">
                  Reorder level
                  <input
                    type="number"
                    name="reorderLevel"
                    min="0"
                    value={form.reorderLevel}
                    onChange={handleChange}
                    placeholder="Minimum stock quantity"
                  />
                </label>

                <label className="product-form-field">
                  Status
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Archived</option>
                  </select>
                </label>
              </div>

              {error && <div className="product-form-error">{error}</div>}

              <div className="product-modal-actions">
                <button
                  type="button"
                  className="product-cancel-button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inventory-primary-button"
                >
                  {editingId ? "Save changes" : "Create product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
