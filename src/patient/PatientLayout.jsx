import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../utils/helpers";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/triage", label: "Patient Triage" },
  { to: "/appointments", label: "My Appointments" },
];

export default function PatientLayout() {
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
    navigate("/login");
  }

  function goToProfile() {
    setMenuOpen(false);
    navigate("/profile");
  }

  return (
    <div className="app">
      <header className="client-header">
        <div className="header-inner">
          <NavLink to="/" className="brand">
            <Logo className="app-logo app-logo-header" />
            <span className="brand-portal-label">Patient Portal</span>
          </NavLink>

          <nav className="main-nav">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-user">
            <button type="button" className="emergency-btn">Emergency</button>

            <div className="user-menu" ref={menuRef}>
              <button
                type="button"
                className="user-chip user-chip-btn"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <div className="avatar">{getInitials(userProfile?.name)}</div>
                <span>{userProfile?.name || "Patient"}</span>
                <span className="user-menu-caret">{menuOpen ? "▲" : "▼"}</span>
              </button>

              {menuOpen && (
                <div className="user-dropdown">
                  <button type="button" className="user-dropdown-item" onClick={goToProfile}>
                    Profile
                  </button>
                  <button type="button" className="user-dropdown-item user-dropdown-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="client-footer">
        <p>For educational purposes only. Not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
}
