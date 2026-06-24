import { AVAILABLE_SLOTS_WEBHOOK_URL } from "../config/webhooks";
import { cleanValue } from "../utils/helpers";

function extractAvailableSlots(data) {
  if (!data) return [];

  if (Array.isArray(data.available_slots)) {
    return data.available_slots;
  }

  const firstItem = Array.isArray(data) ? data[0] : null;
  if (!firstItem) return [];

  if (Array.isArray(firstItem.available_slots)) {
    return firstItem.available_slots;
  }

  if (Array.isArray(firstItem.json?.available_slots)) {
    return firstItem.json.available_slots;
  }

  return [];
}

export async function fetchAvailableSlots(appointmentDate) {  const response = await fetch(AVAILABLE_SLOTS_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appointment_date: appointmentDate }),
  });

  console.log("available slots status", response.status);
  console.log("available slots text", await response.clone().text());

  if (!response.ok) {
    throw new Error(`Server returned status ${response.status}`);
  }

  const data = await response.json();

  if (data?.success === false || (Array.isArray(data) && data[0]?.success === false)) {
    const message =
      data?.message ||
      (Array.isArray(data) ? data[0]?.message : null) ||
      "Failed to load available time slots.";
    throw new Error(message);
  }

  const slots = extractAvailableSlots(data);
  return slots.map((slot) => cleanValue(slot)).filter(Boolean);
}