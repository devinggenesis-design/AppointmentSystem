import { useState } from "react";

export default function Contacts() {
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    // TODO: send the message to your API here
    setSent(true);
    e.target.reset();
  };

  return (
    <section>
      <h1>Contacts</h1>
      <div className="contact-grid">
        <div>
          <ul className="contact-list">
            <li><strong>Address</strong>123 Kamuning Road, Quezon City</li>
            <li><strong>Phone</strong><a href="tel:+639171234567">0917 123 4567</a></li>
            <li><strong>Email</strong><a href="mailto:hello@kapitanbarber.ph">hello@kapitanbarber.ph</a></li>
            <li><strong>Hours</strong>Daily, 10:00 AM to 8:00 PM</li>
          </ul>
        </div>

        <div>
          <h2>Send a message</h2>
          {sent && <p className="notice" role="status">Message sent. We'll reply within a day.</p>}
          <form className="form" onSubmit={submit}>
            <div className="field">
              <label htmlFor="c-name">Name</label>
              <input id="c-name" name="name" required />
            </div>
            <div className="field">
              <label htmlFor="c-email">Email</label>
              <input id="c-email" name="email" type="email" required />
            </div>
            <div className="field">
              <label htmlFor="c-msg">Message</label>
              <textarea id="c-msg" name="message" required />
            </div>
            <button type="submit" className="btn">Send message</button>
          </form>
        </div>
      </div>
    </section>
  );
}