import { sampleAppointments } from "./sampleAppointments";

const KEY = "barbershop_appointments";

// Read all appointments (seeds the sample data the first time).
export function getAppointments() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore and fall back to sample data */
  }
  saveAppointments(sampleAppointments);
  return sampleAppointments;
}

// Save the full list (the admin calls this after changing a status).
export function saveAppointments(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

// Add a booking from the customer page. Same fields the admin already uses.
export function addAppointment({ name, phone, service, price, date, time }) {
  const list = getAppointments();
  const id = list.reduce((max, a) => Math.max(max, a.id), 0) + 1;
  const appointment = { id, name, phone, service, price, date, time, status: "booked" };
  saveAppointments([...list, appointment]);
  return appointment;
}

// True if that date and time is already taken by a non-cancelled booking.
export function isSlotTaken(date, time) {
  return getAppointments().some(
    (a) => a.date === date && a.time === time && a.status !== "cancelled"
  );
}