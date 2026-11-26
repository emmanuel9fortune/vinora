
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  X,
  BookOpen,
  Wallet,
  TrendingUp,
  TrendingDown,
  Landmark,
} from "lucide-react";
import "../../styles/finance.css"

const initialAccounts = [
  { id: "1000", name: "Cash on Hand", type: "Asset", category: "Current Asset", balance: 1710000, description: "Physical cash held by the business", status: "Active", system: true },
  { id: "1010", name: "Bank Accounts", type: "Asset", category: "Current Asset", balance: 11130000, description: "Balances held in business bank accounts", status: "Active", system: true },
  { id: "1100", name: "Accounts Receivable", type: "Asset", category: "Current Asset", balance: 2450000, description: "Amounts owed by customers", status: "Active", system: true },
  { id: "1200", name: "Inventory", type: "Asset", category: "Current Asset", balance: 8750000, description: "Value of available inventory", status: "Active", system: true },
  { id: "1500", name: "Equipment", type: "Asset", category: "Fixed Asset", balance: 3200000, description: "Business equipment and fixtures", status: "Active", system: false },
  { id: "2000", name: "Accounts Payable", type: "Liability", category: "Current Liability", balance: 1850000, description: "Amounts owed to suppliers", status: "Active", system: true },
  { id: "2100", name: "Tax Payable", type: "Liability", category: "Current Liability", balance: 420000, description: "Tax liabilities payable", status: "Active", system: false },
  { id: "3000", name: "Owner's Equity", type: "Equity", category: "Equity", balance: 15000000, description: "Owner investment in the business", status: "Active", system: true },
  { id: "4000", name: "Sales Revenue", type: "Income", category: "Operating Income", balance: 18500000, description: "Revenue from sales", status: "Active", system: true },
  { id: "4100", name: "Other Income", type: "Income", category: "Other Income", balance: 250000, description: "Income from other business activities", status: "Active", system: false },
  { id: "5000", name: "Cost of Goods Sold", type: "Expense", category: "Cost of Sales", balance: 11200000, description: "Cost of inventory sold", status: "Active", system: true },
  { id: "6000", name: "Rent Expense", type: "Expense", category: "Operating Expense", balance: 1200000, description: "Business premises rent", status: "Active", system: false },
  { id: "6100", name: "Utilities Expense", type: "Expense", category: "Operating Expense", balance: 285000, description: "Electricity, water and utilities", status: "Active", system: false },
  { id: "6200", name: "Staff Salaries", type: "Expense", category: "Operating Expense", balance: 2100000, description: "Staff wages and salaries", status: "Active", system: false },
];

const accountTypes = ["Asset", "Liability", "Equity", "Income", "Expense"];

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const emptyForm = {
  id: "",
  name: "",
  type: "Asset",
  category: "Current Asset",
  description: "",
};

const categoriesByType = {
  Asset: ["Current Asset", "Fixed Asset", "Other Asset"],
  Liability: ["Current Liability", "Long-term Liability", "Other Liability"],
  Equity: ["Equity"],
  Income: ["Operating Income", "Other Income"],
  Expense: ["Cost of Sales", "Operating Expense", "Other Expense"],
};

