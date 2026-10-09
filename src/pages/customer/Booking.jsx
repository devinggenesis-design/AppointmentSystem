import { useState } from "react";
import { services, peso } from "./Services";
import { addAppointment, isSlotTaken } from "../../data/appointmentStore";

const times = [];
for (let h = 10; h < 20; h++) {
  times.push(`${String(h).padStart(2, "0")}:00`, `${String(h).padStart(2, "0")}:30`);
}
const initial = { service: "", date: "", time: "", name: "", phone: "" };

export default function Booking() {
  const [form, setForm] = useState(initial);
  const [booked, setBooked] = useState(null);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const update = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    if (isSlotTaken(form.date, form.time)) {
      setError("That time is already booked. Please choose another time.");
      return;
    }
    const service = services.find((s) => s.id === form.service);
    const saved = addAppointment({
      name: form.name,
      phone: form.phone,
      service: service.name,
      price: service.price,
      date: form.date,
      time: form.time,
    });
    setBooked(saved);
    setForm(initial);
  };

  if (booked) {
    return (
      <section>
        <h1>Booking</h1>
        <div className="notice" role="status">
          <h2>You're booked, {booked.name}</h2>
          <p>
            {booked.service} ({peso(booked.price)}) on {booked.date} at {booked.time}.
            Please arrive 5 minutes early.
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

        {error && <p role="alert" style={{ color: "var(--gold)", margin: 0 }}>{error}</p>}
        <button type="submit" className="btn">Confirm booking</button>
      </form>
    </section>
  );
}