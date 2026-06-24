import { useAdminDoctors } from "../../hooks/useAdminData";

export default function DoctorListPage() {
  const { doctors, loading, error } = useAdminDoctors();

  return (
    <div className="admin-page">
      <div className="admin-page-title">
        <h1>Doctor List</h1>
        <p>All doctors registered in the hospital database.</p>
      </div>

      <section className="card">
        {error && (
          <div className="error-card admin-error">
            <strong>Unable to load doctors</strong>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="output-placeholder loading-state">
            <div className="spinner"></div>
            <p>Loading doctors...</p>
          </div>
        )}

        {!loading && !error && doctors.length === 0 && (
          <p className="helper-text">No doctors registered.</p>
        )}

        {!loading && doctors.length > 0 && (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Doctor Name</th>
                  <th>Specialization</th>
                  <th>Category</th>
                  <th>Availability</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.email}>
                    <td>{doctor.name}</td>
                    <td>{doctor.specialization}</td>
                    <td>{doctor.category}</td>
                    <td>{doctor.availability}</td>
                    <td>{doctor.email}</td>
                    <td>{doctor.phone}</td>
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
