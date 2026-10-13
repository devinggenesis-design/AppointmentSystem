import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Scissors, Menu, X } from "lucide-react";
import "../components/common/CustomerNavBar.css";

const SHOP_NAME = "Gentlemen's Barbershop";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/services", label: "Services" },
  { to: "/contacts", label: "Contacts" },
];

export default function CustomerNavBar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="cnav">
      <div className="cnav__inner">
        <Link to="/" className="cnav__brand" onClick={close}>
          <span className="cnav__logo">
            <Scissors size={18} />
          </span>
          {SHOP_NAME}
        </Link>

        <button
          className="cnav__toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`cnav__menu ${open ? "open" : ""}`}>
          <ul>
            {links.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={close}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <Link to="/booking" className="cnav__book" onClick={close}>
            Book Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
