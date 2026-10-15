import { Link } from "react-router-dom";
import {
  Scissors,
  Smile,
  CalendarCheck,
  CalendarDays,
  MapPin,
  ShoppingBag,
  Info,
  Phone,
  ArrowRight,
} from "lucide-react";
import { peso } from "./Services";
import useServices from "../../hooks/useServices";
import serviceIcons from "../../data/serviceIcons";
import hairstyles from "../../data/hairstyles";
import "./Homepage.css";

const quickLinks = [
  { label: "Browse Services", icon: Scissors, to: "/services" },
  { label: "My Appointments", icon: CalendarCheck },
  { label: "Find a Branch", icon: MapPin, to: "/contacts" },
  { label: "Book Appt", icon: CalendarDays, to: "/booking" },
  { label: "Hairstyle Guide", icon: Smile, href: "#hairstyles" },
  { label: "Shop Products", icon: ShoppingBag },
  { label: "Who We Are", icon: Info, href: "#about" },
  { label: "Contact Us", icon: Phone, to: "/contacts" },
  { label: "Shop Products", icon: ShoppingBag, to: "/products" },
];

const stats = [
  { value: "35+", label: "Years of Service" },
  { value: "40+", label: "Branches" },
  { value: "500K+", label: "Happy Clients" },
];

function QuickLink({ label, icon: Icon, to, href }) {
  const inner = (
    <>
      <span className="hm-tile__icon">
        <Icon size={20} />
      </span>
      <span className="hm-tile__label">{label}</span>
    </>
  );

  if (to)
    return (
      <Link to={to} className="hm-tile">
        {inner}
      </Link>
    );
  if (href)
    return (
      <a href={href} className="hm-tile">
        {inner}
      </a>
    );
  return (
    <span className="hm-tile hm-tile--soon" title="Coming soon">
      {inner}
    </span>
  );
}

export default function Homepage() {
  const { services, loading } = useServices();

  return (
    <div className="hm-page">
      <section className="hm-hero">
        <h1>
          Redefining the
          <br />
          everyday standard.
        </h1>
        <p>
          Crafted for confidence. Look and feel better from head to toe with our
          range of premium services.
        </p>
        <div className="hm-hero__actions">
          <Link to="/booking" className="hm-btn">
            Book Now
          </Link>
          <Link to="/services" className="hm-btn hm-btn--outline">
            Our Services
          </Link>
        </div>
      </section>

      <section className="hm-section">
        <h2 className="hm-title">What can we get you today?</h2>
        <div className="hm-tiles">
          {quickLinks.map((q) => (
            <QuickLink key={q.label} {...q} />
          ))}
        </div>
      </section>

      <section className="hm-section">
        <div className="hm-head">
          <div>
            <h2 className="hm-title">Our Services</h2>
            <p className="hm-sub">Upgrade your style.</p>
          </div>
          <Link to="/services" className="hm-viewall">
            View All ({services.length})
          </Link>
        </div>

        {loading && <p className="hm-sub">Loading services...</p>}

        <ul className="hm-scroll">
          {services.map((s) => {
            const Icon = serviceIcons[s.icon] || Scissors;
            const more =
              (s.subServices?.length || 0) + (s.priceTiers?.length || 0);
            return (
              <li key={s.id} className="hm-service">
                <span className="hm-service__icon">
                  <Icon size={26} />
                </span>
                <small className="hm-service__cat">
                  {s.category} · {s.durationMinutes}m
                </small>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
                <div className="hm-service__foot">
                  <div>
                    <strong>{peso(s.price)}</strong>
                    {more > 0 && <em>+ more options</em>}
                  </div>
                  <Link to={`/booking?service=${s.id}`} className="hm-chip">
                    Book <ArrowRight size={13} />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="hm-section" id="hairstyles">
        <div className="hm-head">
          <div>
            <h2 className="hm-title">Hairstyle Guide</h2>
            <p className="hm-sub">Find your signature look.</p>
          </div>
          <Link to="/services" className="hm-viewall">
            View All ({hairstyles.length})
          </Link>
        </div>

        <ul className="hm-scroll">
          {hairstyles.map(({ id, name, icon: Icon, tagline, image }) => (
            <li
              key={id}
              className="hm-style"
              style={{
                backgroundImage: `url("${image}"), linear-gradient(160deg, #2f2a20, #151515)`,
              }}
            >
              <span className="hm-style__icon">
                <Icon size={20} />
              </span>
              <div className="hm-style__text">
                <strong>{name}</strong>
                <span>{tagline}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="hm-section" id="about">
        <div className="hm-about">
          <div className="hm-badges">
            <span className="hm-badge">Who We Are</span>
            <span className="hm-badge hm-badge--outline">Since 1988</span>
          </div>
          <h2>The best of the craft — built on trust.</h2>
          <p>
            Since 1988, we've built more than barbershops. We've built trust: a
            place where craft is respected, conversations come naturally, and
            every cut is delivered with care.
          </p>

          <dl className="hm-stats">
            {stats.map((s) => (
              <div key={s.label}>
                <dt>{s.value}</dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>

          <Link to="/contacts" className="hm-know">
            Know More <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="hm-section">
        <div className="hm-head">
          <h2 className="hm-title">Our Location</h2>
          <Link to="/contacts" className="hm-viewall">
            View Details
          </Link>
        </div>

        <div className="hm-location">
          <span className="hm-location__icon">
            <MapPin size={22} />
          </span>
          <div>
            <strong>SM Mall of Asia</strong>
            <span>Pasay City</span>
          </div>
          <Link to="/booking" className="hm-book">
            Book
          </Link>
        </div>
      </section>

      <section className="hm-section">
        <div className="hm-call">
          <p>Prefer to book by phone?</p>
          <h2>Call our concierge now!</h2>
          <a href="tel:+63289436853" className="hm-call__btn">
            <Phone size={20} /> (02) 89-GENTLE
          </a>
        </div>
      </section>
    </div>
  );
}
