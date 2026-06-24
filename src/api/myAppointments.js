import { MY_APPOINTMENTS_WEBHOOK_URL } from "../config/webhooks";
import { cleanValue } from "../utils/helpers";

function extractAppointments(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.appointments)) {
    return data.appointments;
  }

  return [];
}

export function normalizeMyAppointment(row) {
  const fallbackId = `${cleanValue(row.appointment_date)}${cleanValue(row.appointment_time)}${cleanValue(row.doctor_email)}`;

  return {
    id: cleanValue(row.id || row.appointment_id) || fallbackId,
    appointmentDate: cleanValue(row.appointment_date || row.date) || "N/A",
    appointmentTime: cleanValue(row.appointment_time || row.time) || "N/A",
    doctorName: cleanValue(row.doctor_name || row.doctor) || "N/A",
    doctorEmail: cleanValue(row.doctor_email) || "N/A",
    urgency: cleanValue(row.urgency) || "N/A",
    category: cleanValue(row.category) || "N/A",
    status: cleanValue(row.status || row.appointment_status) || "N/A",
  };
}

export async function fetchMyAppointments(patientEmail) {
  const response = await fetch(MY_APPOINTMENTS_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ patient_email: patientEmail }),
  });

  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : { success: false, appointments: [] };
  } catch {
    throw new Error("Invalid response from appointments server.");
  }

  if (!response.ok) {
    throw new Error(data.message || `Server returned status ${response.status}`);
  }

  if (data.success === false) {
    throw new Error(data.message || "Failed to load appointments.");
  }

  return extractAppointments(data).map(normalizeMyAppointment);
}

const UPCOMING_STATUSES = new Set(["confirmed", "booked", "pending"]);

export function countPastTriageChecks(appointments) {
  return appointments.length;
}

export function countUpcomingAppointments(appointments) {
  return appointments.filter((appointment) =>
    UPCOMING_STATUSES.has(cleanValue(appointment.status).toLowerCase())
  ).length;
}
