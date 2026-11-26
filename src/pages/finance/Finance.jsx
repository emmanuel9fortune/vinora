
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  FileText,
  Landmark,
  Plus,
  Receipt,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "../../styles/finance.css";

const monthlyCashFlow = [
  { month: "Jan", income: 4200000, expenses: 2850000 },
  { month: "Feb", income: 5100000, expenses: 3200000 },
  { month: "Mar", income: 4650000, expenses: 3100000 },
  { month: "Apr", income: 5900000, expenses: 3650000 },
  { month: "May", income: 6400000, expenses: 4100000 },
  { month: "Jun", income: 7200000, expenses: 4550000 },
  { month: "Jul", income: 6800000, expenses: 4300000 },
  { month: "Aug", income: 8100000, expenses: 5200000 },
  { month: "Sep", income: 7600000, expenses: 4850000 },
  { month: "Oct", income: 8900000, expenses: 5600000 },
  { month: "Nov", income: 9400000, expenses: 5900000 },
  { month: "Dec", income: 10200000, expenses: 6400000 },
];

const recentTransactions = [
  {
    id: "TXN-1048",
    title: "Retail sales settlement",
    category: "Sales income",
    date: "Today, 10:42 AM",
    amount: 185000,
    type: "income",
    method: "Bank transfer",
  },
  {
    id: "TXN-1047",
    title: "Supplier payment",
    category: "Inventory purchase",
    date: "Today, 9:18 AM",
    amount: 320000,
    type: "expense",
    method: "Bank transfer",
  },
  {
    id: "TXN-1046",
    title: "Customer debt payment",
    category: "Accounts receivable",
    date: "Yesterday, 4:35 PM",
    amount: 75000,
    type: "income",
    method: "Cash",
  },
  {
    id: "TXN-1045",
    title: "Electricity bill",
    category: "Utilities",
    date: "Yesterday, 1:20 PM",
    amount: 48000,
    type: "expense",
    method: "Bank transfer",
  },
];

