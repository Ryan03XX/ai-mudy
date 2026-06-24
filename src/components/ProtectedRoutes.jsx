import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

export function PatientProtectedRoute() {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role === "admin") return <Navigate to="/admin" replace />;
  return <Outlet />;
}

export function AdminProtectedRoute() {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  if (role === "patient") return <Navigate to="/" replace />;
  return <Outlet />;
}

export function PatientGuestRoute() {
  const { user, role, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (user && role === "patient") return <Navigate to="/" replace />;
  if (user && role === "admin") return <Navigate to="/admin" replace />;
  return <Outlet />;
}

export function AdminGuestRoute() {
  const { user, role, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (user && role === "admin") return <Navigate to="/admin" replace />;
  if (user && role === "patient") return <Navigate to="/" replace />;
  return <Outlet />;
}
