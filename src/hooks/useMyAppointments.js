import { useEffect, useState } from "react";
import { fetchMyAppointments } from "../api/myAppointments";

function getErrorMessage(err) {
  if (err.message?.includes("Failed to fetch")) {
    return "Unable to reach the backend. Check that n8n is running, the webhook URL is correct, and CORS is allowed.";
  }
  return err.message || "Failed to load appointments.";
}

export function useMyAppointments(email) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAppointments() {
      const trimmedEmail = email?.trim();

      if (!trimmedEmail) {
        setAppointments([]);
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await fetchMyAppointments(trimmedEmail);
        setAppointments(data);
      } catch (err) {
        setError(getErrorMessage(err));
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, [email]);

  return { appointments, loading, error };
}
