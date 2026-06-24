import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import { useAuth } from "../../context/AuthContext";
import { getAuthErrorMessage } from "../../utils/authErrors";

export default function AdminRegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register({ name, email, password, role: "admin" });
      navigate("/admin");
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
          <span className="auth-portal-label">Admin Register</span>
        </div>

        <h1>Create Admin Account</h1>
        <p className="auth-subtitle">Register hospital staff for CMS access.</p>

        {error && (
          <div className="error-card auth-error">
            <p>{error}</p>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
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
              minLength={6}
              disabled={loading}
            />
          </div>
          <button type="submit" className="submit-btn admin-submit-btn" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/admin/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
