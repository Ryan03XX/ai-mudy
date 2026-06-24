import { useAuth } from "../../context/AuthContext";
import { getUrgencyClass } from "../../utils/helpers";
import { useMyAppointments } from "../../hooks/useMyAppointments";

export default function AppointmentsPage() {
  const { userProfile } = useAuth();
  const { appointments, loading, error } = useMyAppointments(userProfile?.email);

  return (
    <div className="page-content">
      <div className="page-title">
        <h1>My Appointments</h1>
        <p>Your booked appointments for {userProfile?.email || "your account"}.</p>
      </div>

      {error && (
        <div className="error-card history-error">
          <strong>Unable to load appointments</strong>
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="card history-loading-card">
          <div className="output-placeholder loading-state">
            <div className="spinner"></div>
            <p>Loading your appointments...</p>
          </div>
        </div>
      )}

      {!loading && appointments.length === 0 && !error && (
        <div className="card history-empty-card">
          <p className="history-empty-text">No appointments found.</p>
        </div>
      )}

      {!loading && appointments.length > 0 && (
        <div className="card">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Appointment Date</th>
                  <th>Appointment Time</th>
                  <th>Doctor Name</th>
                  <th>Doctor Email</th>
                  <th>Urgency</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.appointmentDate}</td>
                    <td>{entry.appointmentTime}</td>
                    <td>{entry.doctorName}</td>
                    <td>{entry.doctorEmail}</td>
                    <td>
                      <span className={`urgency-badge ${getUrgencyClass(entry.urgency)}`}>
                        {entry.urgency}
                      </span>
                    </td>
                    <td>{entry.category}</td>
                    <td>
                      <span className="appointment-status">{entry.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
