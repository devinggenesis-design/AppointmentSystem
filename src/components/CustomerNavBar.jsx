import { NavLink, Link } from "react-router-dom";
import { Scissors, Home, CalendarDays, Contact } from "lucide-react";
import logo from "../assets/logo-emblem.png";
import "../components/common/CustomerNavBar.css";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/services", label: "Services" },
  { to: "/contacts", label: "Contacts" },
  { to: "/products", label: "Products" },
];

export default function CustomerNavBar() {
  return (
    <>
      <header className="cnav">
        <div className="cnav__inner">
          <Link to="/" className="cnav__brand">
            <span className="cnav__logo">
              <img src={logo} alt="Gentleman Barbershop" />
            </span>
            <span className="cnav__name">
              <small>GENTLEMAN</small>
              BARBERSHOP
            </span>
          </Link>

          <nav className="cnav__menu">
            <ul>
              {links.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <Link to="/booking" className="cnav__book">
              Book Now
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
