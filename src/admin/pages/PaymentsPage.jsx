import { DEMO_PAYMENTS } from "../demoData";

function getPaymentStatusClass(status) {
  if (status === "Paid") return "payment-paid";
  if (status === "Pending") return "payment-pending";
  return "payment-failed";
}

export default function PaymentsPage() {
  const totalRevenue = "RM 270.00";
  const pendingAmount = "RM 85.00";
  const paidTransactions = "2";

  return (
    <div className="admin-page">
      <div className="admin-page-title">
        <h1>Payment Records</h1>
        <p>Track patient payments and transaction status.</p>
      </div>

      <div className="admin-stat-grid admin-stat-grid-3">
        <div className="admin-stat-card">
          <span className="admin-stat-icon">💰</span>
          <span className="admin-stat-value">{totalRevenue}</span>
          <span className="admin-stat-label">Total Revenue</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">⏳</span>
          <span className="admin-stat-value">{pendingAmount}</span>
          <span className="admin-stat-label">Pending Amount</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">✅</span>
          <span className="admin-stat-value">{paidTransactions}</span>
          <span className="admin-stat-label">Paid Transactions</span>
        </div>
      </div>

      <section className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Patient Name</th>
                <th>Appointment ID</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_PAYMENTS.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.patientName}</td>
                  <td>{payment.appointmentId}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.method}</td>
                  <td>
                    <span className={`payment-status ${getPaymentStatusClass(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>{payment.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
