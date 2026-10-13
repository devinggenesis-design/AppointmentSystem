export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
export const CANCELLED = ["cancelled", "canceled", "Cancelled", "Canceled"];

export const to12h = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${String(h % 12 || 12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${
    h >= 12 ? "PM" : "AM"
  }`;
};

export const to24h = (t = "") => {
  const m = String(t)
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return t;
  let h = Number(m[1]);
  const ap = m[3]?.toUpperCase();
  if (ap === "PM" && h < 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
};

const statusToClient = (s = "") => {
  const v = s.toLowerCase();
  if (v === "completed") return "completed";
  if (v === "cancelled" || v === "canceled") return "cancelled";
  return "booked";
};

export const statusToDb = (s) => (s === "booked" ? "confirmed" : s);

export const toClient = (b) => ({
  _id: b._id,
  name: b.customerName,
  phone: b.phone,
  service: b.serviceName,
  price: b.totalPrice,
  date: String(b.bookingDate).slice(0, 10),
  time: to24h(b.bookingTime),
  status: statusToClient(b.status),
});
