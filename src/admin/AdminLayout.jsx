import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../utils/helpers";
import "../Admin.css";

const MENU_ITEMS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/doctors", label: "Doctor Management" },
  { to: "/admin/doctor-list", label: "Doctor List" },
  { to: "/admin/schedule", label: "Appointment Schedule" },
  { to: "/admin/appointments", label: "Appointments" },
  { to: "/admin/payments", label: "Payment Records" },
  { to: "/admin/reports", label: "Reports" },
];

export default function AdminLayout() {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    navigate("/admin/login");
  }

  function goToProfile() {
    setMenuOpen(false);
    navigate("/admin/profile");
  }

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Logo className="app-logo app-logo-admin" />
          <span className="admin-portal-label">Hospital Admin</span>
        </div>

        <nav className="admin-menu">
          {MENU_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-menu-link ${isActive ? "active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div>
            <h2>Hospital Administration</h2>
            <p>Manage doctors, schedules, payments, and reports</p>
          </div>

          <div className="user-menu admin-user-menu" ref={menuRef}>
            <button
              type="button"
              className="user-chip user-chip-btn admin-user-chip"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <div className="avatar">{getInitials(userProfile?.name)}</div>
              <span>{userProfile?.name || "Admin"}</span>
              <span className="user-menu-caret">{menuOpen ? "▲" : "▼"}</span>
            </button>

            {menuOpen && (
              <div className="user-dropdown">
                <button type="button" className="user-dropdown-item" onClick={goToProfile}>
                  Profile
                </button>
                <button
                  type="button"
                  className="user-dropdown-item user-dropdown-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
