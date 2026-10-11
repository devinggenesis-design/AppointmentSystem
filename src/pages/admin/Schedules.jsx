import { useEffect, useState } from "react";
import {
  CalendarOff,
  Plus,
  Trash2,
  Save,
  Check,
  Store,
  Users,
  Copy,
  UserPlus,
} from "lucide-react";
import ConfirmModal from "../../components/common/ConfirmModal";
import authFetch from "../../utils/authFetch";
import "./Schedules.css";

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const SLOT_OPTIONS = [15, 30, 45, 60];

const makeDay = (open, start = "09:00", end = "18:00") => ({
  open,
  start,
  end,
});

const DEFAULT_SCHEDULE = {
  slotMinutes: 30,
  hours: {
    monday: makeDay(true),
    tuesday: makeDay(true),
    wednesday: makeDay(true),
    thursday: makeDay(true),
    friday: makeDay(true),
    saturday: makeDay(true, "09:00", "17:00"),
    sunday: makeDay(false),
  },
  daysOff: [],
  employees: [],
};

/* ---------- Helpers ---------- */
const clone = (obj) => JSON.parse(JSON.stringify(obj));

const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const countSlots = (day, slotMinutes) => {
  if (!day.open) return 0;
  const diff = toMinutes(day.end) - toMinutes(day.start);
  return diff > 0 ? Math.floor(diff / slotMinutes) : 0;
};

const formatDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-PH", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
};

const findInvalidDay = (hours, owner) => {
  const bad = DAYS.find(({ key }) => {
    const d = hours[key];
    return d.open && toMinutes(d.end) <= toMinutes(d.start);
  });
  return bad
    ? `${owner}, ${bad.label}: closing time must be after opening time.`
    : "";
};

// Fills in anything missing, so empty or partial data from the server can't crash the page
const normalize = (data) => {
  const defaults = clone(DEFAULT_SCHEDULE);
  return {
    slotMinutes: data?.slotMinutes || defaults.slotMinutes,
    hours: { ...defaults.hours, ...(data?.hours || {}) },
    daysOff: Array.isArray(data?.daysOff) ? data.daysOff : [],
    employees: Array.isArray(data?.employees)
      ? data.employees.map((e) => ({
          ...e,
          hours: { ...defaults.hours, ...(e.hours || {}) },
          daysOff: Array.isArray(e.daysOff) ? e.daysOff : [],
        }))
      : [],
  };
};

