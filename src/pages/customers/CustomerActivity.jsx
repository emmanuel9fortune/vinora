
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  ShoppingBag,
  Wallet,
  Receipt,
  CalendarDays,
  Eye,
  X,
  Download,
} from "lucide-react";
import "../../styles/customers.css";

const customers = {
  "CUS-0001": {
    name: "John Adebayo",
    phone: "0803 456 7890",
  },
  "CUS-0002": {
    name: "Wellness Family Clinic",
    phone: "0806 123 4567",
  },
  "CUS-0003": {
    name: "Michael Eze",
    phone: "0812 555 9087",
  },
  "CUS-0004": {
    name: "Grace Okafor",
    phone: "0701 234 5678",
  },
  "CUS-0005": {
    name: "Prime Health Centre",
    phone: "0809 777 3210",
  },
};

const initialSales = [
  {
    id: "SAL-10521",
    invoice: "INV-10521",
    customerId: "CUS-0001",
    date: "2026-11-24",
    items: [
      { name: "Paracetamol 500mg", quantity: 2, price: 2500 },
      { name: "Vitamin C 1000mg", quantity: 1, price: 4500 },
    ],
    total: 9500,
    paid: 9500,
    paymentMethod: "Bank Transfer",
    status: "Paid",
    cashier: "Ada Okoro",
  },
  {
    id: "SAL-10482",
    invoice: "INV-10482",
    customerId: "CUS-0001",
    date: "2026-11-20",
    items: [
      { name: "Amoxicillin 500mg", quantity: 3, price: 6000 },
      { name: "Cetirizine 10mg", quantity: 2, price: 1800 },
    ],
    total: 19800,
    paid: 15000,
    paymentMethod: "Cash",
    status: "Partially Paid",
    cashier: "Samuel James",
  },
  {
    id: "SAL-10361",
    invoice: "INV-10361",
    customerId: "CUS-0001",
    date: "2026-11-12",
    items: [
      { name: "Metformin 500mg", quantity: 2, price: 3200 },
    ],
    total: 6400,
    paid: 6400,
    paymentMethod: "POS Terminal",
    status: "Paid",
    cashier: "Ada Okoro",
  },
  {
    id: "SAL-10302",
    invoice: "INV-10302",
    customerId: "CUS-0001",
    date: "2026-10-29",
    items: [
      { name: "Omeprazole 20mg", quantity: 1, price: 5200 },
      { name: "Vitamin C 1000mg", quantity: 2, price: 4500 },
    ],
    total: 14200,
    paid: 0,
    paymentMethod: "Credit",
    status: "Unpaid",
    cashier: "Samuel James",
  },
  {
    id: "SAL-20231",
    invoice: "INV-20231",
    customerId: "CUS-0002",
    date: "2026-11-23",
    items: [
      { name: "Paracetamol 500mg", quantity: 20, price: 2500 },
      { name: "Amoxicillin 500mg", quantity: 10, price: 6000 },
      { name: "Vitamin C 1000mg", quantity: 10, price: 4500 },
    ],
    total: 175000,
    paid: 100000,
    paymentMethod: "Bank Transfer",
    status: "Partially Paid",
    cashier: "Ada Okoro",
  },
  {
    id: "SAL-20202",
    invoice: "INV-20202",
    customerId: "CUS-0002",
    date: "2026-11-10",
    items: [
      { name: "Metformin 500mg", quantity: 15, price: 3200 },
    ],
    total: 48000,
    paid: 48000,
    paymentMethod: "Bank Transfer",
    status: "Paid",
    cashier: "Samuel James",
  },
  {
    id: "SAL-30310",
    invoice: "INV-30310",
    customerId: "CUS-0003",
    date: "2026-11-21",
    items: [
      { name: "Cetirizine 10mg", quantity: 4, price: 1800 },
      { name: "Omeprazole 20mg", quantity: 2, price: 5200 },
    ],
    total: 17600,
    paid: 17600,
    paymentMethod: "Cash",
    status: "Paid",
    cashier: "Ada Okoro",
  },
  {
    id: "SAL-40420",
    invoice: "INV-40420",
    customerId: "CUS-0004",
    date: "2026-11-18",
    items: [
      { name: "Vitamin C 1000mg", quantity: 2, price: 4500 },
      { name: "Paracetamol 500mg", quantity: 1, price: 2500 },
    ],
    total: 11500,
    paid: 11500,
    paymentMethod: "POS Terminal",
    status: "Paid",
    cashier: "Samuel James",
  },
  {
    id: "SAL-50520",
    invoice: "INV-50520",
    customerId: "CUS-0005",
    date: "2026-11-19",
    items: [
      { name: "Amoxicillin 500mg", quantity: 10, price: 6000 },
      { name: "Metformin 500mg", quantity: 10, price: 3200 },
    ],
    total: 92000,
    paid: 7000,
    paymentMethod: "Credit",
    status: "Partially Paid",
    cashier: "Ada Okoro",
  },
];

