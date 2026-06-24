import { useEffect, useState } from "react";
import { WEBHOOKS, IS_TEST_MODE } from "../config/webhooks";
import { cleanValue } from "../utils/helpers";

export function usePatientHistory(email) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      const trimmedEmail = email?.trim();

      if (!trimmedEmail) {
        setHistory([]);
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const url = IS_TEST_MODE ? WEBHOOKS.HISTORY_TEST : WEBHOOKS.HISTORY_PRODUCTION;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patient_email: trimmedEmail }),
        });

        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`);
        }

        const data = await response.json();
        setHistory(Array.isArray(data.history) ? data.history : []);
      } catch (err) {
        if (err.message.includes("Failed to fetch")) {
          setError(
            "Unable to reach the backend. Check that n8n is running, the webhook URL is correct, and CORS is allowed."
          );
        } else {
          setError(err.message || "Failed to load history.");
        }
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [email]);

  return { history, loading, error };
}

export function countPastTriageChecks(history) {
  return history.length;
}

export function countUpcomingAppointments(history) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return history.filter((entry) => {
    const status = cleanValue(entry.status).toLowerCase();
    if (status.includes("cancel") || status.includes("complete")) {
      return false;
    }

    const dateStr = cleanValue(entry.appointment_date);
    if (!dateStr) {
      return false;
    }

    const appointmentDate = new Date(dateStr);
    if (Number.isNaN(appointmentDate.getTime())) {
      return false;
    }

    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
  }).length;
}
