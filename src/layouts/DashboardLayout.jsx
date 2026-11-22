
import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ShoppingBasket,
  Truck,
  Users,
  Wallet,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  Sun,
  Moon,
  Search,
  Command,
  X
} from "lucide-react";

const navigation = [
  {
    heading: "WORKSPACE",
    items: [
      { label: "Dashboard", path: "/", icon: LayoutDashboard },
      { label: "Inventory", path: "/inventory", icon: Package },
      { label: "Point of Sale", path: "/pos", icon: ShoppingCart },
      { label: "Purchasing", path: "/purchases", icon: ShoppingBasket }
    ]
  },
  {
    heading: "RELATIONSHIPS",
    items: [
      { label: "Suppliers", path: "/suppliers", icon: Truck },
      { label: "Customers", path: "/customers", icon: Users }
    ]
  },
  {
    heading: "MANAGEMENT",
    items: [
      { label: "Finance", path: "/finance", icon: Wallet },
      { label: "Staff & Permissions", path: "/staff", icon: Users },
      { label: "Reports", path: "/reports", icon: BarChart3 }
    ]
  }
];

function DashboardLayout() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("vinora-theme") || "light"
  );

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("vinora-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current =>
      current === "light" ? "dark" : "light"
    );
  };

  return (
    <div className="app-shell" data-theme={theme}>

      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={[
          "sidebar",
          collapsed ? "sidebar-collapsed" : "",
          mobileOpen ? "sidebar-mobile-open" : ""
        ].join(" ")}
      >

        <div className="brand-area">
          <div className="brand-logo">V</div>

          {!collapsed && (
            <div className="brand-details">
              <h2>vinora</h2>
              <span>BUSINESS MANAGEMENT</span>
            </div>
          )}

          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>

        <div className="sidebar-content">

          {navigation.map(section => (
            <div className="nav-section" key={section.heading}>

              {!collapsed && (
                <div className="nav-heading">
                  {section.heading}
                </div>
              )}

              {section.items.map(item => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    title={collapsed ? item.label : ""}
                    className={({ isActive }) =>
                      `nav-item ${isActive ? "nav-item-active" : ""}`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon size={19} strokeWidth={1.8} />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                );
              })}

            </div>
          ))}

          <div className="nav-section">
            {!collapsed && (
              <div className="nav-heading">GENERAL</div>
            )}

            <NavLink
              to="/notifications"
              title={collapsed ? "Notifications" : ""}
              className={({ isActive }) =>
                `nav-item ${isActive ? "nav-item-active" : ""}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <Bell size={19} />
              {!collapsed && <span>Notifications</span>}
            </NavLink>

            <NavLink
              to="/settings"
              title={collapsed ? "Settings" : ""}
              className={({ isActive }) =>
                `nav-item ${isActive ? "nav-item-active" : ""}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <Settings size={19} />
              {!collapsed && <span>Settings</span>}
            </NavLink>
          </div>

        </div>

        <div className="sidebar-bottom">
          {!collapsed && (
            <div className="workspace-card">
              <div className="workspace-avatar">V</div>
              <div>
                <strong>My Organisation</strong>
                <span>Administrator</span>
              </div>
            </div>
          )}

          <button
            className="collapse-button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            {collapsed
              ? <ChevronRight size={18} />
              : <ChevronLeft size={18} />
            }

            {!collapsed && <span>Collapse sidebar</span>}
          </button>
        </div>

      </aside>

      <main className="main-area">

        <header className="topbar">

          <div className="topbar-left">

            <button
              className="icon-button mobile-menu"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>

            <div className="search-box">
              <Search size={17} />
              <input
                type="search"
                placeholder="Search anything..."
              />
              <kbd><Command size={11} /> K</kbd>
            </div>

          </div>

          <div className="topbar-actions">

            <button
              className="icon-button"
              onClick={toggleTheme}
              title="Switch appearance"
              aria-label="Switch appearance"
            >
              {theme === "light"
                ? <Moon size={19} />
                : <Sun size={19} />
              }
            </button>

            <NavLink
              to="/notifications"
              className="icon-button notification-button"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span className="notification-dot" />
            </NavLink>

            <div className="topbar-divider" />

            <div className="user-profile">
              <div className="user-avatar">VA</div>
              <div className="user-info">
                <strong>Vinora Admin</strong>
                <span>Administrator</span>
              </div>
            </div>

          </div>

        </header>

        <section className="page-content">
          <Outlet />
        </section>

      </main>
    </div>
  );
}

export default DashboardLayout;
