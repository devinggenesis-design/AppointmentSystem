import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Check, Send } from "lucide-react";
import "./Contacts.css";

const details = [
  {
    icon: MapPin,
    label: "Address",
    value: "123 Kamuning Road, Quezon City",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "0917 123 4567",
    href: "tel:+639171234567",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@kapitanbarber.ph",
    href: "mailto:hello@kapitanbarber.ph",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Daily, 10:00 AM to 8:00 PM",
  },
];

export default function Contacts() {
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    e.target.reset();
  };

  return (
    <section className="ct-page">
      <header className="ct-hero">
        <span className="ct-eyebrow">Get in touch</span>
        <h1>Contact us</h1>
        <p>Visit the shop, give us a call, or send a message.</p>
      </header>

      <div className="ct-grid">
        <aside className="ct-card">
          <h2>Find us</h2>
          <ul className="ct-list">
            {details.map(({ icon: Icon, label, value, href }) => (
              <li key={label}>
                <div className="ct-list__icon">
                  <Icon size={20} />
                </div>
                <div>
                  <span>{label}</span>
                  {href ? <a href={href}>{value}</a> : <strong>{value}</strong>}
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <div className="ct-card">
          <h2>Send a message</h2>

          {sent && (
            <p className="ct-notice" role="status">
              <Check size={18} /> Message sent. We'll reply within a day.
            </p>
          )}

          <form
            className="ct-form"
            onSubmit={submit}
            onChange={() => sent && setSent(false)}
          >
            <label className="ct-field" htmlFor="c-name">
              <span>Name</span>
              <input
                id="c-name"
                name="name"
                autoComplete="name"
                placeholder="Juan Dela Cruz"
                required
              />
            </label>

            <label className="ct-field" htmlFor="c-email">
              <span>Email</span>
              <input
                id="c-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="ct-field" htmlFor="c-msg">
              <span>Message</span>
              <textarea
                id="c-msg"
                name="message"
                rows={5}
                placeholder="How can we help?"
                required
              />
            </label>

            <button type="submit" className="ct-btn">
              <Send size={17} /> Send message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
