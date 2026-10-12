import { useEffect, useMemo, useState } from "react";
import { Search, CalendarX } from "lucide-react";
import AppointmentList from "../../components/AppointmentList";
import ConfirmModal from "../../components/common/ConfirmModal";
import authFetch from "../../utils/authFetch";
import "./Appointments.css";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "booked", label: "Booked" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
};

function Appointments() {
  "use no memo";

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");
  const [toCancel, setToCancel] = useState(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await authFetch("/api/appointments");
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!active) return;
        setAppointments(data.map((a) => ({ ...a, id: a._id })));
      } catch {
        if (active)
          setLoadError("Couldn't load appointments. Is the server running?");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

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

  const updateStatus = async (id, newStatus) => {
    setBusy(true);
    setActionError("");
    try {
      const res = await authFetch(`/api/appointments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (!res.ok) {
        setActionError(data.message || "Couldn't update the appointment.");
        return;
      }

      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: data.status } : a)),
      );
    } catch {
      setActionError("Can't reach the server. Is it running?");
    } finally {
      setBusy(false);
    }
  };

  const handleComplete = (id) => updateStatus(id, "completed");

  const handleConfirmCancel = async () => {
    if (!toCancel) return;
    const id = toCancel.id;
    setToCancel(null);
    await updateStatus(id, "cancelled");
  };

  if (loading) {
    return (
      <div className="appts-page">
        <div className="appts-header">
          <h1>Appointments</h1>
          <p>Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="appts-page">
        <div className="appts-header">
          <h1>Appointments</h1>
        </div>
        <div className="appts-error">{loadError}</div>
      </div>
    );
  }

  const today = todayISO();
  const stats = {
    today: appointments.filter(
      (a) => a.date === today && a.status !== "cancelled",
    ).length,
    upcoming: appointments.filter((a) => a.status === "booked").length,
    completed: appointments.filter((a) => a.status === "completed").length,
  };

  return (
    <div className="appts-page">
      <div className="appts-header">
        <h1>Appointments</h1>
        <p>Manage your customers' bookings.</p>
      </div>

      {actionError && <div className="appts-error">{actionError}</div>}

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

      <div className={busy ? "appts-busy" : ""}>
        <AppointmentList
          appointments={filtered}
          onComplete={handleComplete}
          onCancel={setToCancel}
        />
      </div>

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
