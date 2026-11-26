
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Search,
  ShieldCheck,
  Users,
  UserCheck,
  UserX,
  Eye,
  Pencil,
  X,
  KeyRound,
} from "lucide-react";
import "../../styles/staff.css";

const initialStaff = [
  {
    id: "STF-001",
    name: "Grace Okafor",
    email: "grace.okafor@example.com",
    phone: "0803 123 4567",
    role: "Pharmacist",
    branch: "Main Branch",
    status: "Active",
    joined: "2026-01-12",
  },
  {
    id: "STF-002",
    name: "David James",
    email: "david.james@example.com",
    phone: "0806 234 5678",
    role: "Manager",
    branch: "Main Branch",
    status: "Active",
    joined: "2026-02-05",
  },
  {
    id: "STF-003",
    name: "Mary Bello",
    email: "mary.bello@example.com",
    phone: "0805 345 6789",
    role: "Cashier",
    branch: "Main Branch",
    status: "Active",
    joined: "2026-03-18",
  },
  {
    id: "STF-004",
    name: "Peter Musa",
    email: "peter.musa@example.com",
    phone: "0807 456 7890",
    role: "Storekeeper",
    branch: "Main Branch",
    status: "Inactive",
    joined: "2026-04-02",
  },
  {
    id: "STF-005",
    name: "Faith Adeyemi",
    email: "faith.adeyemi@example.com",
    phone: "0802 567 8901",
    role: "Accountant",
    branch: "Main Branch",
    status: "Active",
    joined: "2026-05-10",
  },
];

const roles = [
  "Organisation Admin",
  "Manager",
  "Pharmacist",
  "Cashier",
  "Storekeeper",
  "Accountant",
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  role: "Cashier",
  branch: "Main Branch",
};

