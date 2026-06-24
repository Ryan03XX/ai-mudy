export default function ReportsPage() {
  const triageStats = [
    { label: "High / Emergency", value: 12 },
    { label: "Medium", value: 21 },
    { label: "Low", value: 14 },
  ];

  const appointmentStats = [
    { label: "General", value: 10 },
    { label: "Cardiology", value: 6 },
    { label: "Respiratory", value: 8 },
    { label: "Emergency", value: 4 },
  ];

  const paymentStats = [
    { label: "Paid", value: 18 },
    { label: "Pending", value: 5 },
    { label: "Failed", value: 2 },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-title">
        <h1>Reports</h1>
        <p>Demo statistics for triage, appointments, and payments.</p>
      </div>

      <div className="admin-report-grid">
        <section className="card">
          <h3>Triage Cases by Urgency</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Urgency Level</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {triageStats.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card">
          <h3>Appointments by Category</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {appointmentStats.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card">
          <h3>Payment Status Breakdown</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {paymentStats.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
