import { Link } from "react-router-dom";

export const services = [
  { id: "haircut", name: "Haircut", price: 250, minutes: 30, desc: "Cut, wash, and style." },
  { id: "fade", name: "Skin fade", price: 300, minutes: 45, desc: "Clean fade with detailed edging." },
  { id: "shave", name: "Hot towel shave", price: 200, minutes: 30, desc: "Straight-razor shave with a warm towel finish." },
  { id: "beard", name: "Beard trim", price: 150, minutes: 20, desc: "Shape and line-up." },
  { id: "combo", name: "Cut and beard", price: 380, minutes: 60, desc: "Any haircut plus a beard trim." },
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