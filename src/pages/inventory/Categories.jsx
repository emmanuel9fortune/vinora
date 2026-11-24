
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  FolderOpen,
  Package,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Layers3,
  AlertCircle,
} from "lucide-react";
import "../../styles/inventory.css";

const initialCategories = [
  {
    id: 1,
    name: "Pain Relief",
    description: "Medicines used for pain relief and fever management.",
    productCount: 42,
    status: "Active",
    createdAt: "12 Jan 2026",
  },
  {
    id: 2,
    name: "Antibiotics",
    description: "Antibacterial medicines and related treatments.",
    productCount: 68,
    status: "Active",
    createdAt: "14 Jan 2026",
  },
  {
    id: 3,
    name: "Vitamins & Supplements",
    description: "Vitamins, minerals and nutritional supplements.",
    productCount: 35,
    status: "Active",
    createdAt: "18 Jan 2026",
  },
  {
    id: 4,
    name: "Cardiovascular",
    description: "Medicines for heart and circulatory conditions.",
    productCount: 27,
    status: "Active",
    createdAt: "22 Jan 2026",
  },
  {
    id: 5,
    name: "Allergy & Respiratory",
    description: "Antihistamines, cough and respiratory medicines.",
    productCount: 31,
    status: "Active",
    createdAt: "25 Jan 2026",
  },
  {
    id: 6,
    name: "Diabetes Care",
    description: "Diabetes medicines and blood glucose management.",
    productCount: 19,
    status: "Active",
    createdAt: "02 Feb 2026",
  },
  {
    id: 7,
    name: "Personal Care",
    description: "Personal hygiene and everyday care products.",
    productCount: 24,
    status: "Inactive",
    createdAt: "06 Feb 2026",
  },
  {
    id: 8,
    name: "First Aid",
    description: "First aid supplies and basic medical essentials.",
    productCount: 0,
    status: "Active",
    createdAt: "10 Feb 2026",
  },
];

const emptyForm = {
  name: "",
  description: "",
  status: "Active",
};

