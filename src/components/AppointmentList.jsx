import { Check, X } from "lucide-react";
import "./AppointmentList.css";

const formatDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatTime = (time) => {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
};

const STATUS_LABEL = {
  booked: "Booked",
  completed: "Completed",
  cancelled: "Cancelled",
};

function AppointmentList({ appointments, onComplete, onCancel }) {
  if (appointments.length === 0) {
    return (
      <div className="appt-empty">
        <p>No appointments found.</p>
        <span>Try changing your search or filters.</span>
      </div>
    );
  }

  return (
    <div className="appt-table-wrap">
      <table className="appt-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Service</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th className="appt-actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id}>
              <td data-label="Customer">
                <div className="appt-customer">{a.name}</div>
                <div className="appt-phone">{a.phone}</div>
              </td>
              <td data-label="Service">
                {a.service}
                <div className="appt-phone">₱{a.price}</div>
              </td>
              <td data-label="Date">{formatDate(a.date)}</td>
              <td data-label="Time">{formatTime(a.time)}</td>
              <td data-label="Status">
                <span className={`status-badge status-${a.status}`}>
                  {STATUS_LABEL[a.status]}
                </span>
              </td>
              <td data-label="Actions" className="appt-actions-col">
                {a.status === "booked" ? (
                  <div className="appt-actions">
                    <button
                      className="appt-btn appt-btn--done"
                      onClick={() => onComplete(a.id)}
                    >
                      <Check size={15} /> Done
                    </button>
                    <button
                      className="appt-btn appt-btn--cancel"
                      onClick={() => onCancel(a)}
                    >
                      <X size={15} /> Cancel
                    </button>
                  </div>
                ) : (
                  <span className="appt-none">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentList;
