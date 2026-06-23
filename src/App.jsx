import { useState } from "react";
import { WEBHOOKS, IS_TEST_MODE } from "./config/webhooks";

const DOCTOR_CATEGORIES = [
  "Emergency",
  "Urgent",
  "Routine",
  "General",
  "Cardiology",
  "Respiratory",
  "Neurology",
];

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "triage", label: "Patient Triage" },
  { id: "admin-register", label: "Admin Register Doctor" },
  { id: "appointments", label: "Appointments" },
  { id: "history", label: "My History" },
  { id: "profile", label: "Profile" },
];

function cleanValue(value) {
  if (!value) return "";
  return String(value).replace(/^=+/, "").trim();
}

function getUrgencyClass(urgency) {
  const level = cleanValue(urgency).toLowerCase();
  if (level.includes("high") || level.includes("emergency")) return "urgency-high";
  if (level.includes("medium") || level.includes("moderate")) return "urgency-medium";
  return "urgency-low";
}

function getMedicalRecommendation(urgency) {
  const level = cleanValue(urgency).toLowerCase();
  if (level.includes("high") || level.includes("emergency")) {
    return "Go to Emergency Department immediately.";
  }
  if (level.includes("medium") || level.includes("moderate")) {
    return "Visit a clinic or doctor within 24 hours.";
  }
  return "Monitor symptoms and rest. Visit clinic if symptoms worsen.";
}

