import { useAuth } from "../../context/AuthContext";
import { cleanValue, getUrgencyClass } from "../../utils/helpers";
import { usePatientHistory } from "../../hooks/usePatientHistory";

export default function AppointmentsPage() {
  const { userProfile } = useAuth();
  const { history, loading, error } = usePatientHistory(userProfile?.email);
  const hasLoaded = !loading;

  return (
    <div className="page-content">
      <div className="page-title">
        <h1>My Appointments</h1>
        <p>Your triage and appointment history for {userProfile?.email || "your account"}.</p>
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
            <p>Loading your appointment history...</p>
          </div>
        </div>
      )}

      {!loading && hasLoaded && history.length === 0 && !error && (
        <div className="card history-empty-card">
          <p className="history-empty-text">No appointment history found.</p>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="card">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date Created</th>
                  <th>Symptoms</th>
                  <th>Urgency</th>
                  <th>Category</th>
                  <th>Appointment Date</th>
                  <th>Appointment Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr key={entry.id}>
                    <td>{cleanValue(entry.created_at) || "N/A"}</td>
                    <td className="history-symptoms-cell">{cleanValue(entry.patient_symptoms) || "N/A"}</td>
                    <td>
                      <span className={`urgency-badge ${getUrgencyClass(entry.urgency)}`}>
                        {cleanValue(entry.urgency) || "N/A"}
                      </span>
                    </td>
                    <td>{cleanValue(entry.category) || "N/A"}</td>
                    <td>{cleanValue(entry.appointment_date) || "N/A"}</td>
                    <td>{cleanValue(entry.appointment_time) || "N/A"}</td>
                    <td>
                      <span className="appointment-status">{cleanValue(entry.status) || "N/A"}</span>
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
