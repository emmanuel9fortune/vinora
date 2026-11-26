
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  X,
  Eye,
  Wallet,
  CalendarDays,
  AlertCircle,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import "../../styles/finance.css";

const initialBills = [
  {
    id: "BILL-2026-001",
    supplier: "HealthPlus Distribution",
    invoiceNo: "HP-88421",
    date: "2026-11-02",
    dueDate: "2026-11-28",
    amount: 1850000,
    paid: 650000,
    status: "Partially Paid",
    category: "Inventory",
    description: "Pharmaceutical stock supply",
  },
  {
    id: "BILL-2026-002",
    supplier: "MedCare Wholesale",
    invoiceNo: "MC-19034",
    date: "2026-11-05",
    dueDate: "2026-11-20",
    amount: 920000,
    paid: 0,
    status: "Overdue",
    category: "Inventory",
    description: "Medical and pharmacy supplies",
  },
  {
    id: "BILL-2026-003",
    supplier: "CleanPro Services",
    invoiceNo: "CP-7721",
    date: "2026-11-10",
    dueDate: "2026-12-10",
    amount: 145000,
    paid: 0,
    status: "Unpaid",
    category: "Operating Expense",
    description: "Monthly cleaning services",
  },
  {
    id: "BILL-2026-004",
    supplier: "City Power Utilities",
    invoiceNo: "CPU-1106",
    date: "2026-11-12",
    dueDate: "2026-11-25",
    amount: 285000,
    paid: 100000,
    status: "Partially Paid",
    category: "Utilities",
    description: "Electricity bill",
  },
  {
    id: "BILL-2026-005",
    supplier: "Prime Medical Supplies",
    invoiceNo: "PMS-5068",
    date: "2026-11-14",
    dueDate: "2026-12-14",
    amount: 640000,
    paid: 0,
    status: "Unpaid",
    category: "Inventory",
    description: "Medical consumables",
  },
];

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getOutstanding = (bill) => Math.max(0, bill.amount - bill.paid);

const getStatus = (bill) => {
  const outstanding = getOutstanding(bill);

  if (outstanding === 0) return "Paid";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(`${bill.dueDate}T00:00:00`);

  if (dueDate < today) return "Overdue";
  if (bill.paid > 0) return "Partially Paid";

  return "Unpaid";
};

