
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  RotateCcw,
  ShoppingCart,
  Truck,
  Wallet,
  Users,
} from "lucide-react";
import "../../styles/suppliers.css";

const suppliersData = {
  "SUP-0001": {
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
    dateAdded: "2026-08-12",
    notes: "Main supplier for general medicines and essential products.",
  },
  "SUP-0002": {
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
    dateAdded: "2026-08-19",
    notes: "Supplies antibiotics and prescription medicines.",
  },
  "SUP-0003": {
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
    dateAdded: "2026-09-02",
    notes: "Supplies medical consumables and healthcare accessories.",
  },
  "SUP-0004": {
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
    dateAdded: "2026-09-15",
    notes: "Supplies vitamins, supplements and wellness products.",
  },
  "SUP-0005": {
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
    dateAdded: "2026-10-01",
    notes: "Supplier currently not being used.",
  },
};

const accountTransactions = [
  {
    id: "INV-2026-0024",
    date: "2026-11-21",
    type: "Invoice",
    reference: "INV-2026-0024",
    description: "Paracetamol and general medicines",
    debit: 120000,
    credit: 0,
    status: "Partially Paid",
  },
  {
    id: "PAY-2026-0018",
    date: "2026-11-22",
    type: "Payment",
    reference: "PAY-2026-0018",
    description: "Bank transfer payment",
    debit: 0,
    credit: 50000,
    status: "Completed",
  },
  {
    id: "INV-2026-0019",
    date: "2026-11-15",
    type: "Invoice",
    reference: "INV-2026-0019",
    description: "Antibiotics supply",
    debit: 80000,
    credit: 0,
    status: "Unpaid",
  },
  {
    id: "RET-2026-0010",
    date: "2026-11-17",
    type: "Return",
    reference: "RET-2026-0010",
    description: "Returned damaged stock",
    debit: 0,
    credit: 16000,
    status: "Dispatched",
  },
  {
    id: "PAY-2026-0012",
    date: "2026-11-10",
    type: "Payment",
    reference: "PAY-2026-0012",
    description: "Settlement by bank transfer",
    debit: 0,
    credit: 75000,
    status: "Completed",
  },
];

const purchaseOrders = [
  {
    id: "PO-2026-0021",
    date: "2026-11-20",
    expected: "2026-11-26",
    items: 8,
    amount: 185000,
    status: "Approved",
  },
  {
    id: "PO-2026-0018",
    date: "2026-11-14",
    expected: "2026-11-18",
    items: 5,
    amount: 120000,
    status: "Received",
  },
  {
    id: "PO-2026-0012",
    date: "2026-11-02",
    expected: "2026-11-07",
    items: 6,
    amount: 95000,
    status: "Received",
  },
];

const invoices = [
  {
    id: "INV-2026-0024",
    date: "2026-11-21",
    dueDate: "2026-12-21",
    amount: 120000,
    paid: 50000,
    status: "Partially Paid",
  },
  {
    id: "INV-2026-0019",
    date: "2026-11-15",
    dueDate: "2026-12-15",
    amount: 80000,
    paid: 0,
    status: "Unpaid",
  },
  {
    id: "INV-2026-0014",
    date: "2026-10-25",
    dueDate: "2026-11-24",
    amount: 65000,
    paid: 65000,
    status: "Paid",
  },
];

const payments = [
  {
    id: "PAY-2026-0018",
    date: "2026-11-22",
    method: "Bank Transfer",
    reference: "TRF-928145",
    amount: 50000,
    status: "Completed",
  },
  {
    id: "PAY-2026-0012",
    date: "2026-11-10",
    method: "Bank Transfer",
    reference: "TRF-927110",
    amount: 75000,
    status: "Completed",
  },
  {
    id: "PAY-2026-0008",
    date: "2026-10-28",
    method: "POS Terminal",
    reference: "POS-100822",
    amount: 65000,
    status: "Completed",
  },
];

const returns = [
  {
    id: "RET-2026-0012",
    date: "2026-11-20",
    product: "Paracetamol 500mg",
    batch: "PCM-2026-014",
    quantity: 24,
    amount: 19200,
    status: "Pending Approval",
  },
  {
    id: "RET-2026-0010",
    date: "2026-11-17",
    product: "Vitamin C 1000mg",
    batch: "VTC-2026-003",
    quantity: 8,
    amount: 16000,
    status: "Dispatched",
  },
];

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

