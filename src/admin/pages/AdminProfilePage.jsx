import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AdminProfilePage() {
  const { userProfile, updateProfile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      setEmail(userProfile.email || "");
      setPhone(userProfile.phone || "");
    }
  }, [userProfile]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      setSuccess("Profile updated successfully.");
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-page profile-page-center">
      <div className="admin-page-title">
        <h1>My Profile</h1>
        <p>Update your admin account details.</p>
      </div>

      <section className="card profile-edit-card">
        {success && (
          <div className="success-card">
            <p>{success}</p>
          </div>
        )}

        {error && (
          <div className="error-card">
            <p>{error}</p>
          </div>
        )}

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="admin-profile-name">Full Name</label>
            <input
              id="admin-profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-profile-email">Email</label>
            <input
              id="admin-profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-profile-phone">Phone Number</label>
            <input
              id="admin-profile-phone"
              type="tel"
              placeholder="e.g. +60 12-345 6789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="info-card profile-readonly-card">
            <span className="info-label">Role</span>
            <span className="info-value">{userProfile?.role || "admin"}</span>
          </div>

          <div className="info-card profile-readonly-card">
            <span className="info-label">Member Since</span>
            <span className="info-value">
              {userProfile?.createdAt
                ? new Date(userProfile.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>

          <button type="submit" className="submit-btn admin-submit-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </section>
    </div>
  );
}
