import { NavLink, Link, Outlet } from "react-router-dom";
import "./clientLay.css";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/services", label: "Services" },
  { to: "/booking", label: "Book" },
  { to: "/contacts", label: "Contacts" },
];

export default function ClientLay() {
  return (
    <div className="shell">
      <header className="site-header">
        <div className="wrap site-header__row">
          <Link to="/" className="brand">Barbershop</Link>
          <nav aria-label="Main">
            <ul className="nav">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.end} className="nav__link">
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="pole" aria-hidden="true" />
      </header>

      <main className="wrap main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="wrap site-footer__row">
          <p>© {new Date().getFullYear()} Barbershop</p>
          <p>Open daily, 10:00 AM to 8:00 PM</p>
        </div>
      </footer>
    </div>
  );
}