
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Users,
  UserCheck,
  Wallet,
  CreditCard,
  Eye,
  Pencil,
  X,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  CheckCircle2,
  XCircle,
  UserRound,
  Building2,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import "../../styles/customers.css";
import { Link } from "react-router-dom";

const initialCustomers = [
  {
    id: "CUS-0001",
    name: "John Adebayo",
    type: "Individual",
    phone: "0803 456 7890",
    email: "john.adebayo@example.com",
    address: "Ikeja, Lagos",
    totalPurchases: 485000,
    outstanding: 25000,
    creditLimit: 100000,
    creditEnabled: true,
    status: "Active",
    joined: "2026-02-12",
    notes: "Regular customer",
  },
  {
    id: "CUS-0002",
    name: "Grace Okafor",
    type: "Individual",
    phone: "0806 234 5678",
    email: "grace.okafor@example.com",
    address: "Surulere, Lagos",
    totalPurchases: 215000,
    outstanding: 0,
    creditLimit: 0,
    creditEnabled: false,
    status: "Active",
    joined: "2026-03-04",
    notes: "",
  },
  {
    id: "CUS-0003",
    name: "Wellness Family Clinic",
    type: "Business",
    phone: "0809 876 5432",
    email: "accounts@wellnessclinic.com",
    address: "Yaba, Lagos",
    totalPurchases: 1850000,
    outstanding: 185000,
    creditLimit: 300000,
    creditEnabled: true,
    status: "Active",
    joined: "2026-01-18",
    notes: "Monthly supply arrangement",
  },
  {
    id: "CUS-0004",
    name: "Michael Eze",
    type: "Individual",
    phone: "0812 345 6789",
    email: "michael.eze@example.com",
    address: "Maryland, Lagos",
    totalPurchases: 92000,
    outstanding: 12000,
    creditLimit: 50000,
    creditEnabled: true,
    status: "Active",
    joined: "2026-04-21",
    notes: "",
  },
  {
    id: "CUS-0005",
    name: "Prime Health Centre",
    type: "Business",
    phone: "0703 456 7891",
    email: "admin@primehealth.com",
    address: "Ogba, Lagos",
    totalPurchases: 960000,
    outstanding: 0,
    creditLimit: 200000,
    creditEnabled: true,
    status: "Active",
    joined: "2026-05-09",
    notes: "Approved business customer",
  },
  {
    id: "CUS-0006",
    name: "Esther Williams",
    type: "Individual",
    phone: "0902 111 2233",
    email: "esther.williams@example.com",
    address: "Gbagada, Lagos",
    totalPurchases: 67000,
    outstanding: 0,
    creditLimit: 0,
    creditEnabled: false,
    status: "Inactive",
    joined: "2026-06-15",
    notes: "",
  },
];