const money = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const dateLabel = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function CustomerActivity() {
  const { id } = useParams();
  const customer = customers[id] || {
    name: "Customer",
    phone: "Customer record not found in demo data",
  };

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedSale, setSelectedSale] = useState(null);

  const customerSales = useMemo(
    () =>
      initialSales
        .filter((sale) => sale.customerId === id)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [id]
  );

  const filteredSales = customerSales.filter((sale) => {
    const query = search.toLowerCase();

    const matchesSearch =
      sale.invoice.toLowerCase().includes(query) ||
      sale.id.toLowerCase().includes(query) ||
      sale.items.some((item) => item.name.toLowerCase().includes(query));

    const matchesPayment =
      paymentFilter === "all" ||
      (paymentFilter === "paid" && sale.status === "Paid") ||
      (paymentFilter === "partial" && sale.status === "Partially Paid") ||
      (paymentFilter === "unpaid" && sale.status === "Unpaid");

    const saleDate = new Date(`${sale.date}T00:00:00`);
    const now = new Date();
    const daysAgo = Math.floor(
      (new Date(now.getFullYear(), now.getMonth(), now.getDate()) -
        saleDate) /
        86400000
    );

    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "7days" && daysAgo <= 7) ||
      (dateFilter === "30days" && daysAgo <= 30) ||
      (dateFilter === "90days" && daysAgo <= 90);

    return matchesSearch && matchesPayment && matchesDate;
  });

  const summary = customerSales.reduce(
    (acc, sale) => {
      acc.sales += sale.total;
      acc.paid += sale.paid;
      acc.balance += sale.total - sale.paid;
      acc.items += sale.items.reduce((sum, item) => sum + item.quantity, 0);
      return acc;
    },
    { sales: 0, paid: 0, balance: 0, items: 0 }
  );

  const exportCsv = () => {
    const rows = [
      ["Invoice", "Date", "Items", "Total", "Paid", "Balance", "Status"],
      ...filteredSales.map((sale) => [
        sale.invoice,
        sale.date,
        sale.items.map((item) => item.name).join("; "),
        sale.total,
        sale.paid,
        sale.total - sale.paid,
        sale.status,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${id}-purchase-history.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="customer-activity-page">
      <div className="customer-activity-header">
        <div>
          <Link to={`/customers/${id}`} className="customer-activity-back">
            <ArrowLeft size={16} />
            Back to Customer
          </Link>

          <h1>Purchase History</h1>
          <p>
            {customer.name} · {customer.phone}
          </p>
        </div>

        <button
          className="customer-activity-export"
          onClick={exportCsv}
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="customer-activity-stats">
        <div className="customer-activity-stat">
          <div className="customer-activity-stat-icon green">
            <ShoppingBag size={19} />
          </div>
          <span>Total Purchases</span>
          <strong>{money(summary.sales)}</strong>
          <small>{customerSales.length} sales transactions</small>
        </div>

        <div className="customer-activity-stat">
          <div className="customer-activity-stat-icon blue">
            <Wallet size={19} />
          </div>
          <span>Total Received</span>
          <strong>{money(summary.paid)}</strong>
          <small>Payments recorded against sales</small>
        </div>

        <div className="customer-activity-stat">
          <div className="customer-activity-stat-icon orange">
            <Receipt size={19} />
          </div>
          <span>Outstanding Balance</span>
          <strong>{money(summary.balance)}</strong>
          <small>Unpaid customer balance</small>
        </div>

        <div className="customer-activity-stat">
          <div className="customer-activity-stat-icon purple">
            <CalendarDays size={19} />
          </div>
          <span>Items Purchased</span>
          <strong>{summary.items}</strong>
          <small>Total item quantities sold</small>
        </div>
      </div>

      <div className="customer-activity-panel">
        <div className="customer-activity-panel-heading">
          <div>
            <h2>Sales Transactions</h2>
            <p>Review invoices and items purchased by this customer.</p>
          </div>
        </div>

        <div className="customer-activity-toolbar">
          <div className="customer-activity-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search invoice or product..."
            />
          </div>

          <select
            value={paymentFilter}
            onChange={(event) => setPaymentFilter(event.target.value)}
          >
            <option value="all">All payment statuses</option>
            <option value="paid">Paid</option>
            <option value="partial">Partially paid</option>
            <option value="unpaid">Unpaid</option>
          </select>

          <select
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
          >
            <option value="all">All dates</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
        </div>

        <div className="customer-activity-table-wrap">
          <table className="customer-activity-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td>
                    <div className="customer-activity-invoice">
                      <strong>{sale.invoice}</strong>
                      <span>{sale.id}</span>
                    </div>
                  </td>
                  <td>{dateLabel(sale.date)}</td>
                  <td>{sale.items.reduce((sum, item) => sum + item.quantity, 0)} items</td>
                  <td>{money(sale.total)}</td>
                  <td>{money(sale.paid)}</td>
                  <td className="customer-activity-balance">
                    {money(sale.total - sale.paid)}
                  </td>
                  <td>
                    <span
                      className={`customer-activity-status ${sale.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="customer-activity-view"
                      title="View transaction"
                      onClick={() => setSelectedSale(sale)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan="8">
                    <div className="customer-activity-empty">
                      <ShoppingBag size={25} />
                      <strong>No transactions found</strong>
                      <span>Try adjusting your search or filters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="customer-activity-footer">
          Showing {filteredSales.length} of {customerSales.length} transactions
        </div>
      </div>

      {selectedSale && (
        <div
          className="customer-activity-modal-overlay"
          onClick={() => setSelectedSale(null)}
        >
          <div
            className="customer-activity-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="customer-activity-modal-header">
              <div>
                <span>Transaction details</span>
                <h2>{selectedSale.invoice}</h2>
                <p>{dateLabel(selectedSale.date)}</p>
              </div>
              <button onClick={() => setSelectedSale(null)}>
                <X size={19} />
              </button>
            </div>

            <div className="customer-activity-items">
              <div className="customer-activity-items-heading">
                <strong>Items purchased</strong>
                <span>{selectedSale.items.length} products</span>
              </div>

              {selectedSale.items.map((item, index) => (
                <div className="customer-activity-item" key={index}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      {item.quantity} × {money(item.price)}
                    </span>
                  </div>
                  <strong>{money(item.quantity * item.price)}</strong>
                </div>
              ))}
            </div>

            <div className="customer-activity-total">
              <div>
                <span>Invoice total</span>
                <strong>{money(selectedSale.total)}</strong>
              </div>
              <div>
                <span>Amount paid</span>
                <strong>{money(selectedSale.paid)}</strong>
              </div>
              <div>
                <span>Balance due</span>
                <strong>
                  {money(selectedSale.total - selectedSale.paid)}
                </strong>
              </div>
            </div>

            <div className="customer-activity-payment-info">
              <span>Payment method</span>
              <strong>{selectedSale.paymentMethod}</strong>
              <span>Cashier</span>
              <strong>{selectedSale.cashier}</strong>
            </div>

            <div className="customer-activity-modal-actions">
              <button
                className="customer-activity-close"
                onClick={() => setSelectedSale(null)}
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
