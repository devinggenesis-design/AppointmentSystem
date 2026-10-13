import { Link } from "react-router-dom";
import {
  Scissors,
  Sparkles,
  Smile,
  Layers,
  Palette,
  ArrowRight,
} from "lucide-react";
import useServices from "../../hooks/useServices";
import "./Services.css";

export const peso = (n) => `₱${n.toLocaleString()}`;

const icons = {
  haircut: Scissors,
  shave: Sparkles,
  beard: Smile,
  combo: Layers,
  color: Palette,
};

export default function Services() {
  const { services, loading, error } = useServices();

  return (
    <section className="sv-page">
      <header className="sv-hero">
        <span className="sv-eyebrow">What we offer</span>
        <h1>Services &amp; prices</h1>
        <p>Prices are per visit. Pick a service, then choose your time.</p>
      </header>

      {loading && (
        <p style={{ maxWidth: 1100, margin: "0 auto 24px" }}>
          Loading services...
        </p>
      )}
      {error && (
        <p style={{ maxWidth: 1100, margin: "0 auto 24px", color: "#f06b6b" }}>
          {error}
        </p>
      )}
      {!loading && !error && services.length === 0 && (
        <p style={{ maxWidth: 1100, margin: "0 auto 24px" }}>
          No services available yet.
        </p>
      )}

      <ul className="sv-grid">
        {services.map((s) => {
          const Icon = icons[s.id] || Scissors;
          return (
            <li key={s.id} className="sv-card">
              <div className="sv-card__icon">
                <Icon size={22} />
              </div>

              <div className="sv-card__body">
                <h2>{s.name}</h2>
                <p>{s.desc}</p>
              </div>

              <div className="sv-card__foot">
                <span className="sv-card__price">{peso(s.price)}</span>
                <Link to="/booking" className="sv-card__book">
                  Book this <ArrowRight size={15} />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="sv-cta">
        <div>
          <h2>Ready when you are</h2>
          <p>Reserve your chair in a minute. Payment is at the shop.</p>
        </div>
        <Link to="/booking" className="sv-btn">
          Book a time <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
