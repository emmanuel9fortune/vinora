import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Boxes,
  AlertTriangle,
  CircleOff,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ChevronRight,
  CalendarClock,
  Activity,
  ClipboardList,
} from "lucide-react";

import "../../styles/inventory.css";

const products = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    sku: "MED-0001",
    stock: 450,
    reorderLevel: 100,
    price: 1200,
    status: "In stock",
  },
  {
    id: 2,
    name: "Amoxicillin 500mg",
    category: "Antibiotics",
    sku: "MED-0002",
    stock: 35,
    reorderLevel: 100,
    price: 3500,
    status: "Low stock",
  },
  {
    id: 3,
    name: "Vitamin C 1000mg",
    category: "Vitamins",
    sku: "MED-0003",
    stock: 280,
    reorderLevel: 80,
    price: 2500,
    status: "In stock",
  },
  {
    id: 4,
    name: "Cetirizine 10mg",
    category: "Allergy",
    sku: "MED-0004",
    stock: 0,
    reorderLevel: 50,
    price: 1800,
    status: "Out of stock",
  },
  {
    id: 5,
    name: "Metformin 500mg",
    category: "Diabetes",
    sku: "MED-0005",
    stock: 22,
    reorderLevel: 60,
    price: 2200,
    status: "Low stock",
  },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

function InventoryStat({ title, value, description, icon: Icon, trend, tone }) {
  return (
    <article className="inventory-stat-card">
      <div className="inventory-stat-top">
        <span>{title}</span>
        <div className={`inventory-stat-icon ${tone}`}>
          <Icon size={19} />
        </div>
      </div>

      <h2>{value}</h2>

      <div className="inventory-stat-footer">
        {trend && (
          <span className={`inventory-trend ${trend.direction}`}>
            {trend.direction === "up" ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {trend.label}
          </span>
        )}
        <span>{description}</span>
      </div>
    </article>
  );
}

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        activeFilter === "All" || product.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  return (
    <div className="inventory-page">
      <div className="inventory-page-heading">
        <div>
          <div className="inventory-eyebrow">WORKSPACE / INVENTORY</div>
          <h1>Inventory</h1>
          <p>Monitor products, stock availability and inventory activity.</p>
        </div>

        <Link to="/inventory/products" className="inventory-primary-button">
          <Plus size={17} />
          Add product
        </Link>
      </div>

      <div className="inventory-stats-grid">
        <InventoryStat
          title="Total products"
          value="2,450"
          description="Active products"
          icon={Package}
          trend={{ direction: "up", label: "8.2%" }}
          tone="blue"
        />

        <InventoryStat
          title="Stock valuation"
          value="₦18.5M"
          description="Estimated inventory value"
          icon={Boxes}
          trend={{ direction: "up", label: "4.6%" }}
          tone="green"
        />

        <InventoryStat
          title="Low stock"
          value="38"
          description="Below reorder level"
          icon={AlertTriangle}
          tone="orange"
        />

        <InventoryStat
          title="Out of stock"
          value="12"
          description="Products unavailable"
          icon={CircleOff}
          tone="red"
        />
      </div>

      <div className="inventory-shortcuts">
        <Link to="/inventory/products" className="inventory-shortcut">
          <div className="shortcut-icon blue">
            <Package size={19} />
          </div>
          <div>
            <strong>Products</strong>
            <span>Manage your product catalogue</span>
          </div>
          <ChevronRight size={17} />
        </Link>

        <Link to="/inventory/batches" className="inventory-shortcut">
          <div className="shortcut-icon purple">
            <Boxes size={19} />
          </div>
          <div>
            <strong>Stock batches</strong>
            <span>Track batch quantities and costs</span>
          </div>
          <ChevronRight size={17} />
        </Link>

        <Link to="/inventory/movements" className="inventory-shortcut">
          <div className="shortcut-icon green">
            <Activity size={19} />
          </div>
          <div>
            <strong>Stock movements</strong>
            <span>Review every stock event</span>
          </div>
          <ChevronRight size={17} />
        </Link>

        <Link to="/inventory/expiry" className="inventory-shortcut">
          <div className="shortcut-icon orange">
            <CalendarClock size={19} />
          </div>
          <div>
            <strong>Expiry management</strong>
            <span>Monitor products nearing expiry</span>
          </div>
          <ChevronRight size={17} />
        </Link>
      </div>

      <section className="inventory-panel">
        <div className="inventory-panel-heading">
          <div>
            <h2>Product overview</h2>
            <p>A quick look at products and their current stock levels.</p>
          </div>

          <Link to="/inventory/products" className="inventory-view-all">
            View all products <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="inventory-table-toolbar">
          <div className="inventory-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search product, SKU or category..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="inventory-filter-group">
            {["All", "In stock", "Low stock", "Out of stock"].map((filter) => (
              <button
                key={filter}
                type="button"
                className={activeFilter === filter ? "active" : ""}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Selling price</th>
                <th>Status</th>
                <th></th>
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
                      <strong>{product.name}</strong>
                    </div>
                  </td>
                  <td>{product.sku}</td>
                  <td>{product.category}</td>
                  <td>
                    <strong>{product.stock}</strong>
                    <span className="inventory-unit"> units</span>
                  </td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>
                    <span
                      className={`inventory-status ${product.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="inventory-more-button"
                      type="button"
                      aria-label={`More options for ${product.name}`}
                      title="More options"
                    >
                      <MoreHorizontal size={19} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="7" className="inventory-empty-state">
                    <ClipboardList size={25} />
                    <strong>No products found</strong>
                    <span>Try another search or stock filter.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="inventory-table-footer">
          Showing {filteredProducts.length} of {products.length} sample products
        </div>
      </section>

      <div className="inventory-notice">
        <AlertTriangle size={18} />
        <div>
          <strong>Inventory data is currently illustrative</strong>
          <p>
            These figures are sample frontend data. Actual stock quantities,
            batch costs and stock valuation will come from the backend.
          </p>
        </div>
      </div>
    </div>
  );
}