const emptyForm = {
  name: "",
  type: "Individual",
  phone: "",
  email: "",
  address: "",
  creditEnabled: false,
  creditLimit: "",
  notes: "",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function Customers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [creditFilter, setCreditFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const stats = useMemo(() => {
    const active = customers.filter((customer) => customer.status === "Active");
    const creditCustomers = active.filter((customer) => customer.creditEnabled);

    return {
      total: customers.length,
      active: active.length,
      creditCustomers: creditCustomers.length,
      outstanding: customers.reduce(
        (total, customer) => total + customer.outstanding,
        0
      ),
      totalPurchases: customers.reduce(
        (total, customer) => total + customer.totalPurchases,
        0
      ),
    };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        !query ||
        customer.name.toLowerCase().includes(query) ||
        customer.id.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || customer.status === statusFilter;

      const matchesType =
        typeFilter === "All" || customer.type === typeFilter;

      const matchesCredit =
        creditFilter === "All" ||
        (creditFilter === "Enabled" && customer.creditEnabled) ||
        (creditFilter === "Disabled" && !customer.creditEnabled);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesCredit
      );
    });
  }, [customers, search, statusFilter, typeFilter, creditFilter]);

  const openAddForm = () => {
    setEditingCustomer(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (customer) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name,
      type: customer.type,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      creditEnabled: customer.creditEnabled,
      creditLimit: customer.creditLimit || "",
      notes: customer.notes || "",
    });
    setFormError("");
    setSelectedCustomer(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
    setForm(emptyForm);
    setFormError("");
  };

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.phone.trim()) {
      setFormError("Customer name and phone number are required.");
      return;
    }

    if (form.creditEnabled && Number(form.creditLimit) <= 0) {
      setFormError("Enter a valid credit limit for this customer.");
      return;
    }

    const normalizedEmail = form.email.trim().toLowerCase();

    const duplicate = customers.find(
      (customer) =>
        normalizedEmail &&
        customer.email.toLowerCase() === normalizedEmail &&
        customer.id !== editingCustomer?.id
    );

    if (duplicate) {
      setFormError("A customer with this email address already exists.");
      return;
    }

    const customerData = {
      name: form.name.trim(),
      type: form.type,
      phone: form.phone.trim(),
      email: normalizedEmail,
      address: form.address.trim(),
      creditEnabled: form.creditEnabled,
      creditLimit: form.creditEnabled ? Number(form.creditLimit) : 0,
      notes: form.notes.trim(),
    };

    if (editingCustomer) {
      setCustomers((previous) =>
        previous.map((customer) =>
          customer.id === editingCustomer.id
            ? { ...customer, ...customerData }
            : customer
        )
      );
    } else {
      const newCustomer = {
        ...customerData,
        id: `CUS-${String(Date.now()).slice(-6)}`,
        totalPurchases: 0,
        outstanding: 0,
        status: "Active",
        joined: new Date().toISOString().slice(0, 10),
      };

      setCustomers((previous) => [newCustomer, ...previous]);
    }

    closeForm();
  };

  const toggleStatus = (customer) => {
    setCustomers((previous) =>
      previous.map((item) =>
        item.id === customer.id
          ? {
              ...item,
              status: item.status === "Active" ? "Inactive" : "Active",
            }
          : item
      )
    );

    setSelectedCustomer(null);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setTypeFilter("All");
    setCreditFilter("All");
  };

  return (
    <div className="customers-page">
      <div className="customers-page-header">
        <div>
          <div className="customers-breadcrumb">
            <span>Management</span>
            <span>/</span>
            <strong>Customers</strong>
          </div>

          <h1>Customers</h1>
          <p>
            Manage customer records, purchase activity and credit accounts.
          </p>
        </div>

        
        <div className="customers-header-actions">
            <Link
              to="/customers/payments"
              className="customers-payments-link"
            >
              <Wallet size={17} />
              Payments & Debts
            </Link>

            <Link
              to="/customers/credit"
              className="customers-credit-link"
            >
              <ShieldCheck size={17} />
              Credit Management
            </Link>

            <button
              className="customers-primary-btn"
              onClick={openAddForm}
            >
              <Plus size={17} />
              Add Customer
            </button>
          </div>

      </div>

      <div className="customers-stats-grid">
        <div className="customers-stat-card">
          <div className="customers-stat-top">
            <div className="customers-stat-icon customers-icon-blue">
              <Users size={20} />
            </div>
            <span className="customers-stat-caption">Customer directory</span>
          </div>
          <h2>{stats.total.toLocaleString()}</h2>
          <p>Total customers registered</p>
        </div>

        <div className="customers-stat-card">
          <div className="customers-stat-top">
            <div className="customers-stat-icon customers-icon-green">
              <UserCheck size={20} />
            </div>
            <span className="customers-stat-caption">Currently available</span>
          </div>
          <h2>{stats.active.toLocaleString()}</h2>
          <p>Active customer accounts</p>
        </div>

        <div className="customers-stat-card">
          <div className="customers-stat-top">
            <div className="customers-stat-icon customers-icon-purple">
              <CreditCard size={20} />
            </div>
            <span className="customers-stat-caption">Credit accounts</span>
          </div>
          <h2>{stats.creditCustomers.toLocaleString()}</h2>
          <p>Customers enabled for credit</p>
        </div>

        <div className="customers-stat-card">
          <div className="customers-stat-top">
            <div className="customers-stat-icon customers-icon-orange">
              <Wallet size={20} />
            </div>
            <span className="customers-stat-caption">Unpaid customer balances</span>
          </div>
          <h2>{formatCurrency(stats.outstanding)}</h2>
          <p>Total outstanding credit</p>
        </div>
      </div>

      <div className="customers-summary-strip">
        <div className="customers-summary-info">
          <div className="customers-summary-icon">
            <ShoppingBag size={19} />
          </div>
          <div>
            <span>Total customer purchases</span>
            <strong>{formatCurrency(stats.totalPurchases)}</strong>
          </div>
        </div>

        <div className="customers-summary-note">
          <ArrowUpRight size={17} />
          <span>Lifetime purchase value across all customer records</span>
        </div>
      </div>

      <div className="customers-table-card">
        <div className="customers-table-heading">
          <div>
            <h2>Customer Directory</h2>
            <p>View and manage your registered customers.</p>
          </div>
          <span className="customers-record-count">
            {filteredCustomers.length} records
          </span>
        </div>

        <div className="customers-toolbar">
          <div className="customers-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search name, ID, phone or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="customers-filters">
            <div className="customers-filter-control">
              <Filter size={15} />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <select
              className="customers-select-filter"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Individual">Individual</option>
              <option value="Business">Business</option>
            </select>

            <select
              className="customers-select-filter"
              value={creditFilter}
              onChange={(event) => setCreditFilter(event.target.value)}
            >
              <option value="All">All Credit Accounts</option>
              <option value="Enabled">Credit Enabled</option>
              <option value="Disabled">Credit Disabled</option>
            </select>

            {(search ||
              statusFilter !== "All" ||
              typeFilter !== "All" ||
              creditFilter !== "All") && (
              <button
                className="customers-clear-filter"
                onClick={clearFilters}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="customers-table-wrapper">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Type</th>
                <th>Total Purchases</th>
                <th>Outstanding</th>
                <th>Credit Limit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="customers-name-cell">
                      <div
                        className={`customers-avatar ${
                          customer.type === "Business"
                            ? "business-avatar"
                            : ""
                        }`}
                      >
                        {customer.type === "Business" ? (
                          <Building2 size={18} />
                        ) : (
                          <UserRound size={18} />
                        )}
                      </div>
                      <div>
                        <strong>{customer.name}</strong>
                        <span>{customer.id}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="customers-contact-cell">
                      <span>
                        <Phone size={13} />
                        {customer.phone}
                      </span>
                      <span>
                        <Mail size={13} />
                        {customer.email || "No email"}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`customers-type-badge ${
                        customer.type === "Business"
                          ? "business-type"
                          : "individual-type"
                      }`}
                    >
                      {customer.type}
                    </span>
                  </td>

                  <td className="customers-money-cell">
                    {formatCurrency(customer.totalPurchases)}
                  </td>

                  <td>
                    <span
                      className={`customers-outstanding ${
                        customer.outstanding > 0 ? "has-outstanding" : ""
                      }`}
                    >
                      {formatCurrency(customer.outstanding)}
                    </span>
                  </td>

                  <td>
                    {customer.creditEnabled
                      ? formatCurrency(customer.creditLimit)
                      : <span className="customers-muted">Not enabled</span>}
                  </td>

                  <td>
                    <span
                      className={`customers-status ${
                        customer.status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      <span />
                      {customer.status}
                    </span>
                  </td>

                  <td>
                    <div className="customers-row-actions">
                      <Link
                        title="View customer"
                        to={`/customers/${customer.id}`}
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        title="Edit customer"
                        onClick={() => openEditForm(customer)}
                      >
                        <Pencil size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="8">
                    <div className="customers-empty-state">
                      <Users size={30} />
                      <strong>No customers found</strong>
                      <span>
                        Try changing your search or filter settings.
                      </span>
                      <button onClick={clearFilters}>Clear filters</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="customers-table-footer">
          <span>
            Showing {filteredCustomers.length} of {customers.length} customers
          </span>
          <span>Customer records are organisation-specific.</span>
        </div>
      </div>

      {showForm && (
        <div className="customers-modal-overlay" onClick={closeForm}>
          <div
            className="customers-modal customers-form-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="customers-modal-header">
              <div>
                <h2>{editingCustomer ? "Edit Customer" : "Add New Customer"}</h2>
                <p>
                  {editingCustomer
                    ? "Update the customer's information."
                    : "Enter the details to create a customer account."}
                </p>
              </div>
              <button className="customers-modal-close" onClick={closeForm}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="customers-form-body">
                <div className="customers-form-section">
                  <h3>Basic Information</h3>

                  <div className="customers-form-grid">
                    <label className="customers-field full-field">
                      Customer Name *
                      <input
                        value={form.name}
                        onChange={(event) =>
                          updateForm("name", event.target.value)
                        }
                        placeholder="Enter customer or business name"
                        required
                      />
                    </label>

                    <label className="customers-field">
                      Customer Type
                      <select
                        value={form.type}
                        onChange={(event) =>
                          updateForm("type", event.target.value)
                        }
                      >
                        <option value="Individual">Individual</option>
                        <option value="Business">Business</option>
                      </select>
                    </label>

                    <label className="customers-field">
                      Phone Number *
                      <input
                        value={form.phone}
                        onChange={(event) =>
                          updateForm("phone", event.target.value)
                        }
                        placeholder="0800 000 0000"
                        required
                      />
                    </label>

                    <label className="customers-field">
                      Email Address
                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                          updateForm("email", event.target.value)
                        }
                        placeholder="customer@example.com"
                      />
                    </label>

                    <label className="customers-field">
                      Address
                      <input
                        value={form.address}
                        onChange={(event) =>
                          updateForm("address", event.target.value)
                        }
                        placeholder="Customer address"
                      />
                    </label>
                  </div>
                </div>

                <div className="customers-form-section">
                  <h3>Customer Credit</h3>

                  <label className="customers-credit-toggle">
                    <div>
                      <strong>Enable credit purchases</strong>
                      <span>
                        Allow authorised staff to record sales on credit for
                        this customer.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={form.creditEnabled}
                      onChange={(event) =>
                        updateForm("creditEnabled", event.target.checked)
                      }
                    />
                  </label>

                  {form.creditEnabled && (
                    <label className="customers-field customers-credit-limit-field">
                      Credit Limit (₦) *
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={form.creditLimit}
                        onChange={(event) =>
                          updateForm("creditLimit", event.target.value)
                        }
                        placeholder="e.g. 100000"
                        required
                      />
                      <small>
                        The maximum outstanding balance permitted for this
                        customer.
                      </small>
                    </label>
                  )}
                </div>

                <div className="customers-form-section">
                  <h3>Additional Information</h3>
                  <label className="customers-field">
                    Notes
                    <textarea
                      rows="3"
                      value={form.notes}
                      onChange={(event) =>
                        updateForm("notes", event.target.value)
                      }
                      placeholder="Add any useful information about this customer..."
                    />
                  </label>
                </div>

                {formError && (
                  <div className="customers-form-error">
                    <XCircle size={16} />
                    {formError}
                  </div>
                )}
              </div>

              <div className="customers-modal-footer">
                <button
                  type="button"
                  className="customers-secondary-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>
                <button type="submit" className="customers-primary-btn">
                  {editingCustomer ? "Save Changes" : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedCustomer && (
        <div
          className="customers-modal-overlay"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="customers-modal customers-detail-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="customers-modal-header">
              <div>
                <h2>Customer Details</h2>
                <p>Customer account information and summary.</p>
              </div>
              <button
                className="customers-modal-close"
                onClick={() => setSelectedCustomer(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="customers-detail-body">
              <div className="customers-detail-profile">
                <div className="customers-detail-avatar">
                  {selectedCustomer.type === "Business" ? (
                    <Building2 size={25} />
                  ) : (
                    <UserRound size={25} />
                  )}
                </div>
                <div>
                  <h3>{selectedCustomer.name}</h3>
                  <span>{selectedCustomer.id}</span>
                  <div>
                    <span
                      className={`customers-status ${
                        selectedCustomer.status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      <span />
                      {selectedCustomer.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="customers-detail-stats">
                <div>
                  <span>Total purchases</span>
                  <strong>
                    {formatCurrency(selectedCustomer.totalPurchases)}
                  </strong>
                </div>
                <div>
                  <span>Outstanding balance</span>
                  <strong className="detail-outstanding">
                    {formatCurrency(selectedCustomer.outstanding)}
                  </strong>
                </div>
              </div>

              <div className="customers-detail-section">
                <h3>Contact Information</h3>
                <div className="customers-detail-info">
                  <div>
                    <Phone size={16} />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                  <div>
                    <Mail size={16} />
                    <span>{selectedCustomer.email || "Not provided"}</span>
                  </div>
                  <div>
                    <MapPin size={16} />
                    <span>{selectedCustomer.address || "Not provided"}</span>
                  </div>
                  <div>
                    <CalendarDays size={16} />
                    <span>Joined {formatDate(selectedCustomer.joined)}</span>
                  </div>
                </div>
              </div>

              <div className="customers-detail-section">
                <h3>Credit Account</h3>
                <div className="customers-credit-detail">
                  <div>
                    <span>Credit access</span>
                    <strong>
                      {selectedCustomer.creditEnabled ? "Enabled" : "Disabled"}
                    </strong>
                  </div>
                  <div>
                    <span>Credit limit</span>
                    <strong>
                      {formatCurrency(selectedCustomer.creditLimit)}
                    </strong>
                  </div>
                  <div>
                    <span>Available credit</span>
                    <strong>
                      {formatCurrency(
                        Math.max(
                          0,
                          selectedCustomer.creditLimit -
                            selectedCustomer.outstanding
                        )
                      )}
                    </strong>
                  </div>
                </div>

                {selectedCustomer.creditEnabled &&
                  selectedCustomer.outstanding >
                    selectedCustomer.creditLimit && (
                    <div className="customers-credit-warning">
                      Outstanding balance exceeds the configured credit limit.
                    </div>
                  )}
              </div>

              {selectedCustomer.notes && (
                <div className="customers-detail-section">
                  <h3>Notes</h3>
                  <p className="customers-detail-notes">
                    {selectedCustomer.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="customers-modal-footer">
              <button
                className="customers-secondary-btn"
                onClick={() => toggleStatus(selectedCustomer)}
              >
                {selectedCustomer.status === "Active"
                  ? "Deactivate Customer"
                  : "Activate Customer"}
              </button>
              <button
                className="customers-primary-btn"
                onClick={() => openEditForm(selectedCustomer)}
              >
                <Pencil size={15} />
                Edit Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