const statusClass = (status) => {
  if (["Paid", "Completed", "Received", "Dispatched"].includes(status)) {
    return "success";
  }
  if (["Approved", "Partially Paid"].includes(status)) return "info";
  if (["Overdue", "Unpaid", "Rejected"].includes(status)) return "danger";
  return "warning";
};

function SupplierDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");

  const supplier = suppliersData[id];

  const tabs = [
    "Overview",
    "Account Activity",
    "Purchase Orders",
    "Invoices",
    "Payments",
    "Returns",
  ];

  const accountSummary = useMemo(() => {
    const totalDebits = accountTransactions.reduce(
      (sum, item) => sum + item.debit,
      0
    );
    const totalCredits = accountTransactions.reduce(
      (sum, item) => sum + item.credit,
      0
    );

    return {
      totalDebits,
      totalCredits,
      calculatedBalance: totalDebits - totalCredits,
    };
  }, []);

  if (!supplier) {
    return (
      <div className="supplier-details-page">
        <div className="supplier-not-found">
          <Building2 size={35} />
          <h2>Supplier not found</h2>
          <p>The supplier record may have been removed or the ID is invalid.</p>
          <Link to="/suppliers" className="supplier-details-back-btn">
            <ArrowLeft size={17} /> Back to Suppliers
          </Link>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <>
      <div className="supplier-overview-grid">
        <section className="supplier-panel supplier-information-panel">
          <div className="supplier-panel-heading">
            <div>
              <h3>Supplier Information</h3>
              <p>Registered supplier and contact information.</p>
            </div>
          </div>

          <div className="supplier-info-list">
            <div>
              <span><Users size={16} /> Contact Person</span>
              <strong>{supplier.contactPerson}</strong>
            </div>
            <div>
              <span><Mail size={16} /> Email Address</span>
              <strong>{supplier.email}</strong>
            </div>
            <div>
              <span><Phone size={16} /> Phone Number</span>
              <strong>{supplier.phone}</strong>
            </div>
            <div>
              <span><MapPin size={16} /> Business Address</span>
              <strong>{supplier.address}</strong>
            </div>
            <div>
              <span><Building2 size={16} /> Supplier Category</span>
              <strong>{supplier.category}</strong>
            </div>
            <div>
              <span><CalendarDays size={16} /> Date Added</span>
              <strong>{formatDate(supplier.dateAdded)}</strong>
            </div>
          </div>
        </section>

        <section className="supplier-panel supplier-account-panel">
          <div className="supplier-panel-heading">
            <div>
              <h3>Account Summary</h3>
              <p>Supplier financial position.</p>
            </div>
          </div>

          <div className="supplier-account-balance">
            <span>Outstanding Balance</span>
            <strong>{formatCurrency(supplier.outstanding)}</strong>
            <small>Amount currently owed to this supplier</small>
          </div>

          <div className="supplier-credit-progress">
            <div>
              <span>Credit Limit Utilisation</span>
              <strong>
                {supplier.creditLimit > 0
                  ? `${Math.min(
                      100,
                      Math.round(
                        (supplier.outstanding / supplier.creditLimit) * 100
                      )
                    )}%`
                  : "No credit"}
              </strong>
            </div>
            <div className="supplier-progress-track">
              <div
                style={{
                  width: `${
                    supplier.creditLimit > 0
                      ? Math.min(
                          100,
                          (supplier.outstanding / supplier.creditLimit) * 100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
            <small>
              {formatCurrency(supplier.outstanding)} used of{" "}
              {formatCurrency(supplier.creditLimit)}
            </small>
          </div>

          <div className="supplier-account-meta">
            <div>
              <span>Payment Terms</span>
              <strong>{supplier.paymentTerms}</strong>
            </div>
            <div>
              <span>Total Purchases</span>
              <strong>{formatCurrency(supplier.totalPurchases)}</strong>
            </div>
          </div>
        </section>
      </div>

      <section className="supplier-panel supplier-recent-panel">
        <div className="supplier-panel-heading">
          <div>
            <h3>Recent Account Activity</h3>
            <p>Latest invoices, payments and supplier returns.</p>
          </div>
          <button onClick={() => setActiveTab("Account Activity")}>
            View all <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="supplier-activity-list">
          {accountTransactions.slice(0, 4).map((item) => (
            <div className="supplier-activity-row" key={item.id}>
              <div className={`supplier-activity-icon ${item.type.toLowerCase()}`}>
                {item.type === "Invoice" && <FileText size={17} />}
                {item.type === "Payment" && <Wallet size={17} />}
                {item.type === "Return" && <RotateCcw size={17} />}
              </div>
              <div className="supplier-activity-description">
                <strong>{item.description}</strong>
                <small>{item.reference} · {formatDate(item.date)}</small>
              </div>
              <div className="supplier-activity-amount">
                <strong className={item.debit > 0 ? "debit" : "credit"}>
                  {item.debit > 0 ? "+" : "-"}
                  {formatCurrency(item.debit || item.credit)}
                </strong>
                <small>{item.type}</small>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  const renderAccountActivity = () => (
    <section className="supplier-panel">
      <div className="supplier-panel-heading">
        <div>
          <h3>Supplier Account Activity</h3>
          <p>Financial transactions recorded against this supplier.</p>
        </div>
      </div>

      <div className="supplier-ledger-summary">
        <div>
          <small>Total Debits</small>
          <strong>{formatCurrency(accountSummary.totalDebits)}</strong>
        </div>
        <div>
          <small>Total Credits</small>
          <strong>{formatCurrency(accountSummary.totalCredits)}</strong>
        </div>
        <div>
          <small>Demo Ledger Balance</small>
          <strong>{formatCurrency(accountSummary.calculatedBalance)}</strong>
        </div>
      </div>

      <div className="supplier-table-wrap">
        <table className="supplier-history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Reference</th>
              <th>Type</th>
              <th>Description</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {accountTransactions.map((item) => (
              <tr key={item.id}>
                <td>{formatDate(item.date)}</td>
                <td><strong>{item.reference}</strong></td>
                <td>{item.type}</td>
                <td>{item.description}</td>
                <td>{item.debit ? formatCurrency(item.debit) : "—"}</td>
                <td>{item.credit ? formatCurrency(item.credit) : "—"}</td>
                <td>
                  <span className={`supplier-detail-status ${statusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderPurchaseOrders = () => (
    <section className="supplier-panel">
      <div className="supplier-panel-heading">
        <div>
          <h3>Purchase Orders</h3>
          <p>Purchase orders issued to this supplier.</p>
        </div>
        <Link to="/purchases/orders" className="supplier-small-action">
          <Plus size={15} /> New Order
        </Link>
      </div>
      <div className="supplier-table-wrap">
        <table className="supplier-history-table">
          <thead>
            <tr>
              <th>PO Reference</th>
              <th>Order Date</th>
              <th>Expected Delivery</th>
              <th>Items</th>
              <th>Order Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.id}</strong></td>
                <td>{formatDate(item.date)}</td>
                <td>{formatDate(item.expected)}</td>
                <td>{item.items}</td>
                <td>{formatCurrency(item.amount)}</td>
                <td>
                  <span className={`supplier-detail-status ${statusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderInvoices = () => (
    <section className="supplier-panel">
      <div className="supplier-panel-heading">
        <div>
          <h3>Supplier Invoices</h3>
          <p>Invoices and balances due to this supplier.</p>
        </div>
        <Link to="/purchases/invoices" className="supplier-small-action">
          <Plus size={15} /> Add Invoice
        </Link>
      </div>
      <div className="supplier-table-wrap">
        <table className="supplier-history-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Invoice Date</th>
              <th>Due Date</th>
              <th>Invoice Amount</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.id}</strong></td>
                <td>{formatDate(item.date)}</td>
                <td>{formatDate(item.dueDate)}</td>
                <td>{formatCurrency(item.amount)}</td>
                <td>{formatCurrency(item.paid)}</td>
                <td>{formatCurrency(item.amount - item.paid)}</td>
                <td>
                  <span className={`supplier-detail-status ${statusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderPayments = () => (
    <section className="supplier-panel">
      <div className="supplier-panel-heading">
        <div>
          <h3>Payment History</h3>
          <p>Payments made to this supplier.</p>
        </div>
        <Link to="/purchases/payments" className="supplier-small-action">
          <Plus size={15} /> Record Payment
        </Link>
      </div>
      <div className="supplier-table-wrap">
        <table className="supplier-history-table">
          <thead>
            <tr>
              <th>Payment Reference</th>
              <th>Date</th>
              <th>Method</th>
              <th>Transaction Reference</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.id}</strong></td>
                <td>{formatDate(item.date)}</td>
                <td>{item.method}</td>
                <td>{item.reference}</td>
                <td>{formatCurrency(item.amount)}</td>
                <td>
                  <span className={`supplier-detail-status ${statusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderReturns = () => (
    <section className="supplier-panel">
      <div className="supplier-panel-heading">
        <div>
          <h3>Purchase Returns</h3>
          <p>Stock returned to this supplier.</p>
        </div>
        <Link to="/purchases/returns" className="supplier-small-action">
          <Plus size={15} /> New Return
        </Link>
      </div>
      <div className="supplier-table-wrap">
        <table className="supplier-history-table">
          <thead>
            <tr>
              <th>Return Reference</th>
              <th>Date</th>
              <th>Product</th>
              <th>Batch</th>
              <th>Quantity</th>
              <th>Return Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.id}</strong></td>
                <td>{formatDate(item.date)}</td>
                <td>{item.product}</td>
                <td>{item.batch}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.amount)}</td>
                <td>
                  <span className={`supplier-detail-status ${statusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Account Activity":
        return renderAccountActivity();
      case "Purchase Orders":
        return renderPurchaseOrders();
      case "Invoices":
        return renderInvoices();
      case "Payments":
        return renderPayments();
      case "Returns":
        return renderReturns();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="supplier-details-page">
      <div className="supplier-details-topbar">
        <Link to="/suppliers" className="supplier-back-link">
          <ArrowLeft size={17} />
          Back to Suppliers
        </Link>
        <span className="supplier-id-label">{supplier.id}</span>
      </div>

      <section className="supplier-profile-card">
        <div className="supplier-profile-main">
          <div className="supplier-profile-mark">
            {supplier.name.charAt(0).toUpperCase()}
          </div>
          <div className="supplier-profile-title">
            <div className="supplier-profile-title-row">
              <h1>{supplier.name}</h1>
              <span className={`supplier-detail-status ${supplier.status === "Active" ? "success" : "neutral"}`}>
                {supplier.status}
              </span>
            </div>
            <p>{supplier.category}</p>
            <div className="supplier-profile-contact">
              <span><Mail size={14} /> {supplier.email}</span>
              <span><Phone size={14} /> {supplier.phone}</span>
              <span><MapPin size={14} /> {supplier.address}</span>
            </div>
          </div>
        </div>

        <div className="supplier-profile-actions">
          <Link to="/purchases/orders" className="supplier-small-action">
            <ShoppingCart size={16} /> Create Order
          </Link>
          <Link to="/purchases/payments" className="supplier-small-action">
            <Wallet size={16} /> Record Payment
          </Link>
          <Link to="/purchases/returns" className="supplier-small-action">
            <RotateCcw size={16} /> Create Return
          </Link>
        </div>
      </section>

      <div className="supplier-detail-stats">
        <div className="supplier-detail-stat">
          <span><Wallet size={17} /> Outstanding Balance</span>
          <strong>{formatCurrency(supplier.outstanding)}</strong>
          <small>Current payable balance</small>
        </div>
        <div className="supplier-detail-stat">
          <span><CreditCard size={17} /> Credit Limit</span>
          <strong>{formatCurrency(supplier.creditLimit)}</strong>
          <small>{supplier.paymentTerms} payment terms</small>
        </div>
        <div className="supplier-detail-stat">
          <span><ShoppingCart size={17} /> Total Purchases</span>
          <strong>{formatCurrency(supplier.totalPurchases)}</strong>
          <small>Recorded supplier purchases</small>
        </div>
        <div className="supplier-detail-stat">
          <span><Package size={17} /> Account Since</span>
          <strong>{formatDate(supplier.dateAdded)}</strong>
          <small>Supplier registration date</small>
        </div>
      </div>

      <div className="supplier-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="supplier-tab-content">
        {renderActiveTab()}
      </div>
    </div>
  );
}

export default SupplierDetails;
