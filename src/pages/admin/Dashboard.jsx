import { useEffect, useState } from "react";
import {
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  RefreshCw,
  Clock,
  Users,
  CalendarX,
} from "lucide-react";
import authFetch from "../../utils/authFetch";
import "./Dashboard.css";

const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

const formatTime = (time) => {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

const formatDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-PH", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const peso = (n) => `₱${Number(n || 0).toLocaleString("en-PH")}`;

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const STATUS_LABEL = {
  booked: "Booked",
  completed: "Completed",
  cancelled: "Cancelled",
};

const byDateTime = (a, b) => (a.date + a.time).localeCompare(b.date + b.time);

function Dashboard() {
  "use no memo";

  const [appointments, setAppointments] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const adminName = (() => {
    try {
      return JSON.parse(localStorage.getItem("adminInfo"))?.name || "Admin";
    } catch {
      return "Admin";
    }
  })();

  const load = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError("");
    try {
      const [apptRes, schedRes] = await Promise.all([
        authFetch("/api/appointments"),
        authFetch("/api/schedule"),
      ]);
      if (!apptRes.ok || !schedRes.ok) throw new Error();

      const appts = await apptRes.json();
      setAppointments(appts.map((a) => ({ ...a, id: a._id })));
      setSchedule(await schedRes.json());
    } catch {
      setError("Couldn't load the dashboard. Is the server running?");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="dash-page">
        <div className="dash-card dash-center">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dash-page">
        <div className="dash-alert">{error}</div>
        <button className="dash-btn" onClick={() => load()}>
          <RefreshCw size={16} /> Try again
        </button>
      </div>
    );
  }

  const today = toISO(new Date());
  const active = appointments.filter((a) => a.status !== "cancelled");

  const todayList = active.filter((a) => a.date === today).sort(byDateTime);
  const upcoming = appointments
    .filter((a) => a.status === "booked" && a.date > today)
    .sort(byDateTime);
  const completedToday = todayList.filter((a) => a.status === "completed");
  const nextUp = todayList.find((a) => a.status === "booked");

  const stats = [
    { label: "Today", value: todayList.length, icon: CalendarCheck },
    { label: "Upcoming", value: upcoming.length, icon: CalendarClock },
    {
      label: "Completed today",
      value: completedToday.length,
      icon: CheckCircle2,
    },
  ];

  const dayKey = DAY_KEYS[new Date().getDay()];
  const shopDay = schedule?.hours?.[dayKey];
  const shopOff = schedule?.daysOff?.find((d) => d.date === today);
  const shopOpen = !!shopDay?.open && !shopOff;

  const working = shopOpen
    ? (schedule?.employees || []).filter((e) => {
        const day = e.hours?.[dayKey];
        const onLeave = e.daysOff?.some((d) => d.date === today);
        return day?.open && !onLeave;
      })
    : [];

  return (
    <div className="dash-page">
      <div className="dash-header">
        <div>
          <h1>
            {greeting()}, {adminName}
          </h1>
          <p>
            {new Date().toLocaleDateString("en-PH", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <button
          className="dash-btn"
          onClick={() => load(true)}
          disabled={refreshing}
        >
          <RefreshCw size={16} className={refreshing ? "spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="dash-stats">
        {stats.map(({ label, value, icon: Icon }) => (
          <div className="dash-card dash-stat" key={label}>
            <div className="dash-stat__icon">
              <Icon size={20} />
            </div>
            <div>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="dash-col">
          {nextUp && (
            <section className="dash-next">
              <span>Next up</span>
              <h2>
                {formatTime(nextUp.time)} · {nextUp.name}
              </h2>
              <p>
                {nextUp.service} · {nextUp.phone}
              </p>
            </section>
          )}

          <section className="dash-card">
            <div className="dash-card__head">
              <h2>Today's appointments</h2>
              <span>{todayList.length} total</span>
            </div>

            {todayList.length === 0 ? (
              <div className="dash-empty">
                <CalendarX size={28} />
                <p>No appointments today.</p>
              </div>
            ) : (
              <ul className="dash-list">
                {todayList.map((a) => (
                  <li key={a.id}>
                    <div className="dash-time">{formatTime(a.time)}</div>
                    <div className="dash-info">
                      <strong>{a.name}</strong>
                      <span>{a.service}</span>
                    </div>
                    <span className={`dash-badge dash-badge--${a.status}`}>
                      {STATUS_LABEL[a.status]}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="dash-card">
            <div className="dash-card__head">
              <h2>Upcoming</h2>
              <span>Next {Math.min(upcoming.length, 5)} bookings</span>
            </div>

            {upcoming.length === 0 ? (
              <div className="dash-empty">
                <CalendarClock size={28} />
                <p>No upcoming bookings.</p>
              </div>
            ) : (
              <ul className="dash-list">
                {upcoming.slice(0, 5).map((a) => (
                  <li key={a.id}>
                    <div className="dash-time">
                      {formatDate(a.date)}
                      <small>{formatTime(a.time)}</small>
                    </div>
                    <div className="dash-info">
                      <strong>{a.name}</strong>
                      <span>{a.service}</span>
                    </div>
                    <span className="dash-price">{peso(a.price)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="dash-col">
          <section className="dash-card">
            <div className="dash-card__head">
              <h2>Shop today</h2>
              <span className={`dash-pill ${shopOpen ? "open" : "closed"}`}>
                {shopOpen ? "Open" : "Closed"}
              </span>
            </div>

            <div className="dash-hours">
              <Clock size={18} />
              {shopOff ? (
                <span>{shopOff.reason || "Day off"}</span>
              ) : shopOpen ? (
                <span>
                  {formatTime(shopDay.start)} to {formatTime(shopDay.end)}
                </span>
              ) : (
                <span>Closed today</span>
              )}
            </div>
          </section>

          <section className="dash-card">
            <div className="dash-card__head">
              <h2>Working today</h2>
              <span>{working.length}</span>
            </div>

            {working.length === 0 ? (
              <div className="dash-empty">
                <Users size={28} />
                <p>
                  {shopOpen
                    ? "No employees scheduled."
                    : "The shop is closed today."}
                </p>
              </div>
            ) : (
              <ul className="dash-team">
                {working.map((e) => {
                  const day = e.hours[dayKey];
                  return (
                    <li key={e.id}>
                      <span className="dash-avatar">
                        {e.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="dash-info">
                        <strong>{e.name}</strong>
                        <span>
                          {formatTime(day.start)} to {formatTime(day.end)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
