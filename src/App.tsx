import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Inventory from "./pages/inventory/Inventory";
import Products from "./pages/inventory/Products";
import Batches from "./pages/inventory/Batches";
import StockMovements from "./pages/inventory/StockMovements";
import StockAdjustments from "./pages/inventory/StockAdjustments";
import ExpiryManagement from "./pages/inventory/ExpiryManagement";

// function ModulePage({ title, description }) {
function ModulePage({ title, description }: { title: string; description: string }) {
  return (
    <div className="module-placeholder">
      <div className="eyebrow">VINORA WORKSPACE</div>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="placeholder-card">
        <h3>{title} management</h3>
        <p>
          This module is part of the Vinora application.
          We will implement its complete interface and functionality
          in the next development stages.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="inventory" element={<Inventory />} />

          <Route path="inventory/products" element={<Products />} />

          <Route path="inventory/batches" element={<Batches />} />

          <Route
            path="inventory/movements"
            element={<StockMovements />}
          />

          <Route
            path="inventory/adjustments"
            element={<StockAdjustments />}
          />

          <Route path="inventory/expiry" element={<ExpiryManagement />} />

          <Route
            path="inventory/categories"
            element={
              <ModulePage
                title="Product Categories"
                description="Organise and manage your product categories."
              />
            }
          />

          <Route
            path="pos"
            element={
              <ModulePage
                title="Point of Sale"
                description="Process sales, payments, refunds and receipts."
              />
            }
          />

          <Route
            path="purchases"
            element={
              <ModulePage
                title="Purchasing"
                description="Manage purchase orders, goods received and supplier invoices."
              />
            }
          />

          <Route
            path="suppliers"
            element={
              <ModulePage
                title="Suppliers"
                description="Manage supplier information, balances and payments."
              />
            }
          />

          <Route
            path="customers"
            element={
              <ModulePage
                title="Customers"
                description="Manage customer profiles, transactions and credit balances."
              />
            }
          />

          <Route
            path="finance"
            element={
              <ModulePage
                title="Finance & Accounting"
                description="Manage accounts, expenses, journals and financial reports."
              />
            }
          />

          <Route
            path="staff"
            element={
              <ModulePage
                title="Staff & Permissions"
                description="Manage employees, roles and access permissions."
              />
            }
          />

          <Route
            path="reports"
            element={
              <ModulePage
                title="Reports"
                description="Review business performance and financial reports."
              />
            }
          />

          <Route
            path="notifications"
            element={
              <ModulePage
                title="Notifications"
                description="Review important business alerts and activities."
              />
            }
          />

          <Route
            path="settings"
            element={
              <ModulePage
                title="Settings"
                description="Configure your organisation and workspace."
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
