
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  X,
  Building2,
  Users,
  Wallet,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import "../../styles/suppliers.css";
import { Link } from "react-router-dom";

const initialSuppliers = [
  {
    id: "SUP-0001",
    name: "MedPlus Distribution Ltd",
    contactPerson: "Michael Adekunle",
    email: "orders@medplusdistribution.com",
    phone: "0803 456 7890",
    address: "12 Broad Street, Lagos Island, Lagos",
    category: "Pharmaceutical Distributor",
    paymentTerms: "30 Days",
    creditLimit: 500000,
    outstanding: 185000,
    totalPurchases: 2450000,
    status: "Active",
    notes: "Main supplier for general medicines and essential products.",
    dateAdded: "2026-08-12",
  },
  {
    id: "SUP-0002",
    name: "HealthBridge Pharmaceuticals",
    contactPerson: "Grace Okafor",
    email: "sales@healthbridge.com.ng",
    phone: "0805 222 3344",
    address: "45 Allen Avenue, Ikeja, Lagos",
    category: "Pharmaceutical Distributor",
    paymentTerms: "14 Days",
    creditLimit: 300000,
    outstanding: 92000,
    totalPurchases: 1380000,
    status: "Active",
    notes: "Supplies antibiotics and prescription medicines.",
    dateAdded: "2026-08-19",
  },
  {
    id: "SUP-0003",
    name: "PrimeCare Medical Supplies",
    contactPerson: "David Eze",
    email: "info@primecaremedical.ng",
    phone: "0806 555 7788",
    address: "8 Medical Road, Yaba, Lagos",
    category: "Medical Supplies",
    paymentTerms: "30 Days",
    creditLimit: 750000,
    outstanding: 0,
    totalPurchases: 890000,
    status: "Active",
    notes: "Supplies medical consumables and healthcare accessories.",
    dateAdded: "2026-09-02",
  },
  {
    id: "SUP-0004",
    name: "Wellness Pharma Nigeria",
    contactPerson: "Sarah Ibrahim",
    email: "orders@wellnesspharma.ng",
    phone: "0807 111 2233",
    address: "21 Opebi Road, Ikeja, Lagos",
    category: "Pharmaceutical Distributor",
    paymentTerms: "7 Days",
    creditLimit: 200000,
    outstanding: 145000,
    totalPurchases: 760000,
    status: "Active",
    notes: "Supplies vitamins, supplements and wellness products.",
    dateAdded: "2026-09-15",
  },
  {
    id: "SUP-0005",
    name: "Crestview Healthcare Ltd",
    contactPerson: "John Williams",
    email: "contact@crestviewhealthcare.ng",
    phone: "0809 444 5566",
    address: "17 Marina Road, Lagos Island, Lagos",
    category: "Medical Supplies",
    paymentTerms: "Cash Before Delivery",
    creditLimit: 0,
    outstanding: 0,
    totalPurchases: 420000,
    status: "Inactive",
    notes: "Supplier currently not being used.",
    dateAdded: "2026-10-01",
  },
];

