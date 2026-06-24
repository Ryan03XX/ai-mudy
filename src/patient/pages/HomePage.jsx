import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  countPastTriageChecks,
  countUpcomingAppointments,
} from "../../api/myAppointments";
import { useMyAppointments } from "../../hooks/useMyAppointments";

export default function HomePage() {
  const { userProfile } = useAuth();
  const { appointments, loading } = useMyAppointments(userProfile?.email);
  const firstName = userProfile?.name?.split(" ")[0] || "Patient";

  const pastTriageCount = loading ? "—" : countPastTriageChecks(appointments);
  const upcomingCount = loading ? "—" : countUpcomingAppointments(appointments);

  return (
    <div className="page-content">
      <section className="hero">
        <div className="hero-text">
          <h1>Welcome back, {firstName}</h1>
          <p>How can we help you today? Use our AI symptom checker for quick health guidance.</p>
          <Link to="/triage" className="hero-btn">
            Check My Symptoms
          </Link>
        </div>
        <div className="hero-card">
          <div className="hero-stat">
            <span className="hero-stat-num">{pastTriageCount}</span>
            <span className="hero-stat-label">Past Triage Checks</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">{upcomingCount}</span>
            <span className="hero-stat-label">Upcoming Appointment</span>
          </div>
        </div>
      </section>

      <section className="quick-actions">
        <div className="section-head">
          <h2>Quick Actions</h2>
          <p>Everything you need, one tap away</p>
        </div>
        <div className="action-grid patient-action-grid">
          <Link to="/triage" className="action-card accent-blue">
            <span className="action-icon-wrap">🩺</span>
            <strong>Symptom Check</strong>
            <small>AI-powered triage</small>
          </Link>
          <Link to="/appointments" className="action-card accent-teal">
            <span className="action-icon-wrap">📅</span>
            <strong>My Appointments</strong>
            <small>View your history</small>
          </Link>
        </div>
      </section>

      <section className="info-banner">
        <div className="info-banner-icon">💡</div>
        <div>
          <h3>Your Health Tips</h3>
          <ul>
            <li>Stay hydrated — drink at least 8 glasses of water daily.</li>
            <li>If symptoms worsen after a triage check, seek medical attention promptly.</li>
            <li>Keep your appointment reminders enabled in your profile settings.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
