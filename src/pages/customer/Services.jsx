import { Link } from "react-router-dom";

export const services = [
  { id: "haircut", name: "Haircut", price: 150, desc: "Cut, wash, and style." },
  { id: "shave", name: "Shave", price: 100, desc: "Clean shave with a warm towel finish." },
  { id: "beard", name: "Beard Trim", price: 120, desc: "Shape and line-up." },
  { id: "combo", name: "Haircut + Beard Trim", price: 250, desc: "Any haircut plus a beard trim." },
  { id: "color", name: "Hair Color", price: 600, desc: "Single-color treatment." },
];

export const peso = (n) => `₱${n.toLocaleString()}`;

export default function Services() {
  return (
    <section>
      <h1>Services</h1>
      <p>Prices are per visit. Pick a service, then choose your time.</p>

      <ul className="price-list">
        {services.map((s) => (
          <li key={s.id} className="price-list__item">
            <span className="price-list__name">{s.name}</span>
            <span className="price-list__price">{peso(s.price)}</span>
            <p className="price-list__desc">{s.desc}</p>
          </li>
        ))}
      </ul>

      <Link to="/booking" className="btn">Book a time</Link>
    </section>
  );
}