const financeLinks = [
  {
    title: "Income & Expenses",
    description: "Record and review money coming in and going out.",
    icon: Receipt,
    path: "/finance/income-expenses",
    color: "green",
  },
  {
    title: "Cashbook",
    description: "Track daily cash movements and balances.",
    icon: Wallet,
    path: "/finance/cashbook",
    color: "blue",
  },
  {
    title: "Bank Accounts",
    description: "Manage accounts and account balances.",
    icon: Landmark,
    path: "/finance/bank-accounts",
    color: "purple",
  },
  {
    title: "Accounts Receivable",
    description: "Monitor customer balances and outstanding debts.",
    icon: ArrowDownRight,
    path: "/finance/receivables",
    color: "orange",
  },
  {
    title: "Accounts Payable",
    description: "Review supplier balances and payments due.",
    icon: ArrowUpRight,
    path: "/finance/accounts-payable",
    color: "red",
  },
  {
    title: "Chart of Accounts",
    description: "View profit and loss, balance sheet and cash flow.",
    icon: BarChart3,
    path: "/finance/chart-of-accounts",
    color: "teal",
  },
  {
    title: "General Ledger",
    description: "View detailed financial transactions and reports.",
    icon: BookOpen,
    path: "/finance/general-ledger",
    color: "teal",
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

function FinanceStatCard({
  title,
  amount,
  description,
  icon: Icon,
  tone,
  trend,
}) {
  return (
    <div className="finance-stat-card">
      <div className="finance-stat-top">
        <div className={`finance-stat-icon ${tone}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`finance-stat-trend ${trend.direction}`}>
            {trend.direction === "up" ? (
              <ArrowUpRight size={15} />
            ) : (
              <ArrowDownRight size={15} />
            )}
            {trend.label}
          </span>
        )}
      </div>

      <p className="finance-stat-title">{title}</p>
      <h3 className="finance-stat-amount">{formatCurrency(amount)}</h3>
      <p className="finance-stat-description">{description}</p>
    </div>
  );
}

export default function Finance() {
  const totalIncome = 24850000;
  const totalExpenses = 16320000;
  const netProfit = totalIncome - totalExpenses;
  const cashPosition = 12840000;

  return (
    <div className="finance-page">
      <div className="finance-page-header">
        <div>
          <div className="finance-breadcrumb">
            <span>Business</span>
            <ChevronRight size={14} />
            <span>Finance</span>
          </div>

          <h1>Finance Overview</h1>
          <p>
            Monitor your business finances, cash position and financial
            performance.
          </p>
        </div>

        <div className="finance-header-actions">
          <button className="finance-secondary-button">
            <CalendarDays size={17} />
            This month
          </button>

          <Link
            to="/finance/income-expenses"
            className="finance-primary-button"
          >
            <Plus size={17} />
            Record transaction
          </Link>
        </div>
      </div>

      <div className="finance-overview-banner">
        <div className="finance-banner-icon">
          <CircleDollarSign size={24} />
        </div>

        <div className="finance-banner-content">
          <span>Available cash position</span>
          <h2>{formatCurrency(cashPosition)}</h2>
          <p>
            Combined demo balance across cash and bank accounts
          </p>
        </div>

        <div className="finance-banner-side">
          <span>Net profit this month</span>
          <strong>{formatCurrency(netProfit)}</strong>
          <small>Income minus expenses</small>
        </div>
      </div>

      <div className="finance-stats-grid">
        <FinanceStatCard
          title="Total Income"
          amount={totalIncome}
          description="Recorded income this month"
          icon={ArrowDownRight}
          tone="green"
          trend={{ direction: "up", label: "12.8%" }}
        />

        <FinanceStatCard
          title="Total Expenses"
          amount={totalExpenses}
          description="Recorded expenses this month"
          icon={ArrowUpRight}
          tone="red"
          trend={{ direction: "down", label: "4.2%" }}
        />

        <FinanceStatCard
          title="Net Profit"
          amount={netProfit}
          description="Income less expenses"
          icon={BriefcaseBusiness}
          tone="blue"
          trend={{ direction: "up", label: "18.6%" }}
        />

        <FinanceStatCard
          title="Outstanding Receivables"
          amount={2865000}
          description="Amount customers owe"
          icon={CreditCard}
          tone="orange"
        />
      </div>

      <div className="finance-main-grid">
        <section className="finance-panel finance-cashflow-panel">
          <div className="finance-panel-header">
            <div>
              <h2>Cash flow</h2>
              <p>Income and expenses throughout the year</p>
            </div>

            <span className="finance-panel-period">This year</span>
          </div>

          <div className="finance-chart-legend">
            <span>
              <i className="finance-legend-dot income" />
              Income
            </span>
            <span>
              <i className="finance-legend-dot expenses" />
              Expenses
            </span>
          </div>

          <div className="finance-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyCashFlow}
                margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="financeIncomeGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#16a34a"
                      stopOpacity={0.18}
                    />
                    <stop
                      offset="100%"
                      stopColor="#16a34a"
                      stopOpacity={0}
                    />
                  </linearGradient>

                  <linearGradient
                    id="financeExpenseGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#f97316"
                      stopOpacity={0.14}
                    />
                    <stop
                      offset="100%"
                      stopColor="#f97316"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="var(--inventory-border)"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--inventory-muted)", fontSize: 12 }}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--inventory-muted)", fontSize: 11 }}
                  tickFormatter={(value) => `${value / 1000000}m`}
                  width={38}
                />

                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    background: "var(--inventory-card)",
                    border: "1px solid var(--inventory-border)",
                    borderRadius: "10px",
                    color: "var(--inventory-text)",
                  }}
                  labelStyle={{ color: "var(--inventory-text)" }}
                />

                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  fill="url(#financeIncomeGradient)"
                />

                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  fill="url(#financeExpenseGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="finance-panel finance-account-panel">
          <div className="finance-panel-header">
            <div>
              <h2>Account balances</h2>
              <p>Current demo account balances</p>
            </div>

            <Link to="/finance/bank-accounts" className="finance-text-link">
              View all
            </Link>
          </div>

          <div className="finance-account-list">
            <div className="finance-account-row">
              <div className="finance-account-icon bank">
                <Landmark size={19} />
              </div>
              <div className="finance-account-info">
                <strong>Business Bank</strong>
                <span>Bank account</span>
              </div>
              <strong className="finance-account-balance">
                {formatCurrency(9850000)}
              </strong>
            </div>

            <div className="finance-account-row">
              <div className="finance-account-icon cash">
                <Banknote size={19} />
              </div>
              <div className="finance-account-info">
                <strong>Main Cash Till</strong>
                <span>Cash account</span>
              </div>
              <strong className="finance-account-balance">
                {formatCurrency(2990000)}
              </strong>
            </div>

            <div className="finance-account-row">
              <div className="finance-account-icon savings">
                <Wallet size={19} />
              </div>
              <div className="finance-account-info">
                <strong>Reserve Account</strong>
                <span>Savings account</span>
              </div>
              <strong className="finance-account-balance">
                {formatCurrency(1280000)}
              </strong>
            </div>
          </div>

          <Link
            to="/finance/cashbook"
            className="finance-account-footer-link"
          >
            Open cashbook
            <ChevronRight size={16} />
          </Link>
        </section>
      </div>

      <section className="finance-panel finance-transactions-panel">
        <div className="finance-panel-header">
          <div>
            <h2>Recent transactions</h2>
            <p>Latest recorded financial activity</p>
          </div>

          <Link to="/finance/cashbook" className="finance-text-link">
            View transactions
          </Link>
        </div>

        <div className="finance-table-wrapper">
          <table className="finance-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Reference</th>
                <th>Date</th>
                <th>Payment method</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    <div className="finance-transaction-name">
                      <span
                        className={`finance-transaction-icon ${transaction.type}`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowDownRight size={16} />
                        ) : (
                          <ArrowUpRight size={16} />
                        )}
                      </span>

                      <div>
                        <strong>{transaction.title}</strong>
                        <span>{transaction.category}</span>
                      </div>
                    </div>
                  </td>

                  <td className="finance-reference">{transaction.id}</td>
                  <td className="finance-date">{transaction.date}</td>
                  <td>{transaction.method}</td>

                  <td
                    className={`finance-transaction-amount ${transaction.type}`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="finance-shortcuts-section">
        <div className="finance-section-heading">
          <div>
            <h2>Finance workspace</h2>
            <p>Access your financial tools and records</p>
          </div>
        </div>

        <div className="finance-shortcuts-grid">
          {financeLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                to={item.path}
                className="finance-shortcut-card"
                key={item.title}
              >
                <div className={`finance-shortcut-icon ${item.color}`}>
                  <Icon size={20} />
                </div>

                <div className="finance-shortcut-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                <ChevronRight
                  size={18}
                  className="finance-shortcut-arrow"
                />
              </Link>
            );
          })}
        </div>
      </section>

      <div className="finance-demo-notice">
        <FileText size={17} />
        <span>
          This overview currently uses sample data. Financial balances and
          transactions will be connected to Vinora's accounting records when
          the backend is implemented.
        </span>
      </div>
    </div>
  );
}
