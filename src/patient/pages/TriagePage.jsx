import { useState } from "react";
import { Link } from "react-router-dom";
import { bookAppointment } from "../../api/bookAppointment";
import { TRIAGE_WEBHOOK_URL } from "../../config/webhooks";
import { getSlotLabel, isSlotBooked, TIME_SLOTS } from "../../data/appointmentSlots";
import { useAuth } from "../../context/AuthContext";
import { cleanValue, getMedicalRecommendation, getUrgencyClass } from "../../utils/helpers";
import { isHighUrgency, isLowUrgency } from "../../utils/urgency";

export default function TriagePage() {
  const { userProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [symptoms, setSymptoms] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");

  const patientEmail = userProfile?.email?.trim() || "";
  const patientPhone = userProfile?.phone?.trim() || "";
  const hasContactInfo = Boolean(patientEmail && patientPhone);

  const medicalRecommendation = result ? getMedicalRecommendation(result.urgency) : "";
  const highUrgency = result ? isHighUrgency(result.urgency) : false;
  const lowUrgency = result ? isLowUrgency(result.urgency) : false;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!symptoms.trim()) {
      setError("Please enter your symptoms before submitting.");
      return;
    }

    if (!hasContactInfo) {
      setError("Please add your email and phone number in Profile before submitting symptoms.");
      return;
    }

    setLoading(true);
    setError("");
    setBookingError("");
    setResult(null);
    setBookingResult(null);
    setAppointmentDate("");
    setAppointmentTime("");
    setCurrentStep(2);

    try {
      const response = await fetch(TRIAGE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: symptoms.trim(),
          patient_email: patientEmail,
          patient_phone: patientPhone,
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

  async function handleBookAppointment(e) {
    e.preventDefault();

    if (!result) {
      setBookingError("Complete symptom check first before booking.");
      return;
    }

    if (!appointmentDate || !appointmentTime) {
      setBookingError("Please select appointment date and time slot.");
      return;
    }

    const booked = isSlotBooked(appointmentDate, appointmentTime);
    if (booked && !highUrgency) {
      setBookingError("This time slot is already booked. Please choose another slot.");
      return;
    }

    setBookingLoading(true);
    setBookingError("");
    setBookingResult(null);

    const payload = {
      symptoms: symptoms.trim(),
      urgency: cleanValue(result.urgency),
      category: cleanValue(result.category),
      patient_email: patientEmail,
      patient_phone: patientPhone,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      is_urgent_override: highUrgency,
    };

    try {
      const data = await bookAppointment(payload);
      setBookingResult(data);
    } catch (err) {
      if (err.message.includes("Failed to fetch")) {
        setBookingError(
          "Unable to reach the booking backend. Check that n8n is running and the book-appointment webhook is set up."
        );
      } else {
        setBookingError(err.message || "Failed to book appointment. Please try again.");
      }
    } finally {
      setBookingLoading(false);
    }
  }

  function handleDateChange(e) {
    setAppointmentDate(e.target.value);
    setAppointmentTime("");
    setBookingError("");
  }

  function goToStep1() {
    setCurrentStep(1);
    setError("");
    setBookingError("");
    setResult(null);
    setBookingResult(null);
    setAppointmentDate("");
    setAppointmentTime("");
  }

  function goToStep2() {
    setCurrentStep(2);
    setBookingError("");
    setBookingResult(null);
    setAppointmentDate("");
    setAppointmentTime("");
  }

  function goToStep3() {
    setCurrentStep(3);
    setBookingError("");
    setBookingResult(null);
    setAppointmentDate("");
    setAppointmentTime("");
  }

  return (
    <div className="page-content">
      <div className="page-title">
        <h1>AI Symptom Check</h1>
        <p>Check your symptoms, review the AI result, then choose whether to book an appointment.</p>
      </div>

      <div className="triage-stepper">
        <div className={`triage-step-item ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "done" : ""}`}>
          <span className="triage-step-num">1</span>
          <span>Symptoms</span>
        </div>
        <div className="triage-step-line" />
        <div className={`triage-step-item ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "done" : ""}`}>
          <span className="triage-step-num">2</span>
          <span>AI Result</span>
        </div>
        <div className="triage-step-line" />
        <div className={`triage-step-item ${currentStep >= 3 ? "active" : ""}`}>
          <span className="triage-step-num">3</span>
          <span>Booking</span>
        </div>
      </div>

      <div className="triage-wizard">
        {currentStep === 1 && (
          <section className="card sensor-panel triage-wizard-card">
            <div className="card-header">
              <span className="section-badge sensor-badge">Step 1</span>
              <h3>Patient Symptom Input</h3>
            </div>
            <p className="helper-text">Describe your symptoms. Your email and phone are taken from your profile.</p>

            {!hasContactInfo && (
              <div className="error-card">
                <p>
                  Missing contact details. Please update your{" "}
                  <Link to="/profile">Profile</Link> with email and phone before submitting.
                </p>
              </div>
            )}

            {error && (
              <div className="error-card">
                <strong>Something went wrong</strong>
                <p>{error}</p>
              </div>
            )}

            <form className="triage-form" onSubmit={handleSubmit}>
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

              <button type="submit" className="submit-btn" disabled={loading || !hasContactInfo}>
                {loading ? "Analyzing..." : "Submit Symptoms"}
              </button>
            </form>
          </section>
        )}

        {currentStep === 2 && (
          <section className="card actuator-panel triage-wizard-card">
            <div className="card-header">
              <span className="section-badge actuator-badge">Step 2</span>
              <h3>AI Triage Result</h3>
            </div>

            {loading && (
              <div className="output-placeholder loading-state">
                <div className="spinner"></div>
                <p>Analyzing your symptoms...</p>
              </div>
            )}

            {error && !loading && (
              <>
                <div className="error-card">
                  <strong>Something went wrong</strong>
                  <p>{error}</p>
                </div>
                <button type="button" className="secondary-btn" onClick={goToStep1}>
                  Back to Symptoms
                </button>
              </>
            )}

            {result && !loading && (
              <>
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

                  {lowUrgency && (
                    <div className="optional-booking-message">
                      <p>Appointment is optional. You may monitor your symptoms first.</p>
                    </div>
                  )}
                </div>

                <div className="booking-choice-section">
                  <p className="helper-text">Would you like to book an appointment?</p>
                  <div className="wizard-actions">
                    <button type="button" className="secondary-btn" onClick={goToStep1}>
                      Start Over
                    </button>
                    <button type="button" className="secondary-btn" onClick={goToStep1}>
                      No, Skip Booking
                    </button>
                    <button type="button" className="submit-btn wizard-next-btn" onClick={goToStep3}>
                      Yes, Book Appointment
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        )}

        {currentStep === 3 && result && (
          <section className="card appointment-panel triage-wizard-card">
            <div className="card-header">
              <span className="section-badge appointment-badge">Step 3</span>
              <h3>{bookingResult ? "Appointment Confirmed" : "Book Appointment"}</h3>
            </div>

            {!bookingResult && (
              <>
                <p className="helper-text">
                  Select your preferred date and time slot to complete your appointment request.
                </p>

                {highUrgency && (
                  <div className="urgent-warning-card">
                    <strong>Urgent case: this patient may be prioritized.</strong>
                    <p>Admin must reschedule affected appointment.</p>
                  </div>
                )}

                <form className="triage-form booking-form" onSubmit={handleBookAppointment}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="booking-date">Preferred Appointment Date</label>
                      <input
                        id="booking-date"
                        type="date"
                        value={appointmentDate}
                        onChange={handleDateChange}
                        disabled={bookingLoading}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="booking-time">Time Slot</label>
                      <select
                        id="booking-time"
                        value={appointmentTime}
                        onChange={(e) => {
                          setAppointmentTime(e.target.value);
                          setBookingError("");
                        }}
                        disabled={bookingLoading || !appointmentDate}
                        required
                      >
                        <option value="">Select time slot</option>
                        {TIME_SLOTS.map((slot) => {
                          const booked = isSlotBooked(appointmentDate, slot);
                          const disabled = booked && !highUrgency;
                          return (
                            <option key={slot} value={slot} disabled={disabled}>
                              {getSlotLabel(slot, appointmentDate)}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {appointmentDate && (
                    <div className="slot-legend">
                      {TIME_SLOTS.map((slot) => (
                        <span
                          key={slot}
                          className={`slot-legend-item ${isSlotBooked(appointmentDate, slot) ? "slot-booked" : "slot-available"}`}
                        >
                          {getSlotLabel(slot, appointmentDate)}
                        </span>
                      ))}
                    </div>
                  )}

                  {bookingError && (
                    <div className="error-card">
                      <p>{bookingError}</p>
                    </div>
                  )}

                  <div className="wizard-actions">
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={goToStep2}
                      disabled={bookingLoading}
                    >
                      Back to Result
                    </button>
                    <button type="submit" className="submit-btn wizard-next-btn" disabled={bookingLoading}>
                      {bookingLoading ? "Booking..." : "Book Appointment"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {bookingResult && (
              <div className="result-body">
                <div className="success-card">
                  <strong>Appointment Booked</strong>
                  <p>Your appointment request has been submitted successfully.</p>
                </div>
                <div className="result-row">
                  <span className="result-label">Assigned Doctor Name</span>
                  <span className="result-value">
                    {cleanValue(bookingResult.doctor_name) || "Pending assignment"}
                  </span>
                </div>
                <div className="result-row">
                  <span className="result-label">Doctor Email</span>
                  <span className="result-value">
                    {cleanValue(bookingResult.doctor_email) || "N/A"}
                  </span>
                </div>
                <div className="result-row">
                  <span className="result-label">Appointment Date</span>
                  <span className="result-value">
                    {cleanValue(bookingResult.appointment_date) || appointmentDate || "N/A"}
                  </span>
                </div>
                <div className="result-row">
                  <span className="result-label">Appointment Time</span>
                  <span className="result-value">
                    {cleanValue(bookingResult.appointment_time) || appointmentTime || "N/A"}
                  </span>
                </div>
                <div className="result-row">
                  <span className="result-label">Appointment Status</span>
                  <span className="appointment-status">
                    {cleanValue(bookingResult.appointment_status) || "Confirmed"}
                  </span>
                </div>
                {highUrgency && (
                  <div className="urgent-warning-card">
                    <strong>Urgent case: this patient may be prioritized.</strong>
                    <p>Admin must reschedule affected appointment.</p>
                  </div>
                )}
                <button type="button" className="secondary-btn" onClick={goToStep1}>
                  Start New Check
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
