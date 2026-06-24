import { BOOK_APPOINTMENT_WEBHOOK_URL } from "../config/webhooks";

export async function bookAppointment(payload) {
  const url = BOOK_APPOINTMENT_WEBHOOK_URL;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Server returned status ${response.status}`);
  }

  try {
    return await response.json();
  } catch {
    return { success: true };
  }
}
