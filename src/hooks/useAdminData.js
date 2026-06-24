import { useCallback, useEffect, useState } from "react";
import { fetchAdminAppointments, fetchAdminDashboard, fetchDoctors } from "../api/adminApi";

function getErrorMessage(err) {
  if (err.message?.includes("Failed to fetch")) {
    return "Unable to reach the backend. Check that n8n is running and the webhook URL is correct.";
  }
  return err.message || "Failed to load data.";
}

export function useAdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchDoctors();
      setDoctors(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { doctors, loading, error, reload };
}

export function useAdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchAdminAppointments();
      setAppointments(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { appointments, loading, error, reload };
}

export function useAdminDashboard(pendingPaymentsFallback = 0) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchAdminDashboard(pendingPaymentsFallback);
      setStats(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [pendingPaymentsFallback]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { stats, loading, error, reload };
}
