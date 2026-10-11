import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  UserCog,
  LogOut,
  Scissors,
  Menu,
  X,
} from "lucide-react";
import ConfirmModal from "../common/ConfirmModal";
import "./AdminNavbar.css";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarCheck },
  { to: "/admin/schedules", label: "Schedules", icon: Clock },
  { to: "/admin/account", label: "Account", icon: UserCog },
];

const readAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem("adminInfo")) || {};
  } catch {
    return {};
  }
};

function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setShowLogout(false);
    navigate("/admin/login");
  };

  const [admin, setAdmin] = useState(readAdmin);

  useEffect(() => {
    const refresh = () => setAdmin(readAdmin());
    window.addEventListener("adminInfoChanged", refresh);
    return () => window.removeEventListener("adminInfoChanged", refresh);
  }, []);

  return (
    <>
      <header className="admin-topbar">
        <button
          className="admin-topbar__toggle"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <span className="admin-topbar__title">Barbershop</span>
      </header>

      {open && <div className="admin-overlay" onClick={() => setOpen(false)} />}

      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__logo">
            <Scissors size={20} />
          </div>
          <div>
            <div className="admin-sidebar__name">Barbershop</div>
            <div className="admin-sidebar__role">Admin Panel</div>
          </div>
          <button
            className="admin-sidebar__close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          <span className="admin-sidebar__label">Menu</span>
          <ul>
            {links.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={() => setOpen(false)}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__profile">
            <div className="admin-sidebar__avatar">
              {(admin.name || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="admin-sidebar__profile-name">
                {admin.name || "Admin"}
              </div>
              <div className="admin-sidebar__profile-role">Shop Owner</div>
            </div>
          </div>
          <div className="admin-sidebar__name">
            {admin.shopName || "Barbershop"}
          </div>
          <button
            className="admin-sidebar__logout"
            onClick={() => {
              console.log("clicked, showLogout will be true");
              setShowLogout(true);
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <ConfirmModal
        open={showLogout}
        icon={<LogOut size={26} />}
        danger
        title="Log out?"
        message="You'll need to sign in again to manage appointments."
        confirmText="Log out"
        cancelText="Stay"
        onConfirm={handleLogout}
        onCancel={() => setShowLogout(false)}
      />
    </>
  );
}

export default AdminNavbar;