export default function ChartOfAccounts() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const activeAccounts = accounts.filter((account) => account.status === "Active");

  const summary = accountTypes.map((type) => ({
    type,
    count: activeAccounts.filter((account) => account.type === type).length,
  }));

  const filteredAccounts = useMemo(() => {
    const term = search.toLowerCase().trim();

    return accounts.filter((account) => {
      const matchesSearch =
        account.name.toLowerCase().includes(term) ||
        account.id.toLowerCase().includes(term) ||
        account.category.toLowerCase().includes(term);

      const matchesType = typeFilter === "All" || account.type === typeFilter;
      const matchesStatus = statusFilter === "All" || account.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [accounts, search, typeFilter, statusFilter]);

  const openCreateModal = () => {
    setEditingAccount(null);
    setForm(emptyForm);
    setError("");
    setModal("form");
  };

  const openEditModal = (account) => {
    setEditingAccount(account);
    setForm({
      id: account.id,
      name: account.name,
      type: account.type,
      category: account.category,
      description: account.description || "",
    });
    setError("");
    setModal("form");
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => {
      const updated = { ...current, [name]: value };

      if (name === "type") {
        updated.category = categoriesByType[value][0];
      }

      return updated;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const code = form.id.trim();
    const name = form.name.trim();

    if (!code || !name) {
      setError("Enter both an account code and account name.");
      return;
    }

    const duplicateCode = accounts.some(
      (account) =>
        account.id.toLowerCase() === code.toLowerCase() &&
        account.id !== editingAccount?.id
    );

    if (duplicateCode) {
      setError("This account code already exists.");
      return;
    }

    if (editingAccount) {
      if (editingAccount.system) {
        setError("System accounts cannot be edited in this demo.");
        return;
      }

      setAccounts((current) =>
        current.map((account) =>
          account.id === editingAccount.id
            ? {
                ...account,
                name,
                type: form.type,
                category: form.category,
                description: form.description.trim(),
              }
            : account
        )
      );
    } else {
      setAccounts((current) => [
        {
          id: code,
          name,
          type: form.type,
          category: form.category,
          balance: 0,
          description: form.description.trim(),
          status: "Active",
          system: false,
        },
        ...current,
      ]);
    }

    setModal("");
  };

  const closeModal = () => {
    setModal("");
    setSelectedAccount(null);
    setError("");
  };

  const toggleStatus = (account) => {
    if (account.system) return;

    const nextStatus = account.status === "Active" ? "Inactive" : "Active";

    setAccounts((current) =>
      current.map((item) =>
        item.id === account.id ? { ...item, status: nextStatus } : item
      )
    );
  };

  return (
    <div className="chart-of-accounts-page">
      <header className="chart-of-accounts-header">
        <div>
          <div className="chart-of-accounts-breadcrumb">
            Finance <span>/</span> Chart of Accounts
          </div>
          <h1>Chart of Accounts</h1>
          <p>Organise and manage the accounts used in your financial records.</p>
        </div>

        <button className="coa-primary-btn" onClick={openCreateModal}>
          <Plus size={18} />
          Add Account
        </button>
      </header>

      <section className="coa-summary-grid">
        {summary.map((item) => (
          <div className="coa-summary-card" key={item.type}>
            <span className={`coa-summary-icon ${item.type.toLowerCase()}`}>
              {item.type === "Asset" && <Wallet size={19} />}
              {item.type === "Liability" && <Landmark size={19} />}
              {item.type === "Equity" && <BookOpen size={19} />}
              {item.type === "Income" && <TrendingUp size={19} />}
              {item.type === "Expense" && <TrendingDown size={19} />}
            </span>
            <div>
              <span>{item.type}</span>
              <strong>{item.count} accounts</strong>
            </div>
          </div>
        ))}
      </section>

      <section className="coa-content-card">
        <div className="coa-content-heading">
          <div>
            <h2>All Accounts</h2>
            <p>Account codes, classifications and current demo balances.</p>
          </div>
          <span className="coa-count">{filteredAccounts.length} accounts</span>
        </div>

        <div className="coa-toolbar">
          <div className="coa-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search account code or name..."
            />
          </div>

          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="All">All account types</option>
            {accountTypes.map((type) => (
              <option value={type} key={type}>{type}</option>
            ))}
          </select>

          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="coa-table-wrap">
          <table className="coa-table">
            <thead>
              <tr>
                <th>Account Code</th>
                <th>Account Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.id}>
                  <td className="coa-code">{account.id}</td>
                  <td>
                    <div className="coa-account-name">
                      <strong>{account.name}</strong>
                      {account.system && <span>System</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`coa-type ${account.type.toLowerCase()}`}>
                      {account.type}
                    </span>
                  </td>
                  <td className="coa-category">{account.category}</td>
                  <td className="coa-balance">{formatMoney(account.balance)}</td>
                  <td>
                    <span className={`coa-status ${account.status.toLowerCase()}`}>
                      <i />
                      {account.status}
                    </span>
                  </td>
                  <td>
                    <div className="coa-actions">
                      <button
                        title="View account"
                        onClick={() => {
                          setSelectedAccount(account);
                          setModal("details");
                        }}
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        title={account.system ? "System account" : "Edit account"}
                        disabled={account.system}
                        onClick={() => openEditModal(account)}
                      >
                        <Pencil size={17} />
                      </button>
                      {!account.system && (
                        <button
                          title={account.status === "Active" ? "Deactivate" : "Activate"}
                          onClick={() => toggleStatus(account)}
                        >
                          {account.status === "Active" ? "Disable" : "Enable"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAccounts.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="coa-empty">
                      <BookOpen size={28} />
                      <strong>No accounts found</strong>
                      <span>Try changing your search or filters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="coa-table-footer">
          Showing {filteredAccounts.length} of {accounts.length} accounts
        </div>
      </section>

      {modal === "form" && (
        <div className="coa-overlay" onClick={closeModal}>
          <div className="coa-modal" onClick={(event) => event.stopPropagation()}>
            <div className="coa-modal-header">
              <div>
                <h2>{editingAccount ? "Edit Account" : "Add Account"}</h2>
                <p>Create an account classification for your organisation.</p>
              </div>
              <button className="coa-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="coa-form-grid">
                <label>
                  Account Code *
                  <input
                    name="id"
                    value={form.id}
                    onChange={handleFormChange}
                    placeholder="e.g. 6300"
                    disabled={Boolean(editingAccount)}
                    required
                  />
                </label>

                <label>
                  Account Name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="e.g. Internet Expense"
                    required
                  />
                </label>

                <label>
                  Account Type *
                  <select name="type" value={form.type} onChange={handleFormChange}>
                    {accountTypes.map((type) => (
                      <option value={type} key={type}>{type}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Category *
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                  >
                    {categoriesByType[form.type].map((category) => (
                      <option value={category} key={category}>{category}</option>
                    ))}
                  </select>
                </label>

                <label className="coa-form-full">
                  Description
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    rows="3"
                    placeholder="Optional account description"
                  />
                </label>
              </div>

              {error && <div className="coa-error">{error}</div>}

              <div className="coa-modal-footer">
                <button type="button" className="coa-secondary-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="coa-primary-btn">
                  {editingAccount ? "Save Changes" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === "details" && selectedAccount && (
        <div className="coa-overlay" onClick={closeModal}>
          <div className="coa-modal coa-details-modal" onClick={(event) => event.stopPropagation()}>
            <div className="coa-modal-header">
              <div>
                <h2>Account Details</h2>
                <p>Account code: {selectedAccount.id}</p>
              </div>
              <button className="coa-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="coa-details-body">
              <div className="coa-detail-main">
                <span className={`coa-summary-icon ${selectedAccount.type.toLowerCase()}`}>
                  <BookOpen size={20} />
                </span>
                <div>
                  <strong>{selectedAccount.name}</strong>
                  <span>{selectedAccount.category}</span>
                </div>
              </div>

              <div className="coa-detail-balance">
                <span>Current Demo Balance</span>
                <strong>{formatMoney(selectedAccount.balance)}</strong>
              </div>

              <div className="coa-detail-grid">
                <div>
                  <span>Account Type</span>
                  <strong>{selectedAccount.type}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{selectedAccount.status}</strong>
                </div>
                <div className="full">
                  <span>Description</span>
                  <strong>{selectedAccount.description || "No description provided"}</strong>
                </div>
              </div>

              {selectedAccount.system && (
                <div className="coa-system-note">
                  This is a system account. Its structure is protected to preserve
                  accounting consistency.
                </div>
              )}
            </div>

            <div className="coa-modal-footer">
              <button className="coa-secondary-btn" onClick={closeModal}>
                Close
              </button>
              {!selectedAccount.system && (
                <button
                  className="coa-primary-btn"
                  onClick={() => openEditModal(selectedAccount)}
                >
                  <Pencil size={16} />
                  Edit Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
