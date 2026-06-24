import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import {
  AdminGuestRoute,
  AdminProtectedRoute,
  PatientGuestRoute,
  PatientProtectedRoute,
} from "./components/ProtectedRoutes";

import PatientLayout from "./patient/PatientLayout";
import PatientLoginPage from "./patient/pages/LoginPage";
import PatientRegisterPage from "./patient/pages/RegisterPage";
import HomePage from "./patient/pages/HomePage";
import TriagePage from "./patient/pages/TriagePage";
import AppointmentsPage from "./patient/pages/AppointmentsPage";
import ProfilePage from "./patient/pages/ProfilePage";

import AdminLayout from "./admin/AdminLayout";
import AdminLoginPage from "./admin/pages/LoginPage";
import AdminRegisterPage from "./admin/pages/RegisterPage";
import DashboardPage from "./admin/pages/DashboardPage";
import DoctorsPage from "./admin/pages/DoctorsPage";
import DoctorListPage from "./admin/pages/DoctorListPage";
import SchedulePage from "./admin/pages/SchedulePage";
import AdminAppointmentsPage from "./admin/pages/AdminAppointmentsPage";
import PaymentsPage from "./admin/pages/PaymentsPage";
import ReportsPage from "./admin/pages/ReportsPage";
import AdminProfilePage from "./admin/pages/AdminProfilePage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PatientGuestRoute />}>
            <Route path="/login" element={<PatientLoginPage />} />
            <Route path="/register" element={<PatientRegisterPage />} />
          </Route>

          <Route element={<AdminGuestRoute />}>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/register" element={<AdminRegisterPage />} />
          </Route>

          <Route element={<PatientProtectedRoute />}>
            <Route element={<PatientLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/triage" element={<TriagePage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/history" element={<Navigate to="/appointments" replace />} />
            </Route>
          </Route>

          <Route element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<DashboardPage />} />
              <Route path="/admin/doctors" element={<DoctorsPage />} />
              <Route path="/admin/doctor-list" element={<DoctorListPage />} />
              <Route path="/admin/schedule" element={<SchedulePage />} />
              <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
              <Route path="/admin/payments" element={<PaymentsPage />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
              <Route path="/admin/profile" element={<AdminProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
