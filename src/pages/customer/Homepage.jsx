import { Link } from "react-router-dom";
import { CalendarCheck, Scissors, Clock, ArrowRight } from "lucide-react";
import "./Homepage.css";
import { peso } from "./Services";
import useServices from "../../hooks/useServices";

const steps = [
  {
    icon: Scissors,
    title: "Choose a service",
    text: "Pick the cut or grooming service you want.",
  },
  {
    icon: CalendarCheck,
    title: "Pick a time",
    text: "See open times and reserve your chair.",
  },
  {
    icon: Clock,
    title: "Walk in and sit down",
    text: "Arrive a few minutes early. No waiting in line.",
  },
];

export default function Homepage() {
  const { services } = useServices();
  return (
    <div className="home-page">
      <section className="home-hero">
        <span className="home-eyebrow">Barbershop</span>
        <h1>
          Sharp cuts.
          <br />
          <em>Booked in a minute.</em>
        </h1>
        <p className="home-hero__lead">
          Walk-ins are welcome, but a booked chair means no waiting. Choose a
          service, pick a time, and we'll have you ready.
        </p>
        <div className="home-hero__actions">
          <Link to="/booking" className="home-btn">
            Book a time <ArrowRight size={18} />
          </Link>
          <Link to="/services" className="home-btn home-btn--ghost">
            See prices
          </Link>
        </div>
      </section>

      <section className="home-section">
        <ul className="home-steps">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title}>
              <div className="home-steps__icon">
                <Icon size={22} />
              </div>
              <span className="home-steps__num">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section">
        <div className="home-head">
          <div>
            <span className="home-eyebrow">Popular</span>
            <h2>Most booked</h2>
          </div>
          <Link to="/services" className="home-link">
            All services <ArrowRight size={16} />
          </Link>
        </div>

        <ul className="home-services">
          {services.slice(0, 3).map((s) => (
            <li key={s.id} className="home-service">
              <div className="home-service__top">
                <span className="home-service__name">{s.name}</span>
                <span className="home-service__price">{peso(s.price)}</span>
              </div>
              <p>{s.desc}</p>
              <Link to="/booking" className="home-service__book">
                Book this <ArrowRight size={15} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section">
        <div className="home-cta">
          <h2>Ready for a fresh cut?</h2>
          <p>Reserve your chair now. Payment is at the shop.</p>
          <Link to="/booking" className="home-btn">
            Book a time <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
