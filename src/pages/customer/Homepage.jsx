import { Link } from "react-router-dom";
import { services, peso } from "./Services";

export default function Homepage() {
  return (
    <>
      <section className="hero">
        <h1>Sharp cuts.<br />Booked in a minute.</h1>
        <p className="hero__lead">
          Walk-ins are welcome, but a booked chair means no waiting. Choose a service, pick a time, and we'll have you ready.
        </p>
        <div className="hero__actions">
          <Link to="/booking" className="btn">Book a time</Link>
          <Link to="/services" className="btn btn--ghost">See prices</Link>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Most booked</h2>
          <Link to="/services">All services</Link>
        </div>
        <ul className="price-list">
          {services.slice(0, 3).map((s) => (
            <li key={s.id} className="price-list__item">
              <span className="price-list__name">{s.name}</span>
              <span className="price-list__price">{peso(s.price)}</span>
              <p className="price-list__desc">{s.desc}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}