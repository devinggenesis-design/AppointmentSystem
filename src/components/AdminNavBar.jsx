import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
import "./AdminNavbar.css";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarCheck },
  { to: "/admin/schedules", label: "Schedules", icon: Clock },
  { to: "/admin/account", label: "Account", icon: UserCog },
];

function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <>
      {/* Mobile top bar */}
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
        {/* Brand */}
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

        {/* Links */}
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

        {/* Footer */}
        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__profile">
            <div className="admin-sidebar__avatar">A</div>
            <div>
              <div className="admin-sidebar__profile-name">Admin</div>
              <div className="admin-sidebar__profile-role">Shop Owner</div>
            </div>
          </div>

          <button className="admin-sidebar__logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminNavbar;
