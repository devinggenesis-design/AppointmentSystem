import { useMemo, useState } from "react";
import { Search, CalendarX } from "lucide-react";
import AppointmentList from "../../components/AppointmentList";
import ConfirmModal from "../../components/common/ConfirmModal";
import { sampleAppointments, todayISO } from "../../data/sampleAppointments";
import "./Appointments.css";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "booked", label: "Booked" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function Appointments() {
  const [appointments, setAppointments] = useState(sampleAppointments);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");
  const [toCancel, setToCancel] = useState(null);

  const today = todayISO();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return appointments
      .filter((a) => {
        const matchesSearch =
          !q || a.name.toLowerCase().includes(q) || a.phone.includes(q);
        const matchesStatus = status === "all" || a.status === status;
        const matchesDate = !date || a.date === date;
        return matchesSearch && matchesStatus && matchesDate;
      })
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [appointments, search, status, date]);

  const stats = {
    today: appointments.filter(
      (a) => a.date === today && a.status !== "cancelled",
    ).length,
    upcoming: appointments.filter((a) => a.status === "booked").length,
    completed: appointments.filter((a) => a.status === "completed").length,
  };

  const updateStatus = (id, newStatus) =>
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );

  const handleComplete = (id) => updateStatus(id, "completed");

  const handleConfirmCancel = () => {
    if (!toCancel) return;
    updateStatus(toCancel.id, "cancelled");
    setToCancel(null);
  };

  return (
    <div>
      <div className="appts-header">
        <h1>Appointments</h1>
        <p>Manage your customers' bookings.</p>
      </div>

      <div className="appts-stats">
        <div className="appts-stat">
          <span>Today</span>
          <strong>{stats.today}</strong>
        </div>
        <div className="appts-stat">
          <span>Upcoming</span>
          <strong>{stats.upcoming}</strong>
        </div>
        <div className="appts-stat">
          <span>Completed</span>
          <strong>{stats.completed}</strong>
        </div>
      </div>

      <div className="appts-toolbar">
        <div className="appts-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <input
          type="date"
          className="appts-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {date && (
          <button className="appts-clear" onClick={() => setDate("")}>
            Clear date
          </button>
        )}
      </div>

      <div className="appts-tabs">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={status === f.value ? "active" : ""}
            onClick={() => setStatus(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <AppointmentList
        appointments={filtered}
        onComplete={handleComplete}
        onCancel={setToCancel}
      />

      <ConfirmModal
        open={!!toCancel}
        danger
        icon={<CalendarX size={26} />}
        title="Cancel appointment?"
        message={
          toCancel
            ? `${toCancel.name}'s ${toCancel.service} booking will be cancelled and the time slot becomes available again.`
            : ""
        }
        confirmText="Yes, cancel it"
        cancelText="Keep it"
        onConfirm={handleConfirmCancel}
        onCancel={() => setToCancel(null)}
      />
    </div>
  );
}

export default Appointments;
