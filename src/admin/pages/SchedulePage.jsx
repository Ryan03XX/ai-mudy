import { useMemo, useState } from "react";
import { buildUrgentRescheduleQueue } from "../../api/adminApi";
import { useAdminAppointments } from "../../hooks/useAdminData";
import { getUrgencyClass } from "../../utils/helpers";

export default function SchedulePage() {
  const { appointments, loading, error } = useAdminAppointments();
  const [doctorFilter, setDoctorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [rescheduleQueue, setRescheduleQueue] = useState([]);

  const urgentQueue = useMemo(() => buildUrgentRescheduleQueue(appointments), [appointments]);
  const queue = rescheduleQueue.length > 0 ? rescheduleQueue : urgentQueue;

  const doctors = [...new Set(appointments.map((item) => item.doctor))];
  const statuses = [...new Set(appointments.map((item) => item.status))];

  const filtered = useMemo(() => {
    return appointments.filter((item) => {
      const matchDoctor = !doctorFilter || item.doctor === doctorFilter;
      const matchStatus = !statusFilter || item.status === statusFilter;
      const matchDate = !dateFilter || item.date === dateFilter;
      return matchDoctor && matchStatus && matchDate;
    });
  }, [appointments, doctorFilter, statusFilter, dateFilter]);

  function handleReschedule(id) {
    setRescheduleQueue((prev) => {
      const base = prev.length > 0 ? prev : urgentQueue;
      return base.map((item) =>
        item.id === id ? { ...item, status: "Rescheduled" } : item
      );
    });
  }

  return (
    <div className="admin-page">
      <div className="admin-page-title">
        <h1>Appointment Schedule</h1>
        <p>Monitor appointments and manage urgent reschedule requests.</p>
      </div>

      <section className="card urgent-queue-card">
        <div className="card-header">
          <h3>Urgent Reschedule Queue</h3>
        </div>
        <p className="helper-text">
          Loaded from appointments with urgent override flag in the database.
        </p>

        {queue.length === 0 && !loading && (
          <p className="helper-text">No urgent reschedule requests found.</p>
        )}

        {queue.length > 0 && (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Original Patient</th>
                  <th>Original Date</th>
                  <th>Original Time</th>
                  <th>New Urgent Patient</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((item) => (
                  <tr key={item.id}>
                    <td>{item.originalPatient}</td>
                    <td>{item.originalDate}</td>
                    <td>{item.originalTime}</td>
                    <td>{item.newUrgentPatient}</td>
                    <td>
                      <span
                        className={`appointment-status ${item.status === "Rescheduled" ? "payment-paid" : "payment-pending"}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-action-btn"
                        disabled={item.status === "Rescheduled"}
                        onClick={() => handleReschedule(item.id)}
                      >
                        Reschedule
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {error && (
        <div className="error-card history-error">
          <strong>Unable to load appointments</strong>
          <p>{error}</p>
        </div>
      )}

      <section className="card admin-filter-card">
        <div className="admin-filter-row">
          <div className="form-group">
            <label htmlFor="doctor-filter">Filter by Doctor</label>
            <select
              id="doctor-filter"
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
            >
              <option value="">All Doctors</option>
              {doctors.map((doctor) => (
                <option key={doctor} value={doctor}>
                  {doctor}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status-filter">Filter by Status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date-filter">Filter by Date</label>
            <input
              id="date-filter"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="card">
        {loading && (
          <div className="output-placeholder loading-state">
            <div className="spinner"></div>
            <p>Loading appointments...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && !error && (
          <p className="helper-text">No appointments found.</p>
        )}

        {!loading && filtered.length > 0 && (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Appointment ID</th>
                  <th>Patient Name</th>
                  <th>Patient Email</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Urgency</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.patientName}</td>
                    <td>{item.patientEmail}</td>
                    <td>{item.doctor}</td>
                    <td>{item.date}</td>
                    <td>{item.time}</td>
                    <td>
                      <span className={`urgency-badge ${getUrgencyClass(item.urgency)}`}>
                        {item.urgency}
                      </span>
                    </td>
                    <td>
                      <span className="appointment-status">{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
