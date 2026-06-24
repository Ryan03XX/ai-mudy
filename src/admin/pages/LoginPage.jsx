import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import { useAuth } from "../../context/AuthContext";
import { getAuthErrorMessage } from "../../utils/authErrors";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { profile } = await login(email, password);
      if (profile?.role === "patient") {
        navigate("/");
      } else {
        navigate("/admin");
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page admin-auth-page">
      <div className="auth-card admin-auth-card">
        <div className="auth-brand">
          <Logo className="app-logo app-logo-auth" />
          <span className="auth-portal-label">Admin Login</span>
        </div>

        <h1>Hospital Admin Login</h1>
        <p className="auth-subtitle">Sign in to access the hospital CMS portal.</p>

        {error && (
          <div className="error-card auth-error">
            <p>{error}</p>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="submit-btn admin-submit-btn" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer-text">
          No admin account? <Link to="/admin/register">Register as Admin</Link>
        </p>
        <p className="auth-footer-text">
          Patient user? <Link to="/login">Patient Login</Link>
        </p>
      </div>
    </div>
  );
}