const emptyForm = {
  name: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
  category: "",
  paymentTerms: "30 Days",
  creditLimit: "",
  notes: "",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function Suppliers() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const activeSuppliers = suppliers.filter(
    (supplier) => supplier.status === "Active"
  ).length;

  const outstandingBalance = suppliers.reduce(
    (total, supplier) => total + supplier.outstanding,
    0
  );

  const overdueSuppliers = suppliers.filter(
    (supplier) => supplier.outstanding > 100000 && supplier.status === "Active"
  ).length;

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const query = search.toLowerCase();

      const matchesSearch = [
        supplier.id,
        supplier.name,
        supplier.contactPerson,
        supplier.email,
        supplier.phone,
        supplier.category,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

      const matchesStatus =
        statusFilter === "All" || supplier.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [suppliers, search, statusFilter]);

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingSupplier(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (supplier) => {
    setEditingSupplier(supplier);
    setForm({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      category: supplier.category,
      paymentTerms: supplier.paymentTerms,
      creditLimit: String(supplier.creditLimit),
      notes: supplier.notes,
    });
    setShowForm(true);
  };

  const saveSupplier = (event) => {
    event.preventDefault();

    const normalizedEmail = form.email.trim().toLowerCase();

    const duplicate = suppliers.some(
      (supplier) =>
        supplier.email.toLowerCase() === normalizedEmail &&
        supplier.id !== editingSupplier?.id
    );

    if (duplicate) {
      alert("A supplier with this email address already exists.");
      return;
    }

    const supplierData = {
      ...form,
      name: form.name.trim(),
      email: normalizedEmail,
      phone: form.phone.trim(),
      contactPerson: form.contactPerson.trim(),
      address: form.address.trim(),
      creditLimit: Number(form.creditLimit || 0),
    };

    if (editingSupplier) {
      setSuppliers((previous) =>
        previous.map((supplier) =>
          supplier.id === editingSupplier.id
            ? { ...supplier, ...supplierData }
            : supplier
        )
      );

      setSelectedSupplier((previous) =>
        previous?.id === editingSupplier.id
          ? { ...previous, ...supplierData }
          : previous
      );
    } else {
      const newSupplier = {
        ...supplierData,
        id: `SUP-${String(suppliers.length + 1).padStart(4, "0")}`,
        outstanding: 0,
        totalPurchases: 0,
        status: "Active",
        dateAdded: new Date().toISOString().slice(0, 10),
      };

      setSuppliers((previous) => [newSupplier, ...previous]);
    }

    setShowForm(false);
    setEditingSupplier(null);
    setForm(emptyForm);
  };

  const toggleSupplierStatus = (supplier) => {
    const nextStatus = supplier.status === "Active" ? "Inactive" : "Active";

    setSuppliers((previous) =>
      previous.map((item) =>
        item.id === supplier.id ? { ...item, status: nextStatus } : item
      )
    );

    setSelectedSupplier((previous) =>
      previous?.id === supplier.id
        ? { ...previous, status: nextStatus }
        : previous
    );
  };

  const openDetails = (supplier) => {
    setSelectedSupplier(supplier);
    setShowDetails(true);
  };

  return (
    <div className="suppliers-page">
      <div className="suppliers-header">
        <div>
          <div className="suppliers-breadcrumb">
            Business Management <span>/</span> Suppliers
          </div>
          <h1>Suppliers</h1>
          <p>
            Manage supplier relationships, contact information and balances.
          </p>
        </div>

        <button className="suppliers-primary-btn" onClick={openCreateForm}>
          <Plus size={18} />
          Add Supplier
        </button>
      </div>

      <div className="suppliers-stats-grid">
        <div className="suppliers-stat-card">
          <div className="suppliers-stat-top">
            <span>Total Suppliers</span>
            <span className="suppliers-stat-icon blue">
              <Building2 size={19} />
            </span>
          </div>
          <h2>{suppliers.length}</h2>
          <small>Registered suppliers</small>
        </div>

        <div className="suppliers-stat-card">
          <div className="suppliers-stat-top">
            <span>Active Suppliers</span>
            <span className="suppliers-stat-icon green">
              <Users size={19} />
            </span>
          </div>
          <h2>{activeSuppliers}</h2>
          <small>Currently available for purchasing</small>
        </div>

        <div className="suppliers-stat-card">
          <div className="suppliers-stat-top">
            <span>Outstanding Payables</span>
            <span className="suppliers-stat-icon purple">
              <Wallet size={19} />
            </span>
          </div>
          <h2 className="suppliers-stat-money">
            {formatCurrency(outstandingBalance)}
          </h2>
          <small>Total supplier balances</small>
        </div>

        <div className="suppliers-stat-card">
          <div className="suppliers-stat-top">
            <span>High Outstanding</span>
            <span className="suppliers-stat-icon orange">
              <AlertTriangle size={19} />
            </span>
          </div>
          <h2>{overdueSuppliers}</h2>
          <small>Suppliers with balances above ₦100,000</small>
        </div>
      </div>

      <section className="suppliers-directory-card">
        <div className="suppliers-directory-heading">
          <div>
            <h2>Supplier Directory</h2>
            <p>View and manage all your registered suppliers.</p>
          </div>
          <span className="suppliers-record-count">
            {filteredSuppliers.length} suppliers
          </span>
        </div>

        <div className="suppliers-toolbar">
          <div className="suppliers-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search name, supplier ID, email or contact..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="suppliers-filter">
            <Filter size={17} />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All suppliers</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown size={15} />
          </div>
        </div>

        <div className="suppliers-table-wrapper">
          <table className="suppliers-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Contact Person</th>
                <th>Phone / Email</th>
                <th>Payment Terms</th>
                <th>Outstanding</th>
                <th>Total Purchases</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>
                    <div className="supplier-name-cell">
                      <div className="supplier-avatar">
                        {supplier.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{supplier.name}</strong>
                        <small>{supplier.id}</small>
                      </div>
                    </div>
                  </td>

                  <td>{supplier.contactPerson}</td>

                  <td>
                    <div className="supplier-contact-cell">
                      <span>{supplier.phone}</span>
                      <small>{supplier.email}</small>
                    </div>
                  </td>

                  <td>{supplier.paymentTerms}</td>

                  <td className="supplier-balance">
                    {formatCurrency(supplier.outstanding)}
                  </td>

                  <td>{formatCurrency(supplier.totalPurchases)}</td>

                  <td>
                    <span
                      className={`supplier-status ${
                        supplier.status === "Active" ? "active" : "inactive"
                      }`}
                    >
                      {supplier.status}
                    </span>
                  </td>

                  <td>
                    <div className="supplier-row-actions">
                      <Link
                        to={`/suppliers/${supplier.id}`}
                        title="View supplier"
                        >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() => openEditForm(supplier)}
                        title="Edit supplier"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSuppliers.length === 0 && (
                <tr>
                  <td colSpan="8" className="suppliers-empty">
                    <Building2 size={28} />
                    <strong>No suppliers found</strong>
                    <span>Try another search or add a new supplier.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add / Edit Supplier */}
      {showForm && (
        <div
          className="suppliers-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowForm(false);
          }}
        >
          <div className="suppliers-modal">
            <div className="suppliers-modal-header">
              <div>
                <h2>
                  {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
                </h2>
                <p>
                  {editingSupplier
                    ? "Update supplier information."
                    : "Enter the supplier's business and contact details."}
                </p>
              </div>
              <button onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveSupplier}>
              <div className="suppliers-form-grid">
                <label className="supplier-form-full">
                  Supplier / Business Name *
                  <input
                    value={form.name}
                    onChange={(event) => updateForm("name", event.target.value)}
                    placeholder="Enter registered business name"
                    required
                  />
                </label>

                <label>
                  Contact Person *
                  <input
                    value={form.contactPerson}
                    onChange={(event) =>
                      updateForm("contactPerson", event.target.value)
                    }
                    placeholder="Full name"
                    required
                  />
                </label>

                <label>
                  Phone Number *
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => updateForm("phone", event.target.value)}
                    placeholder="080XXXXXXXX"
                    required
                  />
                </label>

                <label className="supplier-form-full">
                  Email Address *
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateForm("email", event.target.value)}
                    placeholder="supplier@example.com"
                    required
                  />
                </label>

                <label className="supplier-form-full">
                  Business Address *
                  <textarea
                    rows="2"
                    value={form.address}
                    onChange={(event) =>
                      updateForm("address", event.target.value)
                    }
                    placeholder="Enter full business address"
                    required
                  />
                </label>

                <label>
                  Supplier Category *
                  <select
                    value={form.category}
                    onChange={(event) =>
                      updateForm("category", event.target.value)
                    }
                    required
                  >
                    <option value="">Select category</option>
                    <option>Pharmaceutical Distributor</option>
                    <option>Medical Supplies</option>
                    <option>Manufacturer</option>
                    <option>Wholesaler</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  Payment Terms *
                  <select
                    value={form.paymentTerms}
                    onChange={(event) =>
                      updateForm("paymentTerms", event.target.value)
                    }
                    required
                  >
                    <option>Cash Before Delivery</option>
                    <option>7 Days</option>
                    <option>14 Days</option>
                    <option>30 Days</option>
                    <option>45 Days</option>
                    <option>60 Days</option>
                  </select>
                </label>

                <label className="supplier-form-full">
                  Credit Limit (₦)
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.creditLimit}
                    onChange={(event) =>
                      updateForm("creditLimit", event.target.value)
                    }
                    placeholder="Enter supplier credit limit"
                  />
                </label>

                <label className="supplier-form-full">
                  Internal Notes
                  <textarea
                    rows="3"
                    value={form.notes}
                    onChange={(event) => updateForm("notes", event.target.value)}
                    placeholder="Additional information about this supplier..."
                  />
                </label>
              </div>

              <div className="suppliers-modal-actions">
                <button
                  type="button"
                  className="suppliers-secondary-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="suppliers-primary-btn">
                  {editingSupplier ? "Save Changes" : "Add Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Details */}
      {showDetails && selectedSupplier && (
        <div
          className="suppliers-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowDetails(false);
          }}
        >
          <div className="suppliers-modal suppliers-detail-modal">
            <div className="suppliers-modal-header">
              <div>
                <h2>Supplier Details</h2>
                <p>{selectedSupplier.id}</p>
              </div>
              <button onClick={() => setShowDetails(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="supplier-profile-heading">
              <div className="supplier-profile-avatar">
                {selectedSupplier.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>{selectedSupplier.name}</h3>
                <span
                  className={`supplier-status ${
                    selectedSupplier.status === "Active"
                      ? "active"
                      : "inactive"
                  }`}
                >
                  {selectedSupplier.status}
                </span>
              </div>
            </div>

            <div className="supplier-profile-stats">
              <div>
                <small>Outstanding Balance</small>
                <strong>{formatCurrency(selectedSupplier.outstanding)}</strong>
              </div>
              <div>
                <small>Total Purchases</small>
                <strong>{formatCurrency(selectedSupplier.totalPurchases)}</strong>
              </div>
              <div>
                <small>Credit Limit</small>
                <strong>{formatCurrency(selectedSupplier.creditLimit)}</strong>
              </div>
            </div>

            <div className="supplier-detail-section">
              <h4>Contact Information</h4>
              <div className="supplier-detail-line">
                <Users size={16} />
                <span>{selectedSupplier.contactPerson}</span>
              </div>
              <div className="supplier-detail-line">
                <Phone size={16} />
                <span>{selectedSupplier.phone}</span>
              </div>
              <div className="supplier-detail-line">
                <Mail size={16} />
                <span>{selectedSupplier.email}</span>
              </div>
              <div className="supplier-detail-line">
                <MapPin size={16} />
                <span>{selectedSupplier.address}</span>
              </div>
            </div>

            <div className="supplier-detail-section">
              <h4>Business Information</h4>
              <div className="supplier-detail-grid">
                <div>
                  <small>Category</small>
                  <strong>{selectedSupplier.category}</strong>
                </div>
                <div>
                  <small>Payment Terms</small>
                  <strong>{selectedSupplier.paymentTerms}</strong>
                </div>
                <div>
                  <small>Date Added</small>
                  <strong>{formatDate(selectedSupplier.dateAdded)}</strong>
                </div>
                <div>
                  <small>Supplier ID</small>
                  <strong>{selectedSupplier.id}</strong>
                </div>
              </div>
            </div>

            <div className="supplier-detail-notes">
              <small>Internal Notes</small>
              <p>{selectedSupplier.notes || "No notes recorded."}</p>
            </div>

            <div className="suppliers-modal-actions">
              <button
                className="suppliers-secondary-btn"
                onClick={() => setShowDetails(false)}
              >
                Close
              </button>
              <button
                className="suppliers-secondary-btn"
                onClick={() => toggleSupplierStatus(selectedSupplier)}
              >
                {selectedSupplier.status === "Active"
                  ? "Deactivate Supplier"
                  : "Activate Supplier"}
              </button>
              <button
                className="suppliers-primary-btn"
                onClick={() => {
                  setShowDetails(false);
                  openEditForm(selectedSupplier);
                }}
              >
                <Pencil size={15} /> Edit Supplier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Suppliers;
