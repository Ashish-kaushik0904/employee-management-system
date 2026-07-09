import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

const AdminSettings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      return setError("New passwords do not match");
    }
    if (formData.newPassword.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await API.put("/settings/change-password", {
        userId: user._id,
        userType: "admin",
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      setSuccess("Password changed successfully!");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", border: "1px solid #d1d5db", borderRadius: "6px",
    padding: "8px 12px", fontSize: "14px", outline: "none",
    backgroundColor: "white",
  };
  const labelStyle = {
    fontSize: "14px", fontWeight: 600, color: "#374151",
    marginBottom: "4px", display: "block",
  };

  return (
    <div style={{ maxWidth: "500px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937", marginBottom: "24px" }}>
        Change Password
      </h2>

      <div style={{ backgroundColor: "white", borderRadius: "10px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        {error && (
          <div style={{ backgroundColor: "#fee2e2", color: "#dc2626", padding: "10px 16px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px" }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ backgroundColor: "#dcfce7", color: "#16a34a", padding: "10px 16px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px" }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Old Password</label>
            <input
              style={inputStyle}
              type="password"
              value={formData.oldPassword}
              onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
              required
              placeholder="Old Password"
            />
          </div>
          <div>
            <label style={labelStyle}>New Password</label>
            <input
              style={inputStyle}
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
              placeholder="New Password"
            />
          </div>
          <div>
            <label style={labelStyle}>Confirm Password</label>
            <input
              style={inputStyle}
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              placeholder="Confirm Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#008080", color: "white", border: "none",
              padding: "10px", borderRadius: "6px", fontSize: "14px",
              fontWeight: 600, cursor: "pointer",
            }}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;