export default function AccountsPayable() {
  const [bills, setBills] = useState(initialBills);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBill, setSelectedBill] = useState(null);
  const [modal, setModal] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [error, setError] = useState("");

  const billRows = useMemo(
    () =>
      bills.map((bill) => ({
        ...bill,
        outstanding: getOutstanding(bill),
        currentStatus: getStatus(bill),
      })),
    [bills]
  );

  const totalOutstanding = billRows.reduce(
    (sum, bill) => sum + bill.outstanding,
    0
  );

  const totalOverdue = billRows
    .filter((bill) => bill.currentStatus === "Overdue")
    .reduce((sum, bill) => sum + bill.outstanding, 0);

  const totalPaid = bills.reduce((sum, bill) => sum + bill.paid, 0);

  const filteredBills = billRows.filter((bill) => {
    const term = search.toLowerCase().trim();

    const matchesSearch =
      bill.supplier.toLowerCase().includes(term) ||
      bill.id.toLowerCase().includes(term) ||
      bill.invoiceNo.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "All" || bill.currentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openPaymentModal = (bill) => {
    setSelectedBill(bill);
    setPaymentAmount(String(bill.outstanding));
    setPaymentMethod("Bank Transfer");
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setPaymentReference("");
    setPaymentNote("");
    setError("");
    setModal("payment");
  };

  const recordPayment = (event) => {
    event.preventDefault();
    setError("");

    const amount = Number(paymentAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid payment amount.");
      return;
    }

    if (amount > selectedBill.outstanding) {
      setError("Payment cannot exceed the outstanding bill amount.");
      return;
    }

    setBills((current) =>
      current.map((bill) =>
        bill.id === selectedBill.id
          ? { ...bill, paid: bill.paid + amount }
          : bill
      )
    );

    setSelectedBill((current) =>
      current
        ? {
            ...current,
            paid: current.paid + amount,
          }
        : current
    );

    setModal("");
  };

  const closeModal = () => {
    setModal("");
    setSelectedBill(null);
    setError("");
  };

  return (
    <div className="accounts-payable-page">
      <header className="accounts-payable-header">
        <div>
          <div className="accounts-payable-breadcrumb">
            Finance <span>/</span> Accounts Payable
          </div>
          <h1>Accounts Payable</h1>
          <p>Track supplier bills, outstanding balances and payments.</p>
        </div>
      </header>

      <section className="accounts-payable-stats">
        <div className="accounts-payable-stat-card">
          <div className="accounts-payable-stat-top">
            <span className="accounts-payable-stat-icon payable">
              <Wallet size={20} />
            </span>
            <span>Total Outstanding</span>
          </div>
          <h2>{formatMoney(totalOutstanding)}</h2>
          <p>Unpaid supplier balances</p>
        </div>

        <div className="accounts-payable-stat-card">
          <div className="accounts-payable-stat-top">
            <span className="accounts-payable-stat-icon overdue">
              <AlertCircle size={20} />
            </span>
            <span>Overdue Payables</span>
          </div>
          <h2>{formatMoney(totalOverdue)}</h2>
          <p>Past their due date</p>
        </div>

        <div className="accounts-payable-stat-card">
          <div className="accounts-payable-stat-top">
            <span className="accounts-payable-stat-icon paid">
              <CheckCircle2 size={20} />
            </span>
            <span>Payments Recorded</span>
          </div>
          <h2>{formatMoney(totalPaid)}</h2>
          <p>Payments against supplier bills</p>
        </div>
      </section>

      <section className="accounts-payable-content">
        <div className="accounts-payable-content-heading">
          <div>
            <h2>Supplier Bills</h2>
            <p>Review invoices and record supplier payments.</p>
          </div>
          <span className="accounts-payable-count">
            {filteredBills.length} bills
          </span>
        </div>

        <div className="accounts-payable-toolbar">
          <div className="accounts-payable-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search supplier, bill or invoice..."
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <div className="accounts-payable-table-wrap">
          <table className="accounts-payable-table">
            <thead>
              <tr>
                <th>Supplier / Bill</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Bill Amount</th>
                <th>Outstanding</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBills.map((bill) => (
                <tr key={bill.id}>
                  <td>
                    <div className="accounts-payable-supplier-cell">
                      <strong>{bill.supplier}</strong>
                      <span>
                        {bill.id} · {bill.invoiceNo}
                      </span>
                    </div>
                  </td>
                  <td>{formatDate(bill.date)}</td>
                  <td>{formatDate(bill.dueDate)}</td>
                  <td className="accounts-payable-amount">
                    {formatMoney(bill.amount)}
                  </td>
                  <td className="accounts-payable-outstanding">
                    {formatMoney(bill.outstanding)}
                  </td>
                  <td>
                    <span
                      className={`accounts-payable-status ${bill.currentStatus
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {bill.currentStatus}
                    </span>
                  </td>
                  <td>
                    <div className="accounts-payable-row-actions">
                      <button
                        title="View bill"
                        onClick={() => {
                          setSelectedBill(bill);
                          setModal("details");
                        }}
                      >
                        <Eye size={17} />
                      </button>
                      {bill.outstanding > 0 && (
                        <button
                          title="Record payment"
                          className="accounts-payable-pay-btn"
                          onClick={() => openPaymentModal(bill)}
                        >
                          <Plus size={16} />
                          Pay
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredBills.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="accounts-payable-empty">
                      <Wallet size={28} />
                      <strong>No supplier bills found</strong>
                      <span>Try adjusting your search or status filter.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="accounts-payable-footer">
          Showing {filteredBills.length} of {bills.length} bills
        </div>
      </section>

      {modal === "payment" && selectedBill && (
        <div className="accounts-payable-overlay" onClick={closeModal}>
          <div
            className="accounts-payable-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="accounts-payable-modal-header">
              <div>
                <h2>Record Supplier Payment</h2>
                <p>{selectedBill.supplier}</p>
              </div>
              <button onClick={closeModal} className="accounts-payable-close">
                <X size={20} />
              </button>
            </div>

            <div className="accounts-payable-payment-summary">
              <span>Outstanding Balance</span>
              <strong>{formatMoney(selectedBill.outstanding)}</strong>
              <small>Bill {selectedBill.id}</small>
            </div>

            <form onSubmit={recordPayment}>
              <div className="accounts-payable-form-grid">
                <label>
                  Payment Amount *
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    max={selectedBill.outstanding}
                    value={paymentAmount}
                    onChange={(event) => setPaymentAmount(event.target.value)}
                    required
                  />
                </label>

                <label>
                  Payment Date *
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(event) => setPaymentDate(event.target.value)}
                    required
                  />
                </label>

                <label>
                  Payment Method *
                  <select
                    value={paymentMethod}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                  >
                    <option>Bank Transfer</option>
                    <option>Cash</option>
                    <option>POS / Terminal</option>
                    <option>Cheque</option>
                  </select>
                </label>

                <label>
                  Payment Reference
                  <input
                    value={paymentReference}
                    onChange={(event) => setPaymentReference(event.target.value)}
                    placeholder="Transaction reference"
                  />
                </label>

                <label className="accounts-payable-form-full">
                  Note
                  <textarea
                    rows="3"
                    value={paymentNote}
                    onChange={(event) => setPaymentNote(event.target.value)}
                    placeholder="Optional payment note"
                  />
                </label>
              </div>

              {error && <div className="accounts-payable-error">{error}</div>}

              <div className="accounts-payable-modal-footer">
                <button
                  type="button"
                  className="accounts-payable-secondary-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="accounts-payable-primary-btn">
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === "details" && selectedBill && (
        <div className="accounts-payable-overlay" onClick={closeModal}>
          <div
            className="accounts-payable-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="accounts-payable-modal-header">
              <div>
                <h2>Supplier Bill Details</h2>
                <p>{selectedBill.id}</p>
              </div>
              <button onClick={closeModal} className="accounts-payable-close">
                <X size={20} />
              </button>
            </div>

            <div className="accounts-payable-detail-list">
              <div>
                <span>Supplier</span>
                <strong>{selectedBill.supplier}</strong>
              </div>
              <div>
                <span>Supplier Invoice</span>
                <strong>{selectedBill.invoiceNo}</strong>
              </div>
              <div>
                <span>Bill Date</span>
                <strong>{formatDate(selectedBill.date)}</strong>
              </div>
              <div>
                <span>Due Date</span>
                <strong>{formatDate(selectedBill.dueDate)}</strong>
              </div>
              <div>
                <span>Category</span>
                <strong>{selectedBill.category}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{getStatus(selectedBill)}</strong>
              </div>
              <div className="full">
                <span>Description</span>
                <strong>{selectedBill.description}</strong>
              </div>
            </div>

            <div className="accounts-payable-detail-totals">
              <div>
                <span>Bill Amount</span>
                <strong>{formatMoney(selectedBill.amount)}</strong>
              </div>
              <div>
                <span>Paid</span>
                <strong>{formatMoney(selectedBill.paid)}</strong>
              </div>
              <div>
                <span>Outstanding</span>
                <strong>{formatMoney(getOutstanding(selectedBill))}</strong>
              </div>
            </div>

            <div className="accounts-payable-modal-footer">
              <button
                className="accounts-payable-secondary-btn"
                onClick={closeModal}
              >
                Close
              </button>
              {getOutstanding(selectedBill) > 0 && (
                <button
                  className="accounts-payable-primary-btn"
                  onClick={() => openPaymentModal(selectedBill)}
                >
                  Record Payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
