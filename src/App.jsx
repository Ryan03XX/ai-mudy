import { useState } from "react";

// Production URL — activate workflow in n8n first (JSON has "active": false)
// const WEBHOOK_URL = "http://localhost:5678/webhook/882aae53-3dfb-4a02-8abc-d71abbb83d73";

// Test URL (use while editing workflow in n8n, no activation needed):
const WEBHOOK_URL = "http://localhost:5678/webhook-test/882aae53-3dfb-4a02-8abc-d71abbb83d73";

const PLACEHOLDER_HISTORY = [
  { date: "2025-06-10", symptoms: "Fever and sore throat for 2 days", urgency: "Medium", category: "Respiratory" },
  { date: "2025-06-08", symptoms: "Mild headache and fatigue", urgency: "Low", category: "General" },
  { date: "2025-06-05", symptoms: "Chest pain and shortness of breath", urgency: "High", category: "Cardiac" },
  { date: "2025-06-03", symptoms: "Persistent cough for 5 days", urgency: "Medium", category: "Respiratory" },
  { date: "2025-06-01", symptoms: "Minor skin rash", urgency: "Low", category: "Dermatology" },
];

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "triage", label: "Symptom Check" },
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

function TriagePage({ symptoms, setSymptoms, loading, result, error, onSubmit }) {
  const medicalRecommendation = result ? getMedicalRecommendation(result.urgency) : "";

  return (
    <div className="page-content">
      <div className="page-title">
        <h1>AI Symptom Check</h1>
        <p>Describe how you feel and receive an AI-assisted triage assessment.</p>
      </div>

      <div className="workflow-strip">
        <span>Sensor → AI Triage Engine → Actuator</span>
        <span className="workflow-detail">Patient symptoms → AI urgency classification → Medical recommendation</span>
      </div>

      <div className="feature-strip">
        <div className="feature-pill">
          <strong>Feature 1:</strong> Sensor: Patient symptoms → Actuator: Urgency alert
        </div>
        <div className="feature-pill">
          <strong>Feature 2:</strong> Sensor: Patient case → Actuator: Medical action
        </div>
      </div>

      <div className="triage-grid">
        <section className="card sensor-panel">
          <div className="card-header">
            <span className="section-badge sensor-badge">Sensor</span>
            <h3>Sensor Input: Patient Symptom / Patient Case</h3>
          </div>
          <p className="helper-text">
            This input acts as the sensor because it captures patient health information.
          </p>
          <form onSubmit={onSubmit}>
            <textarea
              id="symptoms"
              rows="8"
              placeholder="Example: I have had a fever and sore throat for 2 days..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Analyzing..." : "Submit Symptoms"}
            </button>
          </form>
        </section>

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
                <span className="result-label">Urgency Level</span>
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
      </div>
    </div>
  );
}

function HistoryPage() {
  return (
    <div className="page-content">
      <div className="page-title">
        <h1>My Triage History</h1>
        <p>View your past symptom checks and AI triage results.</p>
      </div>

      <div className="card">
        <p className="helper-text">Placeholder view for future Supabase integration.</p>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Symptoms</th>
                <th>Urgency</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {PLACEHOLDER_HISTORY.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.date}</td>
                  <td>{entry.symptoms}</td>
                  <td>
                    <span className={`urgency-badge ${getUrgencyClass(entry.urgency)}`}>
                      {entry.urgency}
                    </span>
                  </td>
                  <td>{entry.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!symptoms.trim()) {
      setError("Please enter your symptoms before submitting.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: symptoms.trim() }),
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

  function renderPage() {
    switch (activePage) {
      case "home":
        return <HomePage onNavigate={setActivePage} />;
      case "triage":
        return (
          <TriagePage
            symptoms={symptoms}
            setSymptoms={setSymptoms}
            loading={loading}
            result={result}
            error={error}
            onSubmit={handleSubmit}
          />
        );
      case "history":
        return <HistoryPage />;
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