export default function Staff() {
  const [staff, setStaff] = useState(initialStaff);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [viewStaff, setViewStaff] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const activeCount = staff.filter((item) => item.status === "Active").length;
  const inactiveCount = staff.filter((item) => item.status === "Inactive").length;

  const filteredStaff = useMemo(() => {
    return staff.filter((item) => {
      const text = search.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(text) ||
        item.email.toLowerCase().includes(text) ||
        item.id.toLowerCase().includes(text) ||
        item.phone.includes(search);

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      const matchesRole = roleFilter === "all" || item.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [staff, search, statusFilter, roleFilter]);

  const openAddModal = () => {
    setEditingStaff(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingStaff(member);
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      branch: member.branch,
    });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingStaff(null);
    setForm(emptyForm);
    setFormError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setFormError("Please complete the required fields.");
      return;
    }

    const emailExists = staff.some(
      (item) =>
        item.email.toLowerCase() === form.email.trim().toLowerCase() &&
        item.id !== editingStaff?.id
    );

    if (emailExists) {
      setFormError("A staff member with this email already exists.");
      return;
    }

    if (editingStaff) {
      setStaff((current) =>
        current.map((item) =>
          item.id === editingStaff.id
            ? { ...item, ...form, name: form.name.trim(), email: form.email.trim() }
            : item
        )
      );
    } else {
      const newStaff = {
        ...form,
        id: `STF-${String(staff.length + 1).padStart(3, "0")}`,
        name: form.name.trim(),
        email: form.email.trim(),
        status: "Active",
        joined: new Date().toISOString().slice(0, 10),
      };

      setStaff((current) => [newStaff, ...current]);
    }

    closeModal();
  };

  const toggleStatus = (member) => {
    const nextStatus = member.status === "Active" ? "Inactive" : "Active";

    setStaff((current) =>
      current.map((item) =>
        item.id === member.id ? { ...item, status: nextStatus } : item
      )
    );
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="staff-page">
      <div className="staff-page-header">
        <div>
          <div className="staff-breadcrumb">
            <span>Organisation</span>
            <span>/</span>
            <span>Staff</span>
          </div>
          <h1>Staff & Team</h1>
          <p>Manage your team members, roles, and access to Vinora.</p>
        </div>

        <div className="staff-header-actions">
          <Link to="/staff/roles" className="staff-secondary-btn">
            <ShieldCheck size={17} />
            Roles & Permissions
          </Link>

          <button
            type="button"
            className="staff-primary-btn"
            onClick={openAddModal}
          >
            <UserPlus size={17} />
            Add Staff
          </button>
        </div>
      </div>

      <div className="staff-stats-grid">
        <div className="staff-stat-card">
          <div className="staff-stat-icon staff-icon-blue">
            <Users size={20} />
          </div>
          <div>
            <span>Total staff</span>
            <strong>{staff.length}</strong>
          </div>
        </div>

        <div className="staff-stat-card">
          <div className="staff-stat-icon staff-icon-green">
            <UserCheck size={20} />
          </div>
          <div>
            <span>Active staff</span>
            <strong>{activeCount}</strong>
          </div>
        </div>

        <div className="staff-stat-card">
          <div className="staff-stat-icon staff-icon-orange">
            <UserX size={20} />
          </div>
          <div>
            <span>Inactive staff</span>
            <strong>{inactiveCount}</strong>
          </div>
        </div>

        <div className="staff-stat-card">
          <div className="staff-stat-icon staff-icon-purple">
            <KeyRound size={20} />
          </div>
          <div>
            <span>Assigned roles</span>
            <strong>{new Set(staff.map((item) => item.role)).size}</strong>
          </div>
        </div>
      </div>

      <section className="staff-table-card">
        <div className="staff-table-heading">
          <div>
            <h2>Staff directory</h2>
            <p>View and manage staff accounts in this organisation.</p>
          </div>
        </div>

        <div className="staff-toolbar">
          <div className="staff-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, phone or staff ID..."
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            aria-label="Filter by role"
          >
            <option value="all">All roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="staff-table-wrap">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Staff member</th>
                <th>Staff ID</th>
                <th>Role</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="staff-person-cell">
                      <div className="staff-avatar">{getInitials(member.name)}</div>
                      <div className="staff-person-info">
                        <strong>{member.name}</strong>
                        <span>{member.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="staff-id-cell">{member.id}</td>
                  <td><span className="staff-role-pill">{member.role}</span></td>
                  <td>{member.branch}</td>
                  <td>
                    <span className={`staff-status-pill ${member.status.toLowerCase()}`}>
                      <span />
                      {member.status}
                    </span>
                  </td>
                  <td>
                    {new Date(`${member.joined}T00:00:00`).toLocaleDateString("en-NG", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <div className="staff-row-actions">
                      <button
                        type="button"
                        title="View staff"
                        onClick={() => setViewStaff(member)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        title="Edit staff"
                        onClick={() => openEditModal(member)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        title={member.status === "Active" ? "Deactivate staff" : "Activate staff"}
                        onClick={() => toggleStatus(member)}
                      >
                        {member.status === "Active" ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="staff-empty-state">
                      <Users size={28} />
                      <strong>No staff found</strong>
                      <span>Try adjusting your search or filters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="staff-table-footer">
          Showing {filteredStaff.length} of {staff.length} staff members
        </div>
      </section>

      {modalOpen && (
        <div className="staff-modal-overlay" onClick={closeModal}>
          <div className="staff-modal" onClick={(event) => event.stopPropagation()}>
            <div className="staff-modal-header">
              <div>
                <h2>{editingStaff ? "Edit staff member" : "Add staff member"}</h2>
                <p>Enter the staff member's details and assign a role.</p>
              </div>
              <button type="button" className="staff-modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="staff-form-grid">
                <label>
                  Full name *
                  <input
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Enter full name"
                  />
                </label>

                <label>
                  Email address *
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    placeholder="name@example.com"
                  />
                </label>

                <label>
                  Phone number *
                  <input
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    placeholder="0800 000 0000"
                  />
                </label>

                <label>
                  Role *
                  <select
                    value={form.role}
                    onChange={(event) => setForm({ ...form, role: event.target.value })}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </label>

                <label className="staff-form-full">
                  Branch
                  <input
                    value={form.branch}
                    onChange={(event) => setForm({ ...form, branch: event.target.value })}
                    placeholder="Branch name"
                  />
                </label>
              </div>

              {formError && <div className="staff-form-error">{formError}</div>}

              <div className="staff-modal-footer">
                <button type="button" className="staff-cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="staff-primary-btn">
                  {editingStaff ? "Save changes" : "Add staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewStaff && (
        <div className="staff-modal-overlay" onClick={() => setViewStaff(null)}>
          <div className="staff-modal staff-view-modal" onClick={(event) => event.stopPropagation()}>
            <div className="staff-modal-header">
              <div>
                <h2>Staff profile</h2>
                <p>Staff account information</p>
              </div>
              <button type="button" className="staff-modal-close" onClick={() => setViewStaff(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="staff-profile-summary">
              <div className="staff-avatar staff-avatar-large">{getInitials(viewStaff.name)}</div>
              <div>
                <strong>{viewStaff.name}</strong>
                <span>{viewStaff.role}</span>
                <span className={`staff-status-pill ${viewStaff.status.toLowerCase()}`}>
                  <span />
                  {viewStaff.status}
                </span>
              </div>
            </div>

            <div className="staff-profile-details">
              <div><span>Staff ID</span><strong>{viewStaff.id}</strong></div>
              <div><span>Email</span><strong>{viewStaff.email}</strong></div>
              <div><span>Phone</span><strong>{viewStaff.phone}</strong></div>
              <div><span>Branch</span><strong>{viewStaff.branch}</strong></div>
              <div><span>Date joined</span><strong>{viewStaff.joined}</strong></div>
            </div>

            <div className="staff-modal-footer">
              <button type="button" className="staff-cancel-btn" onClick={() => setViewStaff(null)}>
                Close
              </button>
              <button
                type="button"
                className="staff-primary-btn"
                onClick={() => {
                  setViewStaff(null);
                  openEditModal(viewStaff);
                }}
              >
                <Pencil size={16} />
                Edit staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
