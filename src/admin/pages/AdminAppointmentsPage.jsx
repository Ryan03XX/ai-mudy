import { useAdminAppointments } from "../../hooks/useAdminData";
import { getUrgencyClass } from "../../utils/helpers";

export default function AdminAppointmentsPage() {
  const { appointments, loading, error } = useAdminAppointments();

  return (
    <div className="admin-page">
      <div className="admin-page-title">
        <h1>Appointments</h1>
        <p>All patient appointments across the hospital.</p>
      </div>

      {error && (
        <div className="error-card history-error">
          <strong>Unable to load appointments</strong>
          <p>{error}</p>
        </div>
      )}

      <section className="card">
        {loading && (
          <div className="output-placeholder loading-state">
            <div className="spinner"></div>
            <p>Loading appointments...</p>
          </div>
        )}

        {!loading && appointments.length === 0 && !error && (
          <p className="helper-text">No appointments found in the database.</p>
        )}

        {!loading && appointments.length > 0 && (
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
                {appointments.map((item) => (
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
