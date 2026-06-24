import { ADMIN_APPOINTMENTS_WEBHOOK_URL, ADMIN_DASHBOARD_WEBHOOK_URL, DOCTORS_WEBHOOK_URL } from "../config/webhooks";
import { cleanValue } from "../utils/helpers";

async function postAdminWebhook(url) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error(`Server returned status ${response.status}`);
  }

  return response.json();
}

function parseBoolean(value) {
  if (value === true || value === 1) return true;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes";
  }
  return false;
}

function normalizeAvailability(value) {
  const text = cleanValue(value).toLowerCase();

  if (text === "unavailable" || text === "not available" || text === "false" || value === false) {
    return "Unavailable";
  }
  if (text === "available" || text === "true" || value === true) {
    return "Available";
  }

  return cleanValue(value) || "Available";
}

export function normalizeDoctor(row) {
  const availability = normalizeAvailability(
    row.availability !== undefined ? row.availability : row.is_available
  );

  return {
    name: cleanValue(row.name) || "N/A",
    email: cleanValue(row.email) || "N/A",
    phone: cleanValue(row.phone) || "N/A",
    specialization: cleanValue(row.specialization) || "N/A",
    category: cleanValue(row.category) || "N/A",
    availability,
  };
}

export function normalizeAppointment(row) {
  return {
    id: cleanValue(row.id || row.appointment_id) || "N/A",
    patientName: cleanValue(row.patient_name || row.patientName) || "N/A",
    patientEmail: cleanValue(row.patient_email || row.patientEmail) || "N/A",
    doctor: cleanValue(row.doctor_name || row.doctor) || "N/A",
    date: cleanValue(row.appointment_date || row.date) || "",
    time: cleanValue(row.appointment_time || row.time) || "",
    urgency: cleanValue(row.urgency) || "N/A",
    status: cleanValue(row.status || row.appointment_status) || "N/A",
    isUrgentOverride: parseBoolean(row.is_urgent_override),
    originalPatient: cleanValue(row.original_patient || row.displaced_patient) || "",
    newUrgentPatient: cleanValue(row.patient_name || row.patientName) || "",
  };
}

function parseCount(value, fallback = 0) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
}

export function normalizeDashboardStats(data, pendingPaymentsFallback = 0) {
  const hasPendingPayments =
    data.pending_payments !== undefined &&
    data.pending_payments !== null &&
    data.pending_payments !== "";

  return {
    totalDoctors: parseCount(data.total_doctors),
    todayAppointments: parseCount(data.today_appointments),
    completedTriageCases: parseCount(data.completed_triage_cases),
    pendingPayments: hasPendingPayments
      ? parseCount(data.pending_payments)
      : pendingPaymentsFallback,
  };
}

export async function fetchAdminDashboard(pendingPaymentsFallback = 0) {
  const data = await postAdminWebhook(ADMIN_DASHBOARD_WEBHOOK_URL);

  if (data.success === false) {
    throw new Error(data.message || "Failed to load dashboard data from backend.");
  }

  return normalizeDashboardStats(data, pendingPaymentsFallback);
}

export async function fetchDoctors() {
  const data = await postAdminWebhook(DOCTORS_WEBHOOK_URL);

  if (data.success === false) {
    throw new Error(data.message || "Failed to load doctors from backend.");
  }

  const rows = Array.isArray(data.doctors) ? data.doctors : [];
  return rows.map(normalizeDoctor);
}

export async function fetchAdminAppointments() {
  const data = await postAdminWebhook(ADMIN_APPOINTMENTS_WEBHOOK_URL);

  if (data.success === false) {
    throw new Error(data.message || "Failed to load appointments from backend.");
  }

  const rows = Array.isArray(data.appointments) ? data.appointments : [];
  return rows.map(normalizeAppointment);
}

export function countTodayAppointments(appointments) {
  const today = new Date().toISOString().slice(0, 10);
  return appointments.filter((item) => item.date === today).length;
}

export function buildUrgentRescheduleQueue(appointments) {
  return appointments
    .filter((item) => item.isUrgentOverride)
    .map((item, index) => ({
      id: `RS-${item.id}-${index}`,
      originalPatient: item.originalPatient || "Affected Patient",
      originalDate: item.date,
      originalTime: item.time,
      newUrgentPatient: item.newUrgentPatient || item.patientName,
      status: "Pending Reschedule",
    }));
}
