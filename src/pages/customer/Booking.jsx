import { useEffect, useState } from "react";
import {
  Check,
  CalendarDays,
  Clock,
  Scissors,
  User,
  Phone,
} from "lucide-react";
import { peso } from "./Services";
import useServices from "../../hooks/useServices";
import "./Booking.css";

const times = [];
for (let h = 10; h < 20; h++) {
  times.push(
    `${String(h).padStart(2, "0")}:00`,
    `${String(h).padStart(2, "0")}:30`,
  );
}

const initial = { service: "", date: "", time: "", name: "", phone: "" };

const localISO = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const formatTime = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

const formatDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export default function Booking() {
  "use no memo";

  const { services, loading } = useServices();
  const [form, setForm] = useState(initial);
  const [booked, setBooked] = useState(null);
  const [error, setError] = useState("");
  const [takenTimes, setTakenTimes] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const today = localISO();
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const selectedService = services.find((s) => s.id === form.service);

  const loadTaken = async (date) => {
    if (!date) {
      setTakenTimes([]);
      return;
    }
    try {
      const res = await fetch(`/api/appointments/slots?date=${date}`);
      if (res.ok) setTakenTimes(await res.json());
    } catch {
      setTakenTimes([]);
    }
  };

  useEffect(() => {
    loadTaken(form.date);
  }, [form.date]);

  const setField = (name, value) => {
    setError("");
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "date" ? { time: "" } : {}),
    }));
  };

  const update = (e) => setField(e.target.name, e.target.value);

  const timeDisabled = (t) =>
    !form.date ||
    takenTimes.includes(t) ||
    (form.date === today && toMinutes(t) <= nowMinutes);

  const submit = async (e) => {
    e.preventDefault();

    if (!selectedService) return setError("Please choose a service.");
    if (!form.date) return setError("Please choose a date.");
    if (!form.time) return setError("Please choose a time.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          service: selectedService.name,
          price: selectedService.price,
          date: form.date,
          time: form.time,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(
          data.message || "Couldn't save your booking. Please try again.",
        );
        if (res.status === 409) {
          setField("time", "");
          loadTaken(form.date);
        }
        return;
      }

      setBooked(data);
      setForm(initial);
      setTakenTimes([]);
    } catch {
      setError("Can't reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (booked) {
    return (
      <section className="booking-page">
        <div className="booking-done" role="status">
          <div className="booking-done__icon">
            <Check size={34} />
          </div>
          <h1>You're booked, {booked.name}!</h1>
          <p>Please arrive 5 minutes early. Payment is at the shop.</p>

          <dl className="booking-done__details">
            <div>
              <dt>Service</dt>
              <dd>
                {booked.service} · {peso(booked.price)}
              </dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{formatDate(booked.date)}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{formatTime(booked.time)}</dd>
            </div>
          </dl>

          <button
            className="booking-btn booking-btn--ghost"
            onClick={() => setBooked(null)}
          >
            Book another
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="booking-page">
      <header className="booking-hero">
        <span className="booking-eyebrow">Reserve your chair</span>
        <h1>Book an appointment</h1>
        <p>Choose a service and a time. Payment is at the shop.</p>
      </header>

      <div className="booking-layout">
        <form className="booking-form" onSubmit={submit}>
          <div className="booking-step">
            <h2>
              <span>1</span> Choose a service
            </h2>
            {loading && <p className="booking-hint">Loading services...</p>}
            <div className="booking-services">
              {services.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  className={`booking-service ${form.service === s.id ? "active" : ""}`}
                  onClick={() => setField("service", s.id)}
                  aria-pressed={form.service === s.id}
                >
                  <strong>{s.name}</strong>
                  <span>{peso(s.price)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="booking-step">
            <h2>
              <span>2</span> Pick a date and time
            </h2>

            <label className="booking-field" htmlFor="date">
              <span>Date</span>
              <input
                id="date"
                name="date"
                type="date"
                min={today}
                value={form.date}
                onChange={update}
                required
              />
            </label>

            <div className="booking-field">
              <span>Time</span>
              {!form.date ? (
                <p className="booking-hint">
                  Choose a date to see available times.
                </p>
              ) : (
                <div className="booking-times">
                  {times.map((t) => (
                    <button
                      type="button"
                      key={t}
                      className={`booking-time ${form.time === t ? "active" : ""}`}
                      disabled={timeDisabled(t)}
                      onClick={() => setField("time", t)}
                      aria-pressed={form.time === t}
                    >
                      {formatTime(t)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="booking-step">
            <h2>
              <span>3</span> Your details
            </h2>

            <div className="booking-row">
              <label className="booking-field" htmlFor="name">
                <span>Full name</span>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Juan Dela Cruz"
                  value={form.name}
                  onChange={update}
                  required
                />
              </label>

              <label className="booking-field" htmlFor="phone">
                <span>Mobile number</span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="0917 123 4567"
                  value={form.phone}
                  onChange={update}
                  required
                />
              </label>
            </div>
          </div>

          {error && (
            <p role="alert" className="booking-error">
              {error}
            </p>
          )}

          <button type="submit" className="booking-btn" disabled={submitting}>
            {submitting ? "Booking..." : "Confirm booking"}
          </button>
        </form>

        <aside className="booking-summary">
          <h2>Your booking</h2>

          <ul>
            <li>
              <Scissors size={18} />
              <div>
                <span>Service</span>
                <strong>
                  {selectedService ? selectedService.name : "Not selected"}
                </strong>
              </div>
            </li>
            <li>
              <CalendarDays size={18} />
              <div>
                <span>Date</span>
                <strong>
                  {form.date ? formatDate(form.date) : "Not selected"}
                </strong>
              </div>
            </li>
            <li>
              <Clock size={18} />
              <div>
                <span>Time</span>
                <strong>
                  {form.time ? formatTime(form.time) : "Not selected"}
                </strong>
              </div>
            </li>
            <li>
              <User size={18} />
              <div>
                <span>Name</span>
                <strong>{form.name || "Not entered"}</strong>
              </div>
            </li>
            <li>
              <Phone size={18} />
              <div>
                <span>Mobile</span>
                <strong>{form.phone || "Not entered"}</strong>
              </div>
            </li>
          </ul>

          <div className="booking-total">
            <span>Total</span>
            <strong>
              {selectedService ? peso(selectedService.price) : "—"}
            </strong>
          </div>
        </aside>
      </div>
    </section>
  );
}