function ClientHeader({ activePage, onNavigate }) {
  return (
    <header className="client-header">
      <div className="header-inner">
        <div className="brand" onClick={() => onNavigate("home")} role="button" tabIndex={0}>
          <div className="brand-icon">+</div>
          <div>
            <strong>MedCare</strong>
            <span>Patient Portal</span>
          </div>
        </div>

        <nav className="main-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-link ${activePage === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-user">
          <button type="button" className="emergency-btn">Emergency</button>
          <div className="user-chip">
            <div className="avatar">AA</div>
            <span>Ahmad Ali</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function HomePage({ onNavigate }) {
  return (
    <div className="page-content">
      <section className="hero">
        <div className="hero-text">
          <h1>Welcome back, Ahmad</h1>
          <p>How can we help you today? Use our AI symptom checker for quick health guidance.</p>
          <button type="button" className="hero-btn" onClick={() => onNavigate("triage")}>
            Check My Symptoms
          </button>
        </div>
        <div className="hero-card">
          <div className="hero-stat">
            <span className="hero-stat-num">3</span>
            <span className="hero-stat-label">Past Triage Checks</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">1</span>
            <span className="hero-stat-label">Upcoming Appointment</span>
          </div>
        </div>
      </section>

      <section className="quick-actions">
        <div className="section-head">
          <h2>Quick Actions</h2>
          <p>Everything you need, one tap away</p>
        </div>
        <div className="action-grid">
          <button type="button" className="action-card accent-blue" onClick={() => onNavigate("triage")}>
            <span className="action-icon-wrap">🩺</span>
            <strong>Symptom Check</strong>
            <small>AI-powered triage</small>
          </button>
          <button type="button" className="action-card accent-teal" onClick={() => onNavigate("appointments")}>
            <span className="action-icon-wrap">📅</span>
            <strong>Book Appointment</strong>
            <small>Schedule a visit</small>
          </button>
          <button type="button" className="action-card accent-purple" onClick={() => onNavigate("history")}>
            <span className="action-icon-wrap">📋</span>
            <strong>My History</strong>
            <small>View past checks</small>
          </button>
          <button type="button" className="action-card accent-green" onClick={() => onNavigate("doctors")}>
            <span className="action-icon-wrap">👨‍⚕️</span>
            <strong>Find Doctor</strong>
            <small>Browse specialists</small>
          </button>
        </div>
      </section>

      <section className="services-row">
        <button type="button" className="service-link" onClick={() => onNavigate("health")}>My Health</button>
        <button type="button" className="service-link" onClick={() => onNavigate("pharmacy")}>Pharmacy</button>
        <button type="button" className="service-link" onClick={() => onNavigate("billing")}>My Bills</button>
        <button type="button" className="service-link" onClick={() => onNavigate("help")}>Help & Support</button>
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

function TriagePage({
  symptoms,
  setSymptoms,
  patientEmail,
  setPatientEmail,
  patientPhone,
  setPatientPhone,
  appointmentDate,
  setAppointmentDate,
  appointmentTime,
  setAppointmentTime,
  loading,
  result,
  error,
  onSubmit,
}) {
  const medicalRecommendation = result ? getMedicalRecommendation(result.urgency) : "";

  return (
    <div className="page-content">
      <div className="page-title">
        <h1>AI Symptom Check</h1>
        <p>Describe how you feel and receive an AI-assisted triage assessment with appointment booking.</p>
      </div>

      <div className="workflow-strip">
        <span>Sensor → AI Triage Engine → Actuator</span>
        <span className="workflow-detail">
          Patient symptoms and appointment preference → Triage classification and doctor matching → Appointment assignment and medical recommendation
        </span>
      </div>

      <div className="feature-strip">
        <div className="feature-pill">
          <strong>Sensor:</strong> Patient symptoms and appointment preference
        </div>
        <div className="feature-pill">
          <strong>AI Processing:</strong> Triage classification and doctor matching
        </div>
        <div className="feature-pill">
          <strong>Actuator:</strong> Appointment assignment and medical recommendation
        </div>
      </div>

      <div className="triage-grid">
        <section className="card sensor-panel">
          <div className="card-header">
            <span className="section-badge sensor-badge">Sensor</span>
            <h3>Sensor Input: Patient Symptom / Patient Case</h3>
          </div>
          <p className="helper-text">
            This input acts as the sensor because it captures patient health information and appointment preferences.
          </p>
          <form className="triage-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="symptoms">Symptoms</label>
              <textarea
                id="symptoms"
                rows="6"
                placeholder="Example: I have had a fever and sore throat for 2 days..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="patient-email">Patient Email</label>
                <input
                  id="patient-email"
                  type="email"
                  placeholder="e.g. ahmad.ali@email.com"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="patient-phone">Patient Phone</label>
                <input
                  id="patient-phone"
                  type="tel"
                  placeholder="e.g. +60 12-345 6789"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="appointment-date">Preferred Appointment Date</label>
                <input
                  id="appointment-date"
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="appointment-time">Preferred Appointment Time</label>
                <input
                  id="appointment-time"
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Analyzing..." : "Submit Symptoms"}
            </button>
          </form>
        </section>

        <div className="triage-output-stack">
          <section className="card actuator-panel">
            <div className="card-header">
              <span className="section-badge actuator-badge">Actuator</span>
              <h3>Actuator Output: Medical Recommendation</h3>
            </div>

            {loading && (
              <div className="output-placeholder loading-state">
                <div className="spinner"></div>
                <p>Analyzing your symptoms...</p>
              </div>
            )}

            {error && !loading && (
              <div className="error-card">
                <strong>Something went wrong</strong>
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && !result && (
              <div className="output-placeholder">
                <span className="placeholder-icon">💬</span>
                <p>Your triage result will appear here after you submit your symptoms.</p>
              </div>
            )}

            {result && !loading && (
              <div className="result-body">
                <div className="result-row">
                  <span className="result-label">Urgency</span>
                  <span className={`urgency-badge ${getUrgencyClass(result.urgency)}`}>
                    {cleanValue(result.urgency) || "N/A"}
                  </span>
                </div>
                <div className="result-row">
                  <span className="result-label">Category</span>
                  <span className="result-value">{cleanValue(result.category) || "N/A"}</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Reasoning</span>
                  <p className="result-text">{cleanValue(result.reasoning) || "N/A"}</p>
                </div>
                <div className="result-row">
                  <span className="result-label">Rule Triggered</span>
                  <span className="result-value">{cleanValue(result.rule_triggered) || "N/A"}</span>
                </div>
                <div className="recommendation-row">
                  <span className="result-label">Medical Recommendation</span>
                  <p className="recommendation-text">{medicalRecommendation}</p>
                </div>
              </div>
            )}
          </section>

          <section className="card appointment-panel">
            <div className="card-header">
              <span className="section-badge appointment-badge">Actuator</span>
              <h3>Actuator Output: Appointment Assignment</h3>
            </div>
            <p className="helper-text">
              The system automatically assigns a suitable doctor based on urgency category and doctor availability.
            </p>

            {!loading && !error && !result && (
              <div className="output-placeholder output-placeholder-compact">
                <span className="placeholder-icon">📅</span>
                <p>Appointment assignment will appear here after triage is complete.</p>
              </div>
            )}

            {result && !loading && (
              <div className="result-body">
                <div className="result-row">
                  <span className="result-label">Assigned Doctor Name</span>
                  <span className="result-value">{cleanValue(result.doctor_name) || "N/A"}</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Doctor Email</span>
                  <span className="result-value">{cleanValue(result.doctor_email) || "N/A"}</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Appointment Date</span>
                  <span className="result-value">{cleanValue(result.appointment_date) || "N/A"}</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Appointment Time</span>
                  <span className="result-value">{cleanValue(result.appointment_time) || "N/A"}</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Appointment Status</span>
                  <span className="appointment-status">{cleanValue(result.appointment_status) || "N/A"}</span>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

const INITIAL_DOCTOR_FORM = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  category: "",
  availability: "",
};

function AdminRegisterDoctorPage({ form, setForm, loading, success, error, onSubmit }) {
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="page-content">
      <div className="page-title">
        <h1>Admin Register Doctor</h1>
        <p>Register doctors into the database for AI appointment assignment.</p>
      </div>

      <div className="workflow-strip">
        <span>Admin Input → Doctor Database → Auto Assignment Preparation</span>
        <span className="workflow-detail">Register doctors for future AI booking workflow</span>
      </div>

      <section className="info-banner admin-info-card">
        <div className="info-banner-icon">👨‍⚕️</div>
        <div>
          <h3>How This Fits the System</h3>
          <p className="admin-info-text">
            Admin registers doctors into the database. These doctors will later be used by the AI
            appointment booking workflow to automatically assign a suitable doctor based on urgency
            category and specialization.
          </p>
        </div>
      </section>

      <section className="card admin-form-card">
        <div className="card-header">
          <span className="section-badge admin-badge">Admin</span>
          <h3>Doctor Registration Form</h3>
        </div>
        <p className="helper-text">Fill in doctor details to save them to the Supabase doctors table via n8n.</p>

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

        <form className="admin-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Doctor Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Dr. Lee Wei Ming"
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
              placeholder="e.g. dr.lee@medcare.com"
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

          <div className="form-group">
            <label htmlFor="specialization">Specialization</label>
            <input
              id="specialization"
              name="specialization"
              type="text"
              placeholder="e.g. General Medicine"
              value={form.specialization}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-row">
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
                {DOCTOR_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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
                <option value="available">Available</option>
                <option value="not_available">Not Available</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Registering..." : "Register Doctor"}
          </button>
        </form>
      </section>
    </div>
  );
}

function HistoryPage({ email, setEmail, loading, error, history, hasLoaded, onLoad }) {
  return (
    <div className="page-content">
      <div className="page-title">
        <h1>My Triage History</h1>
        <p>View your past symptom checks, triage results, and appointment history.</p>
      </div>

      <section className="card history-search-card">
        <form className="history-search-form" onSubmit={onLoad}>
          <div className="form-group history-email-group">
            <label htmlFor="history-email">Enter your email to view appointment history</label>
            <input
              id="history-email"
              type="email"
              placeholder="e.g. ahmad.ali@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <button type="submit" className="history-load-btn" disabled={loading}>
            {loading ? "Loading..." : "Load History"}
          </button>
        </form>
      </section>

      {error && (
        <div className="error-card history-error">
          <strong>Unable to load history</strong>
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

function PlaceholderPage({ pageId }) {
  const pages = {
    health: {
      title: "My Health",
      subtitle: "Your personal health summary and records.",
      cards: [
        { label: "Blood Type", value: "O+" },
        { label: "Last Check-up", value: "15 May 2025" },
        { label: "Allergies", value: "Penicillin" },
        { label: "Chronic Conditions", value: "None" },
      ],
    },
    appointments: {
      title: "My Appointments",
      subtitle: "View and manage your upcoming visits.",
      rows: [
        ["20 Jun 2025, 10:00 AM", "Dr. Lee Wei Ming", "General Checkup", "Confirmed"],
        ["05 Jul 2025, 2:30 PM", "Dr. Tan Mei Yee", "Follow-up", "Pending"],
      ],
      cols: ["Date & Time", "Doctor", "Type", "Status"],
    },
    doctors: {
      title: "Find a Doctor",
      subtitle: "Browse available doctors and specialists.",
      rows: [
        ["Dr. Lee Wei Ming", "General Medicine", "Mon–Fri", "Book"],
        ["Dr. Tan Mei Yee", "Pediatrics", "Mon–Sat", "Book"],
        ["Dr. Wong Kah Wai", "Cardiology", "Tue–Thu", "Book"],
        ["Dr. Kumar Raj", "Emergency", "24/7", "Walk-in"],
      ],
      cols: ["Doctor", "Specialty", "Available", "Action"],
    },
    pharmacy: {
      title: "My Pharmacy",
      subtitle: "Your prescriptions and medication orders.",
      rows: [
        ["Paracetamol 500mg", "2 tablets, 3x daily", "Active", "Refill"],
        ["Amoxicillin 250mg", "1 capsule, 2x daily", "Completed", "—"],
        ["Vitamin D 1000IU", "1 tablet daily", "Active", "Refill"],
      ],
      cols: ["Medication", "Dosage", "Status", "Action"],
    },
    billing: {
      title: "My Bills",
      subtitle: "View your payment history and outstanding bills.",
      rows: [
        ["15 May 2025", "General Checkup", "RM 120.00", "Paid"],
        ["02 Jun 2025", "Lab Test", "RM 85.00", "Paid"],
        ["10 Jun 2025", "Consultation", "RM 60.00", "Pending"],
      ],
      cols: ["Date", "Description", "Amount", "Status"],
    },
    profile: {
      title: "My Profile",
      subtitle: "Manage your personal information.",
      cards: [
        { label: "Full Name", value: "Ahmad bin Ali" },
        { label: "Email", value: "ahmad.ali@email.com" },
        { label: "Phone", value: "+60 12-345 6789" },
        { label: "Member Since", value: "Jan 2024" },
      ],
    },
    help: {
      title: "Help & Support",
      subtitle: "Get assistance with the patient portal.",
      rows: [
        ["How to use Symptom Check", "Guide", "Read"],
        ["Book an appointment", "Guide", "Read"],
        ["Contact support", "support@medcare.com", "Email"],
        ["Emergency hotline", "999", "Call"],
      ],
      cols: ["Topic", "Details", "Action"],
    },
  };

  const page = pages[pageId];

  if (page.cards) {
    return (
      <div className="page-content">
        <div className="page-title">
          <h1>{page.title}</h1>
          <p>{page.subtitle}</p>
        </div>
        <div className="info-card-grid">
          {page.cards.map((card) => (
            <div key={card.label} className="info-card">
              <span className="info-label">{card.label}</span>
              <span className="info-value">{card.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-title">
        <h1>{page.title}</h1>
        <p>{page.subtitle}</p>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {page.cols.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {page.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState("home");
  const [symptoms, setSymptoms] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [doctorForm, setDoctorForm] = useState(INITIAL_DOCTOR_FORM);
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [doctorSuccess, setDoctorSuccess] = useState("");
  const [doctorError, setDoctorError] = useState("");
  const [historyEmail, setHistoryEmail] = useState("");
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [history, setHistory] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!symptoms.trim()) {
      setError("Please enter your symptoms before submitting.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const triageUrl = IS_TEST_MODE ? WEBHOOKS.TRIAGE_TEST : WEBHOOKS.TRIAGE_PRODUCTION;

    try {
      const response = await fetch(triageUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: symptoms.trim(),
          patient_email: patientEmail.trim(),
          patient_phone: patientPhone.trim(),
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      if (err.message.includes("Failed to fetch")) {
        setError(
          "Unable to reach the backend. Check that n8n is running, the webhook URL is correct, and CORS is allowed."
        );
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDoctorSubmit(e) {
    e.preventDefault();

    setDoctorLoading(true);
    setDoctorSuccess("");
    setDoctorError("");

    const payload = {
      name: doctorForm.name.trim(),
      email: doctorForm.email.trim(),
      phone: doctorForm.phone.trim(),
      specialization: doctorForm.specialization.trim(),
      category: doctorForm.category,
      is_available: doctorForm.availability === "available",
    };

    const url = IS_TEST_MODE ? WEBHOOKS.REGISTER_DOCTOR_TEST : WEBHOOKS.REGISTER_DOCTOR_PRODUCTION;

    console.log("Webhook URL:", url);
    console.log("Payload:", payload);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      let result;
      try {
        result = await response.json();
      } catch {
        result = await response.text();
      }

      console.log("Response:", result);

      setDoctorSuccess("Doctor registered successfully");
      setDoctorForm(INITIAL_DOCTOR_FORM);
    } catch {
      setDoctorError("Failed to register doctor. Please check backend workflow.");
    } finally {
      setDoctorLoading(false);
    }
  }

  async function handleLoadHistory(e) {
    e.preventDefault();

    if (!historyEmail.trim()) {
      setHistoryError("Please enter your email address.");
      return;
    }

    setHistoryLoading(true);
    setHistoryError("");
    setHistory([]);
    setHistoryLoaded(false);

    const url = IS_TEST_MODE ? WEBHOOKS.HISTORY_TEST : WEBHOOKS.HISTORY_PRODUCTION;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_email: historyEmail.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      const records = Array.isArray(data.history) ? data.history : [];
      setHistory(records);
      setHistoryLoaded(true);
    } catch (err) {
      if (err.message.includes("Failed to fetch")) {
        setHistoryError(
          "Unable to reach the backend. Check that n8n is running, the webhook URL is correct, and CORS is allowed."
        );
      } else {
        setHistoryError(err.message || "Failed to load history. Please try again.");
      }
    } finally {
      setHistoryLoading(false);
    }
  }

  function renderPage() {
    switch (activePage) {
      case "home":
        return <HomePage onNavigate={setActivePage} />;
      case "triage":
        return (
          <TriagePage
            symptoms={symptoms}
            setSymptoms={setSymptoms}
            patientEmail={patientEmail}
            setPatientEmail={setPatientEmail}
            patientPhone={patientPhone}
            setPatientPhone={setPatientPhone}
            appointmentDate={appointmentDate}
            setAppointmentDate={setAppointmentDate}
            appointmentTime={appointmentTime}
            setAppointmentTime={setAppointmentTime}
            loading={loading}
            result={result}
            error={error}
            onSubmit={handleSubmit}
          />
        );
      case "history":
        return (
          <HistoryPage
            email={historyEmail}
            setEmail={setHistoryEmail}
            loading={historyLoading}
            error={historyError}
            history={history}
            hasLoaded={historyLoaded}
            onLoad={handleLoadHistory}
          />
        );
      case "admin-register":
        return (
          <AdminRegisterDoctorPage
            form={doctorForm}
            setForm={setDoctorForm}
            loading={doctorLoading}
            success={doctorSuccess}
            error={doctorError}
            onSubmit={handleDoctorSubmit}
          />
        );
      default:
        return <PlaceholderPage pageId={activePage} />;
    }
  }

  return (
    <div className="app">
      <ClientHeader activePage={activePage} onNavigate={setActivePage} />
      <main className="main-content">{renderPage()}</main>
      <footer className="client-footer">
        <p>For educational purposes only. Not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
}

export default App;
