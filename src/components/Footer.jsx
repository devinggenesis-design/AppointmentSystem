import { Link } from "react-router-dom";
import { Scissors, MapPin, Phone, Clock } from "lucide-react";
import "../components/common/Footer.css";

const SHOP_NAME = "Barbershop";

export default function Footer() {
  return (
    <footer className="cfoot">
      <div className="cfoot__inner">
        <div className="cfoot__brand">
          <Link to="/" className="cfoot__logo">
            <span>
              <Scissors size={18} />
            </span>
            {SHOP_NAME}
          </Link>
          <p>Sharp cuts, booked in a minute.</p>
        </div>

        <nav className="cfoot__col" aria-label="Footer">
          <h3>Pages</h3>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/products">Products</Link>
          <Link to="/booking">Book Now</Link>
          <Link to="/contacts">Contacts</Link>
        </nav>

        <div className="cfoot__col">
          <h3>Visit us</h3>
          <p>
            <MapPin size={16} /> 123 Kamuning Road, Quezon City
          </p>
          <p>
            <Phone size={16} />
            <a href="tel:+639171234567">0917 123 4567</a>
          </p>
          <p>
            <Clock size={16} /> Daily, 10:00 AM to 8:00 PM
          </p>
        </div>
      </div>

      <div className="cfoot__bottom">
        © {new Date().getFullYear()} {SHOP_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