/* ---------- Reusable: weekly hours ---------- */
function WeeklyHours({ hours, slotMinutes, onChange }) {
  return (
    <ul className="sched-days">
      {DAYS.map(({ key, label }) => {
        const day = hours[key];
        const slots = countSlots(day, slotMinutes);

        return (
          <li key={key} className={`sched-day ${day.open ? "" : "is-closed"}`}>
            <div className="sched-day__name">
              <label className="sched-switch">
                <input
                  type="checkbox"
                  checked={day.open}
                  onChange={(e) => onChange(key, { open: e.target.checked })}
                />
                <span className="sched-switch__track" />
              </label>
              <strong>{label}</strong>
            </div>

            {day.open ? (
              <div className="sched-day__times">
                <input
                  type="time"
                  value={day.start}
                  onChange={(e) => onChange(key, { start: e.target.value })}
                />
                <span>to</span>
                <input
                  type="time"
                  value={day.end}
                  onChange={(e) => onChange(key, { end: e.target.value })}
                />
                <em>{slots} slots</em>
              </div>
            ) : (
              <div className="sched-day__closed">Day off</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- Reusable: days off ---------- */
function DaysOff({ daysOff, onAdd, onRemove }) {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!date) {
      setError("Please choose a date for the day off.");
      return;
    }
    if (daysOff.some((d) => d.date === date)) {
      setError("That date is already marked as a day off.");
      return;
    }
    onAdd({ id: Date.now(), date, reason: reason.trim() || "Day off" });
    setDate("");
    setReason("");
    setError("");
  };

  const sorted = [...daysOff].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <div className="sched-add">
        <input
          type="date"
          value={date}
          min={todayISO()}
          onChange={(e) => {
            setDate(e.target.value);
            setError("");
          }}
        />
        <input
          type="text"
          placeholder="Reason (optional), e.g. Holiday"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button className="sched-btn sched-btn--gold" onClick={handleAdd}>
          <Plus size={16} /> Add
        </button>
      </div>

      {error && <div className="sched-inline-error">{error}</div>}

      {sorted.length === 0 ? (
        <div className="sched-empty">
          <CalendarOff size={28} />
          <p>No days off yet.</p>
        </div>
      ) : (
        <ul className="sched-off">
          {sorted.map((d) => (
            <li key={d.id}>
              <div>
                <strong>{formatDate(d.date)}</strong>
                <span>{d.reason}</span>
              </div>
              <button
                className="sched-remove"
                onClick={() => onRemove(d.id)}
                aria-label={`Remove ${formatDate(d.date)}`}
              >
                <Trash2 size={17} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/* ---------- Page ---------- */
function Schedules() {
  "use no memo";

  const [schedule, setSchedule] = useState(() => clone(DEFAULT_SCHEDULE));
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(DEFAULT_SCHEDULE),
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  const [view, setView] = useState("shop");
  const [selectedId, setSelectedId] = useState(null);
  const [empName, setEmpName] = useState("");
  const [empRole, setEmpRole] = useState("");
  const [empError, setEmpError] = useState("");
  const [toRemove, setToRemove] = useState(null);
  const [error, setError] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  /* ----- Load from the database ----- */
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await authFetch("/api/schedule");
        if (!res.ok) throw new Error();
        const data = normalize(await res.json());
        if (!active) return;
        setSchedule(data);
        setSavedSnapshot(JSON.stringify(data));
      } catch {
        if (active)
          setLoadError("Couldn't load the schedule. Is the server running?");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const hasChanges = JSON.stringify(schedule) !== savedSnapshot;

  const selected =
    schedule.employees.find((e) => e.id === selectedId) ||
    schedule.employees[0] ||
    null;

  // Any edit goes through here: clears messages and updates the schedule
  const change = (fn) => {
    setJustSaved(false);
    setError("");
    setSchedule(fn);
  };

  /* ----- Shop ----- */
  const updateShopDay = (key, changes) =>
    change((prev) => ({
      ...prev,
      hours: { ...prev.hours, [key]: { ...prev.hours[key], ...changes } },
    }));

  const updateSlot = (minutes) =>
    change((prev) => ({ ...prev, slotMinutes: Number(minutes) }));

  const addShopDayOff = (item) =>
    change((prev) => ({ ...prev, daysOff: [...prev.daysOff, item] }));

  const removeShopDayOff = (id) =>
    change((prev) => ({
      ...prev,
      daysOff: prev.daysOff.filter((d) => d.id !== id),
    }));

  /* ----- Employees ----- */
  const updateEmployee = (id, fn) =>
    change((prev) => ({
      ...prev,
      employees: prev.employees.map((e) => (e.id === id ? fn(e) : e)),
    }));

  const addEmployee = () => {
    const name = empName.trim();
    if (!name) {
      setEmpError("Please enter the employee's name.");
      return;
    }
    if (
      schedule.employees.some(
        (e) => e.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      setEmpError("An employee with that name already exists.");
      return;
    }

    const employee = {
      id: Date.now(),
      name,
      role: empRole.trim() || "Barber",
      hours: clone(schedule.hours), // starts with the shop's hours
      daysOff: [],
    };

    change((prev) => ({ ...prev, employees: [...prev.employees, employee] }));
    setSelectedId(employee.id);
    setEmpName("");
    setEmpRole("");
    setEmpError("");
  };

  const confirmRemoveEmployee = () => {
    if (!toRemove) return;
    const id = toRemove.id;
    change((prev) => ({
      ...prev,
      employees: prev.employees.filter((e) => e.id !== id),
    }));
    if (selectedId === id) setSelectedId(null);
    setToRemove(null);
  };

  const copyShopHours = () => {
    if (!selected) return;
    updateEmployee(selected.id, (e) => ({
      ...e,
      hours: clone(schedule.hours),
    }));
  };

  /* ----- Save / discard ----- */
  const handleSave = async () => {
    const shopError = findInvalidDay(schedule.hours, "Shop");
    if (shopError) {
      setError(shopError);
      return;
    }
    for (const emp of schedule.employees) {
      const empErr = findInvalidDay(emp.hours, emp.name);
      if (empErr) {
        setError(empErr);
        return;
      }
    }

    setSaving(true);
    try {
      const res = await authFetch("/api/schedule", {
        method: "PUT",
        body: JSON.stringify(schedule),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Couldn't save the schedule.");
        return;
      }

      setSavedSnapshot(JSON.stringify(schedule));
      setError("");
      setJustSaved(true);
    } catch {
      setError("Can't reach the server. Is it running?");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setSchedule(JSON.parse(savedSnapshot));
    setError("");
    setJustSaved(false);
  };

  /* ----- Loading / error screens (must stay AFTER all hooks) ----- */
  if (loading) {
    return (
      <div className="sched-page">
        <div className="sched-card sched-empty sched-empty--big">
          <p>Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="sched-page">
        <div className="sched-alert sched-alert--error">{loadError}</div>
      </div>
    );
  }

  return (
    <div className="sched-page">
      <div className="sched-header">
        <div>
          <h1>Schedules</h1>
          <p>Set the shop's hours and each employee's schedule.</p>
        </div>

        <div className="sched-header__actions">
          {hasChanges && (
            <button
              className="sched-btn sched-btn--ghost"
              onClick={handleDiscard}
              disabled={saving}
            >
              Discard
            </button>
          )}
          <button
            className="sched-btn sched-btn--primary"
            onClick={handleSave}
            disabled={!hasChanges || saving}
          >
            <Save size={16} /> {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      {error && <div className="sched-alert sched-alert--error">{error}</div>}
      {justSaved && !hasChanges && (
        <div className="sched-alert sched-alert--success">
          <Check size={16} /> Schedule saved.
        </div>
      )}

      {/* Tabs */}
      <div className="sched-tabs">
        <button
          className={view === "shop" ? "active" : ""}
          onClick={() => setView("shop")}
        >
          <Store size={16} /> Shop
        </button>
        <button
          className={view === "employees" ? "active" : ""}
          onClick={() => setView("employees")}
        >
          <Users size={16} /> Employees
          <span className="sched-tabs__count">{schedule.employees.length}</span>
        </button>
      </div>

      {/* ================= SHOP ================= */}
      {view === "shop" && (
        <>
          <section className="sched-card">
            <div className="sched-card__head">
              <div>
                <h2>Shop hours</h2>
                <span>Customers can only book inside these times.</span>
              </div>

              <label className="sched-slot">
                <span>Slot length</span>
                <select
                  value={schedule.slotMinutes}
                  onChange={(e) => updateSlot(e.target.value)}
                >
                  {SLOT_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m} min
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <WeeklyHours
              hours={schedule.hours}
              slotMinutes={schedule.slotMinutes}
              onChange={updateShopDay}
            />
          </section>

          <section className="sched-card">
            <div className="sched-card__head">
              <div>
                <h2>Shop days off</h2>
                <span>Holidays when the whole shop is closed.</span>
              </div>
            </div>

            <DaysOff
              daysOff={schedule.daysOff}
              onAdd={addShopDayOff}
              onRemove={removeShopDayOff}
            />
          </section>
        </>
      )}

      {/* ================= EMPLOYEES ================= */}
      {view === "employees" && (
        <div className="sched-emp">
          <aside className="sched-card sched-emp__list">
            <h2>Team</h2>

            {schedule.employees.length === 0 ? (
              <p className="sched-emp__hint">
                No employees yet. Add your first one below.
              </p>
            ) : (
              <ul>
                {schedule.employees.map((emp) => (
                  <li key={emp.id}>
                    <button
                      className={selected?.id === emp.id ? "active" : ""}
                      onClick={() => setSelectedId(emp.id)}
                    >
                      <span className="sched-emp__avatar">
                        {emp.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="sched-emp__info">
                        <strong>{emp.name}</strong>
                        <small>{emp.role}</small>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="sched-emp__form">
              <input
                type="text"
                placeholder="Name"
                value={empName}
                onChange={(e) => {
                  setEmpName(e.target.value);
                  setEmpError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && addEmployee()}
              />
              <input
                type="text"
                placeholder="Role (e.g. Barber)"
                value={empRole}
                onChange={(e) => setEmpRole(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addEmployee()}
              />
              {empError && <div className="sched-inline-error">{empError}</div>}
              <button
                className="sched-btn sched-btn--gold"
                onClick={addEmployee}
              >
                <UserPlus size={16} /> Add employee
              </button>
            </div>
          </aside>

          <div className="sched-emp__detail">
            {!selected ? (
              <section className="sched-card sched-empty sched-empty--big">
                <Users size={32} />
                <p>Add an employee to set their schedule.</p>
              </section>
            ) : (
              <>
                <section className="sched-card">
                  <div className="sched-card__head">
                    <div className="sched-emp__title">
                      <span className="sched-emp__avatar sched-emp__avatar--lg">
                        {selected.name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <h2>{selected.name}</h2>
                        <span>{selected.role}</span>
                      </div>
                    </div>

                    <div className="sched-emp__actions">
                      <button
                        className="sched-btn sched-btn--ghost"
                        onClick={copyShopHours}
                      >
                        <Copy size={16} /> Copy shop hours
                      </button>
                      <button
                        className="sched-btn sched-btn--danger"
                        onClick={() => setToRemove(selected)}
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </div>

                  <WeeklyHours
                    hours={selected.hours}
                    slotMinutes={schedule.slotMinutes}
                    onChange={(key, changes) =>
                      updateEmployee(selected.id, (e) => ({
                        ...e,
                        hours: {
                          ...e.hours,
                          [key]: { ...e.hours[key], ...changes },
                        },
                      }))
                    }
                  />
                </section>

                <section className="sched-card">
                  <div className="sched-card__head">
                    <div>
                      <h2>{selected.name}'s days off</h2>
                      <span>
                        Leave or absences. Shop holidays already apply to
                        everyone.
                      </span>
                    </div>
                  </div>

                  <DaysOff
                    daysOff={selected.daysOff}
                    onAdd={(item) =>
                      updateEmployee(selected.id, (e) => ({
                        ...e,
                        daysOff: [...e.daysOff, item],
                      }))
                    }
                    onRemove={(id) =>
                      updateEmployee(selected.id, (e) => ({
                        ...e,
                        daysOff: e.daysOff.filter((d) => d.id !== id),
                      }))
                    }
                  />
                </section>
              </>
            )}
          </div>
        </div>
      )}

      {/* Remove employee confirmation */}
      <ConfirmModal
        open={!!toRemove}
        danger
        icon={<Trash2 size={26} />}
        title="Remove employee?"
        message={
          toRemove
            ? `${toRemove.name} and their schedule will be removed. This takes effect when you save.`
            : ""
        }
        confirmText="Yes, remove"
        cancelText="Keep"
        onConfirm={confirmRemoveEmployee}
        onCancel={() => setToRemove(null)}
      />
    </div>
  );
}

export default Schedules;
