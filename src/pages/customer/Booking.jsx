import { useState } from "react";
import { services, peso } from "./Services";

const times = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
const initial = { service: "", date: "", time: "", name: "", phone: "" };

export default function Booking() {
  const [form, setForm] = useState(initial);
  const [booked, setBooked] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    // TODO: send `form` to your API here
    setBooked({ ...form, service: services.find((s) => s.id === form.service) });
    setForm(initial);
  };

  if (booked) {
    return (
      <section>
        <h1>Booking</h1>
        <div className="notice" role="status">
          <h2>You're booked, {booked.name}</h2>
          <p>
            {booked.service.name} ({peso(booked.service.price)}) on {booked.date} at {booked.time}.
            We'll text {booked.phone} if anything changes.
          </p>
          <button className="btn btn--ghost" onClick={() => setBooked(null)}>Book another</button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h1>Booking</h1>
      <p>Choose a service and a time. Payment is at the shop.</p>

      <form className="form" onSubmit={submit}>
        <div className="field">
          <label htmlFor="service">Service</label>
          <select id="service" name="service" value={form.service} onChange={update} required>
            <option value="" disabled>Select a service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.name} - {peso(s.price)}</option>
            ))}
          </select>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="date">Date</label>
            <input id="date" name="date" type="date" min={today} value={form.date} onChange={update} required />
          </div>
          <div className="field">
            <label htmlFor="time">Time</label>
            <select id="time" name="time" value={form.time} onChange={update} required>
              <option value="" disabled>Select a time</option>
              {times.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" autoComplete="name" value={form.name} onChange={update} required />
        </div>
        <div className="field">
          <label htmlFor="phone">Mobile number</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={update} required />
        </div>

        <button type="submit" className="btn">Confirm booking</button>
      </form>
    </section>
  );
}