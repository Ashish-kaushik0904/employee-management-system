import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "employee",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", formData);
      login(data);
      navigate(data.role === "admin" ? "/admin-dashboard" : "/employee-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f1f5f9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "40px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>
            Create Account
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b" }}>
            Register a new account
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: "#fef2f2", color: "#dc2626",
            padding: "10px 14px", borderRadius: "8px",
            marginBottom: "16px", fontSize: "13px",
            border: "1px solid #fecaca",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="John Doe"
              style={{
                width: "100%", border: "1.5px solid #e2e8f0",
                borderRadius: "8px", padding: "10px 14px",
                fontSize: "14px", outline: "none",
                boxSizing: "border-box", color: "#0f172a",
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="john@company.com"
              style={{
                width: "100%", border: "1.5px solid #e2e8f0",
                borderRadius: "8px", padding: "10px 14px",
                fontSize: "14px", outline: "none",
                boxSizing: "border-box", color: "#0f172a",
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="••••••••"
              style={{
                width: "100%", border: "1.5px solid #e2e8f0",
                borderRadius: "8px", padding: "10px 14px",
                fontSize: "14px", outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={{
                width: "100%", border: "1.5px solid #e2e8f0",
                borderRadius: "8px", padding: "10px 14px",
                fontSize: "14px", outline: "none",
                boxSizing: "border-box", color: "#0f172a",
                backgroundColor: "white",
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#2563eb",
              color: "white", border: "none",
              padding: "11px", borderRadius: "8px",
              fontSize: "14px", fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "4px",
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#64748b", marginTop: "20px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;