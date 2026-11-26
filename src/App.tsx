import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Inventory from "./pages/inventory/Inventory";
import Products from "./pages/inventory/Products";
import Batches from "./pages/inventory/Batches";
import StockMovements from "./pages/inventory/StockMovements";
import StockAdjustments from "./pages/inventory/StockAdjustments";
import ExpiryManagement from "./pages/inventory/ExpiryManagement";
import Categories from "./pages/inventory/Categories";
import Purchases from "./pages/purchases/Purchases";
import PurchaseOrders from "./pages/purchases/PurchaseOrders";
import GoodsReceived from "./pages/purchases/GoodsReceived";
import SupplierInvoices from "./pages/purchases/SupplierInvoices";
import SupplierPayments from "./pages/purchases/SupplierPayments";
import PurchaseReturns from "./pages/purchases/PurchaseReturns";
import Suppliers from "./pages/suppliers/Suppliers";
import SupplierDetails from "./pages/suppliers/SupplierDetails";
import Customers from "./pages/customers/Customers";
import CustomerDetails from "./pages/customers/CustomerDetails";
import CustomerPayments from "./pages/customers/CustomerPayments";
import CustomerCredit from "./pages/customers/CustomerCredit";
import CustomerActivity from "./pages/customers/CustomerActivity";
import POS from "./pages/pos/POS";
import SalesHistory from "./pages/pos/SalesHistory";
import RefundsReturns from "./pages/pos/RefundsReturns";
import CashierShifts from "./pages/pos/CashierShifts";
import Finance from "./pages/finance/Finance";
import IncomeExpenses from "./pages/finance/IncomeExpenses";
import Cashbook from "./pages/finance/Cashbook";
import BankAccounts from "./pages/finance/BankAccounts";
import AccountsReceivable from "./pages/finance/AccountsReceivable";
import AccountsPayable from "./pages/finance/AccountsPayable";
import ChartOfAccounts from "./pages/finance/ChartOfAccounts";
import GeneralLedger from "./pages/finance/GeneralLedger";
import Staff from "./pages/staff/Staff";







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

          {/* INVENTORY */}
          <Route path="inventory" element={<Inventory />} />
          <Route path="inventory/products" element={<Products />} />
          <Route path="inventory/batches" element={<Batches />} />
          <Route  path="inventory/movements"  element={<StockMovements />}/>
          <Route path="inventory/adjustments" element={<StockAdjustments />}/>
          <Route path="inventory/expiry" element={<ExpiryManagement />} />          
          <Route path="inventory/categories" element={<Categories />} />

          {/* POS */}
          <Route path="pos" element={<POS />} />
          <Route path="pos/sales-history" element={<SalesHistory />} />
          <Route path="pos/refunds" element={<RefundsReturns />} />
          <Route path="pos/shifts" element={<CashierShifts />} />

          {/* PURCHASES */}
          <Route path="purchases" element={<Purchases />} />
          <Route path="purchases/orders" element={<PurchaseOrders />} />
          <Route path="purchases/goods-received" element={<GoodsReceived />} />
          <Route path="purchases/invoices" element={<SupplierInvoices />} />
          <Route path="purchases/payments" element={<SupplierPayments />} />
          <Route path="purchases/returns" element={<PurchaseReturns />} />

          {/* SUPPLIERS */}
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="suppliers/:id" element={<SupplierDetails />} />

          {/* CUSTOMERS */}
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:id" element={<CustomerDetails />} />
          <Route path="customers/payments" element={<CustomerPayments />} />
          <Route path="customers/credit" element={<CustomerCredit />} />
          <Route path="customers/:id/activity" element={<CustomerActivity />}/>

          {/* FINANCE */}
          <Route path="finance" element={<Finance />} />
          <Route path="finance/income-expenses"element={<IncomeExpenses />}/>
          <Route path="finance/cashbook" element={<Cashbook />} />
          <Route path="finance/bank-accounts" element={<BankAccounts />} /> 
          <Route path="finance/receivables" element={<AccountsReceivable />}/>
          <Route path="finance/accounts-payable" element={<AccountsPayable />}/>
          <Route path="finance/chart-of-accounts" element={<ChartOfAccounts />}/>
          <Route path="finance/general-ledger" element={<GeneralLedger />} />


          <Route path="staff" element={<Staff />} />


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
