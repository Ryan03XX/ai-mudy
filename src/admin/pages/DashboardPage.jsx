import { useAdminDashboard } from "../../hooks/useAdminData";
import { DEMO_PAYMENTS } from "../demoData";

export default function DashboardPage() {
  const pendingPaymentsFallback = DEMO_PAYMENTS.filter((p) => p.status === "Pending").length;
  const { stats, loading, error } = useAdminDashboard(pendingPaymentsFallback);

  const dashboardStats = [
    {
      label: "Total Doctors",
      value: loading ? "—" : String(stats?.totalDoctors ?? 0),
      icon: "👨‍⚕️",
    },
    {
      label: "Today Appointments",
      value: loading ? "—" : String(stats?.todayAppointments ?? 0),
      icon: "📅",
    },
    {
      label: "Pending Payments",
      value: loading ? "—" : String(stats?.pendingPayments ?? pendingPaymentsFallback),
      icon: "💳",
    },
    {
      label: "Completed Triage Cases",
      value: loading ? "—" : String(stats?.completedTriageCases ?? 0),
      icon: "🩺",
    },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-title">
        <h1>Dashboard</h1>
        <p>Overview of hospital operations and AI triage activity.</p>
      </div>

      {error && (
        <div className="error-card history-error">
          <strong>Unable to load dashboard data</strong>
          <p>{error}</p>
        </div>
      )}

      <div className="admin-stat-grid">
        {dashboardStats.map((stat) => (
          <div key={stat.label} className="admin-stat-card">
            <span className="admin-stat-icon">{stat.icon}</span>
            <span className="admin-stat-value">{stat.value}</span>
            <span className="admin-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="card admin-info-card">
        <h3>System Overview</h3>
        <p className="helper-text">
          Dashboard stats are loaded from n8n. Pending payments use demo data if the backend does not return a value.
        </p>
      </div>
    </div>
  );
}