function Categories() {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [menuId, setMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState("");

  const activeCount = categories.filter(
    (category) => category.status === "Active"
  ).length;

  const inactiveCount = categories.filter(
    (category) => category.status === "Inactive"
  ).length;

  const totalProducts = categories.reduce(
    (total, category) => total + category.productCount,
    0
  );

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const searchMatch =
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        category.description.toLowerCase().includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "All" || category.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [categories, search, statusFilter]);

  const openAddModal = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
    setMenuId(null);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description,
      status: category.status,
    });
    setFormError("");
    setModalOpen(true);
    setMenuId(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setForm(emptyForm);
    setFormError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = form.name.trim();

    if (!trimmedName) {
      setFormError("Please enter a category name.");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        category.name.toLowerCase() === trimmedName.toLowerCase() &&
        category.id !== editingCategory?.id
    );

    if (duplicate) {
      setFormError("A category with this name already exists.");
      return;
    }

    if (editingCategory) {
      setCategories((previous) =>
        previous.map((category) =>
          category.id === editingCategory.id
            ? {
                ...category,
                name: trimmedName,
                description: form.description.trim(),
                status: form.status,
              }
            : category
        )
      );

      setNotice("Category updated successfully.");
    } else {
      const newCategory = {
        id: Date.now(),
        name: trimmedName,
        description: form.description.trim(),
        productCount: 0,
        status: form.status,
        createdAt: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };

      setCategories((previous) => [newCategory, ...previous]);
      setNotice("Category created successfully.");
    }

    closeModal();
    setTimeout(() => setNotice(""), 3000);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.productCount > 0) {
      setNotice(
        "This category cannot be deleted because products are assigned to it."
      );
      setDeleteTarget(null);
      setTimeout(() => setNotice(""), 4000);
      return;
    }

    setCategories((previous) =>
      previous.filter((category) => category.id !== deleteTarget.id)
    );

    setDeleteTarget(null);
    setNotice("Category deleted successfully.");
    setTimeout(() => setNotice(""), 3000);
  };

  return (
    <div className="categories-page">
      <div className="categories-header">
        <div>
          <div className="categories-breadcrumb">
            Inventory <span>/</span> Categories
          </div>

          <h1>Product Categories</h1>
          <p>
            Organise your products into categories to make inventory
            management easier.
          </p>
        </div>

        <button className="categories-primary-btn" onClick={openAddModal}>
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {notice && (
        <div className="categories-notice">
          <AlertCircle size={18} />
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="Dismiss notice">
            <X size={17} />
          </button>
        </div>
      )}

      <div className="categories-stats">
        <div className="categories-stat-card">
          <div className="categories-stat-icon purple">
            <FolderOpen size={21} />
          </div>
          <div>
            <span>Total Categories</span>
            <h2>{categories.length}</h2>
            <small>All product categories</small>
          </div>
        </div>

        <div className="categories-stat-card">
          <div className="categories-stat-icon green">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <span>Active Categories</span>
            <h2>{activeCount}</h2>
            <small>Currently available</small>
          </div>
        </div>

        <div className="categories-stat-card">
          <div className="categories-stat-icon orange">
            <XCircle size={21} />
          </div>
          <div>
            <span>Inactive Categories</span>
            <h2>{inactiveCount}</h2>
            <small>Not currently active</small>
          </div>
        </div>

        <div className="categories-stat-card">
          <div className="categories-stat-icon blue">
            <Package size={21} />
          </div>
          <div>
            <span>Products Categorised</span>
            <h2>{totalProducts.toLocaleString()}</h2>
            <small>Across all categories</small>
          </div>
        </div>
      </div>

      <section className="categories-content-card">
        <div className="categories-section-heading">
          <div>
            <h2>All Categories</h2>
            <p>Manage and organise your product categories.</p>
          </div>

          <span className="categories-count">
            {filteredCategories.length} categories
          </span>
        </div>

        <div className="categories-toolbar">
          <div className="categories-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="categories-table-wrapper">
          <table className="categories-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Products</th>
                <th>Date Created</th>
                <th>Status</th>
                <th className="categories-action-heading">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <div className="categories-name-cell">
                      <div className="categories-row-icon">
                        <Layers3 size={18} />
                      </div>
                      <strong>{category.name}</strong>
                    </div>
                  </td>

                  <td>
                    <span className="categories-description">
                      {category.description || "No description provided"}
                    </span>
                  </td>

                  <td>
                    <span className="categories-product-count">
                      {category.productCount}
                    </span>
                  </td>

                  <td>{category.createdAt}</td>

                  <td>
                    <span
                      className={`categories-status ${
                        category.status === "Active" ? "active" : "inactive"
                      }`}
                    >
                      <span />
                      {category.status}
                    </span>
                  </td>

                  <td className="categories-action-cell">
                    <div className="categories-menu-container">
                      <button
                        className="categories-menu-trigger"
                        onClick={() =>
                          setMenuId(
                            menuId === category.id ? null : category.id
                          )
                        }
                        aria-label={`Actions for ${category.name}`}
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      {menuId === category.id && (
                        <div className="categories-dropdown">
                          <button onClick={() => openEditModal(category)}>
                            <Pencil size={15} />
                            Edit category
                          </button>

                          <button
                            className="delete"
                            onClick={() => {
                              setDeleteTarget(category);
                              setMenuId(null);
                            }}
                          >
                            <Trash2 size={15} />
                            Delete category
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <div className="categories-empty-state">
                      <FolderOpen size={30} />
                      <strong>No categories found</strong>
                      <span>
                        Try changing your search or status filter.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && (
        <div className="categories-modal-overlay" onMouseDown={closeModal}>
          <div
            className="categories-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="categories-modal-header">
              <div>
                <h2>
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                <p>
                  {editingCategory
                    ? "Update the details of this category."
                    : "Create a category to organise your products."}
                </p>
              </div>

              <button onClick={closeModal} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="categories-form-group">
                <label htmlFor="category-name">
                  Category Name <span>*</span>
                </label>
                <input
                  id="category-name"
                  type="text"
                  placeholder="e.g. Pain Relief"
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  autoFocus
                />
              </div>

              <div className="categories-form-group">
                <label htmlFor="category-description">Description</label>
                <textarea
                  id="category-description"
                  rows="4"
                  placeholder="Describe the products that belong to this category..."
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                />
              </div>

              <div className="categories-form-group">
                <label htmlFor="category-status">Status</label>
                <select
                  id="category-status"
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {formError && (
                <div className="categories-form-error">
                  <AlertCircle size={16} />
                  {formError}
                </div>
              )}

              <div className="categories-modal-actions">
                <button
                  type="button"
                  className="categories-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="categories-primary-btn">
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="categories-modal-overlay"
          onMouseDown={() => setDeleteTarget(null)}
        >
          <div
            className="categories-delete-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="categories-delete-icon">
              <Trash2 size={23} />
            </div>

            <h2>Delete Category?</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.name}</strong>? This action cannot be
              undone.
            </p>

            {deleteTarget.productCount > 0 && (
              <div className="categories-delete-warning">
                This category has {deleteTarget.productCount} assigned
                products. It cannot be deleted until those products are
                reassigned.
              </div>
            )}

            <div className="categories-modal-actions">
              <button
                className="categories-cancel-btn"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                className="categories-delete-btn"
                onClick={handleDelete}
                disabled={deleteTarget.productCount > 0}
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;
