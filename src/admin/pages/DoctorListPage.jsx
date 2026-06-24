import { useEffect, useMemo, useState } from "react";
import { useAdminDoctors } from "../../hooks/useAdminData";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function DoctorListPage() {
  const { doctors, loading, error } = useAdminDoctors();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.max(1, Math.ceil(doctors.length / pageSize));

  const paginatedDoctors = useMemo(() => {
    const start = (page - 1) * pageSize;
    return doctors.slice(start, start + pageSize);
  }, [doctors, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  function handlePageSizeChange(e) {
    setPageSize(Number(e.target.value));
    setPage(1);
  }

  const rangeStart = doctors.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, doctors.length);

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
          <>
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
                  {paginatedDoctors.map((doctor) => (
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

            <div className="admin-pagination">
              <div className="admin-pagination-info">
                Showing {rangeStart}-{rangeEnd} of {doctors.length}
              </div>

              <div className="admin-pagination-controls">
                <label className="admin-page-size-label" htmlFor="doctor-page-size">
                  Rows per page
                </label>
                <select
                  id="doctor-page-size"
                  className="admin-page-size-select"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="secondary-btn admin-page-btn"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page <= 1}
                >
                  Previous
                </button>
                <span className="admin-page-indicator">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  className="secondary-btn admin-page-btn"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
