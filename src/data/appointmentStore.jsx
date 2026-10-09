import { sampleAppointments } from "./sampleAppointments";

// Customer bookings are added straight into the admin's own
// `sampleAppointments` list, so the admin pages see them without any change.
// They are also saved in localStorage so they survive a page reload.
const KEY = "barbershop_customer_bookings";

function readSaved() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

// Runs once when the app starts: put saved bookings back into the admin list.
readSaved().forEach((a) => {
  if (!sampleAppointments.some((x) => x.id === a.id)) sampleAppointments.push(a);
});

// Add a booking from the customer page (same fields the admin uses).
export function addAppointment({ name, phone, service, price, date, time }) {
  const id = sampleAppointments.reduce((max, a) => Math.max(max, a.id), 0) + 1;
  const appointment = { id, name, phone, service, price, date, time, status: "booked" };
  sampleAppointments.push(appointment);
  localStorage.setItem(KEY, JSON.stringify([...readSaved(), appointment]));
  return appointment;
}

// True if that date and time is already taken by a non-cancelled booking.
export function isSlotTaken(date, time) {
  return sampleAppointments.some(
    (a) => a.date === date && a.time === time && a.status !== "cancelled"
  );
}