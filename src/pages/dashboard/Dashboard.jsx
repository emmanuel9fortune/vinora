
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Wallet,
  ShoppingBag,
  Package,
  AlertTriangle,
  Clock3
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const salesData = [
  { day: "Mon", sales: 125000, previous: 95000 },
  { day: "Tue", sales: 180000, previous: 110000 },
  { day: "Wed", sales: 145000, previous: 130000 },
  { day: "Thu", sales: 220000, previous: 150000 },
  { day: "Fri", sales: 195000, previous: 170000 },
  { day: "Sat", sales: 280000, previous: 190000 },
  { day: "Sun", sales: 240000, previous: 175000 }
];

const transactions = [
  {
    id: "VN-1024",
    customer: "Walk-in Customer",
    date: "Today, 10:42 AM",
    amount: 42500,
    method: "Cash",
    status: "Completed"
  },
  {
    id: "VN-1023",
    customer: "Grace Pharmacy Client",
    date: "Today, 10:18 AM",
    amount: 78500,
    method: "Transfer",
    status: "Completed"
  },
  {
    id: "VN-1022",
    customer: "Walk-in Customer",
    date: "Today, 09:55 AM",
    amount: 12500,
    method: "POS",
    status: "Completed"
  },
  {
    id: "VN-1021",
    customer: "Michael Johnson",
    date: "Today, 09:30 AM",
    amount: 32000,
    method: "Cash",
    status: "Pending"
  }
];

const stockAlerts = [
  {
    name: "Paracetamol 500mg",
    detail: "Only 8 units remaining",
    type: "Low stock"
  },
  {
    name: "Amoxicillin 500mg",
    detail: "Expires in 28 days",
    type: "Expiry warning"
  },
  {
    name: "Vitamin C 1000mg",
    detail: "Only 5 units remaining",
    type: "Low stock"
  }
];

const money = value =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(value);

function StatCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
  description
}) {
  return (
    <div className="stat-card">

      <div className="stat-card-top">
        <span>{title}</span>

        <div className="stat-icon">
          <Icon size={19} />
        </div>
      </div>

      <h2>{value}</h2>

      <div className="stat-footer">

        <span className={positive ? "trend-up" : "trend-down"}>
          {positive
            ? <ArrowUpRight size={15} />
            : <ArrowDownRight size={15} />
          }
          {change}
        </span>

        <span>{description}</span>

      </div>

    </div>
  );
}

function Dashboard() {
  return (
    <div className="dashboard">

      <div className="page-heading">
        <div>
          <div className="eyebrow">OVERVIEW</div>
          <h1>Good morning, Admin</h1>
          <p>Here's what's happening with your business today.</p>
        </div>

        <button className="primary-button">
          <TrendingUp size={17} />
          View reports
        </button>
      </div>

      <div className="stats-grid">

        <StatCard
          title="Total Sales"
          value={money(1250000)}
          change="12.8%"
          positive={true}
          icon={ShoppingBag}
          description="vs previous period"
        />

        <StatCard
          title="Payments Received"
          value={money(1120000)}
          change="8.4%"
          positive={true}
          icon={Wallet}
          description="vs previous period"
        />

        <StatCard
          title="Gross Profit"
          value={money(385000)}
          change="5.2%"
          positive={true}
          icon={TrendingUp}
          description="vs previous period"
        />

        <StatCard
          title="Inventory Value"
          value={money(4850000)}
          change="2.1%"
          positive={true}
          icon={Package}
          description="vs previous period"
        />

      </div>

      <div className="dashboard-grid">

        <div className="panel sales-panel">

          <div className="panel-heading">
            <div>
              <h3>Sales overview</h3>
              <p>Monitor your business sales performance</p>
            </div>

            <select defaultValue="week">
              <option value="week">This week</option>
              <option value="month">This month</option>
              <option value="year">This year</option>
            </select>
          </div>

          <div className="chart-summary">
            <h2>{money(1425000)}</h2>
            <span className="trend-up">
              <ArrowUpRight size={15} />
              12.8%
            </span>
            <span>compared with previous period</span>
          </div>

          <div className="chart-container">

            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient
                    id="salesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#168568"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="100%"
                      stopColor="#168568"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 12 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                  tickFormatter={value => `${value / 1000}k`}
                />

                <Tooltip
                  formatter={value => money(value)}
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px"
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#168568"
                  strokeWidth={2.5}
                  fill="url(#salesGradient)"
                />

                <Area
                  type="monotone"
                  dataKey="previous"
                  stroke="#AAB5BE"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  fill="transparent"
                />

              </AreaChart>
            </ResponsiveContainer>

          </div>

        </div>

        <div className="panel alerts-panel">

          <div className="panel-heading">
            <div>
              <h3>Stock alerts</h3>
              <p>Items requiring attention</p>
            </div>

            <span className="alert-count">3</span>
          </div>

          <div className="alert-list">

            {stockAlerts.map((alert, index) => (
              <div className="alert-item" key={index}>

                <div className="alert-icon">
                  <AlertTriangle size={18} />
                </div>

                <div className="alert-content">
                  <strong>{alert.name}</strong>
                  <span>{alert.detail}</span>
                  <small>{alert.type}</small>
                </div>

              </div>
            ))}

          </div>

          <button className="text-button">
            View all stock alerts
            <ArrowUpRight size={15} />
          </button>

        </div>

      </div>

      <div className="panel transactions-panel">

        <div className="panel-heading">
          <div>
            <h3>Recent transactions</h3>
            <p>Latest sales recorded in your organisation</p>
          </div>

          <button className="secondary-button">
            View all
          </button>
        </div>

        <div className="table-wrapper">
          <table className="data-table">

            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Payment method</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="transaction-id">
                    {transaction.id}
                  </td>

                  <td>{transaction.customer}</td>

                  <td>
                    <span className="date-cell">
                      <Clock3 size={13} />
                      {transaction.date}
                    </span>
                  </td>

                  <td>{transaction.method}</td>

                  <td className="amount-cell">
                    {money(transaction.amount)}
                  </td>

                  <td>
                    <span
                      className={`status-pill ${
                        transaction.status === "Completed"
                          ? "status-success"
                          : "status-warning"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

      <div className="dashboard-disclaimer">
        <span>Demo data</span>
        Dashboard figures are illustrative sample values.
        Actual business figures will come from the database.
      </div>

    </div>
  );
}

export default Dashboard;
