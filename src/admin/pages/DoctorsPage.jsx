import { useRef, useState } from "react";
import { WEBHOOKS, IS_TEST_MODE } from "../../config/webhooks";
import { downloadDoctorTemplate, parseDoctorExcelFile } from "../../utils/doctorExcel";
import {
  DOCTOR_AVAILABILITY_OPTIONS,
  DOCTOR_CATEGORIES,
  DOCTOR_SPECIALIZATIONS,
} from "../demoData";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  category: "",
  availability: "",
};

const REGISTER_DOCTOR_URL = IS_TEST_MODE
  ? WEBHOOKS.REGISTER_DOCTOR_TEST
  : WEBHOOKS.REGISTER_DOCTOR_PRODUCTION;

async function registerDoctor(payload) {
  const response = await fetch(REGISTER_DOCTOR_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }
}

export default function DoctorsPage() {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      specialization: form.specialization,
      category: form.category,
      availability: form.availability,
    };

    try {
      await registerDoctor(payload);
      setSuccess("Doctor registered successfully");
      setForm(INITIAL_FORM);
    } catch {
      setError("Failed to register doctor. Please check backend workflow.");
    } finally {
      setLoading(false);
    }
  }

  function handleDownloadTemplate() {
    downloadDoctorTemplate();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    setSelectedFileName(file ? file.name : "");
    setImportError("");
    setImportSuccess("");
  }

  async function handleImportExcel(e) {
    e.preventDefault();

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setImportError("Please choose an Excel file to import.");
      return;
    }

    setImportLoading(true);
    setImportError("");
    setImportSuccess("");

    try {
      const doctors = await parseDoctorExcelFile(file);
      let importedCount = 0;

      for (const doctor of doctors) {
        await registerDoctor(doctor);
        importedCount += 1;
      }

      setImportSuccess(`Successfully imported ${importedCount} doctor(s).`);
      setSelectedFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setImportError(err.message || "Failed to import doctors from Excel.");
    } finally {
      setImportLoading(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-title">
        <h1>Doctor Management</h1>
        <p>Register doctors into the database for AI appointment assignment.</p>
      </div>

      <section className="info-banner admin-info-card">
        <div className="info-banner-icon">👨‍⚕️</div>
        <div>
          <h3>How This Fits the System</h3>
          <p className="admin-info-text">
            Admin registers doctors into the database. These doctors will later be used by the AI
            appointment booking workflow to automatically assign a suitable doctor based on AI
            matching category and medical specialization.
          </p>
          <p className="helper-text admin-field-note">
            Specialization is the doctor&apos;s medical field. Category is used by the AI booking
            workflow to match patients to suitable doctors.
          </p>
        </div>
      </section>

      <section className="card admin-form-card admin-import-card">
        <div className="card-header admin-card-header-row">
          <div>
            <span className="section-badge admin-badge">Bulk</span>
            <h3>Import Doctors from Excel</h3>
          </div>
          <button type="button" className="secondary-btn admin-template-btn" onClick={handleDownloadTemplate}>
            Download Example Template
          </button>
        </div>

        <p className="helper-text">
          Upload an Excel file with columns: name, email, phone, specialization, category, availability.
          Use <strong>Available</strong> or <strong>Unavailable</strong> for availability.
        </p>

        {importSuccess && (
          <div className="success-card">
            <strong>Import Successful</strong>
            <p>{importSuccess}</p>
          </div>
        )}

        {importError && (
          <div className="error-card admin-error">
            <strong>Import Failed</strong>
            <p>{importError}</p>
          </div>
        )}

        <form className="admin-form admin-import-form" onSubmit={handleImportExcel}>
          <div className="form-group">
            <label htmlFor="doctor-excel-file">Excel File (.xlsx, .xls)</label>
            <input
              id="doctor-excel-file"
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              disabled={importLoading}
            />
            {selectedFileName && <p className="helper-text">Selected: {selectedFileName}</p>}
          </div>

          <button type="submit" className="submit-btn admin-submit-btn" disabled={importLoading}>
            {importLoading ? "Importing..." : "Import from Excel"}
          </button>
        </form>
      </section>

      <section className="card admin-form-card">
        <div className="card-header">
          <span className="section-badge admin-badge">Admin</span>
          <h3>Doctor Registration Form</h3>
        </div>
        <p className="helper-text">Submit doctor details to the n8n register-doctor webhook.</p>
        <p className="helper-text admin-field-note">
          Specialization is the doctor&apos;s medical field. Category is used by the AI booking
          workflow to match patients to suitable doctors.
        </p>

        {success && (
          <div className="success-card">
            <strong>Success</strong>
            <p>{success}</p>
          </div>
        )}

        {error && (
          <div className="error-card admin-error">
            <strong>Registration Failed</strong>
            <p>{error}</p>
          </div>
        )}

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Doctor Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Doctor Lee Wei Ming"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. doctor.lee@medcare.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="e.g. +60 12-345 6789"
              value={form.phone}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="specialization">Specialization</label>
              <select
                id="specialization"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="">Select specialization</option>
                {DOCTOR_SPECIALIZATIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="">Select category</option>
                {DOCTOR_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="availability">Availability</label>
            <select
              id="availability"
              name="availability"
              value={form.availability}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="">Select availability</option>
              {DOCTOR_AVAILABILITY_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-btn admin-submit-btn" disabled={loading}>
            {loading ? "Registering..." : "Register Doctor"}
          </button>
        </form>
      </section>
    </div>
  );
}
