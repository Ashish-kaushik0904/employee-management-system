import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import API from "../../../api/axios";

const AddLeave = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leaveType: "Sick Leave",
    fromDate: "",
    toDate: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/leaves", {
        employeeId: user._id,
        ...formData,
      });
      navigate("/employee-dashboard/leaves");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", border: "1px solid #d1d5db", borderRadius: "6px",
    padding: "8px 12px", fontSize: "14px", outline: "none", backgroundColor: "white",
  };
  const labelStyle = {
    fontSize: "14px", fontWeight: 600, color: "#374151",
    marginBottom: "4px", display: "block",
  };

  return (
    <div style={{ maxWidth: "600px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937", marginBottom: "24px" }}>
        Request for Leave
      </h2>

      {error && (
        <div style={{ backgroundColor: "#fee2e2", color: "#dc2626", padding: "10px 16px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <div style={{ backgroundColor: "white", borderRadius: "10px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Leave Type</label>
            <select
              style={inputStyle}
              value={formData.leaveType}
              onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
            >
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Annual Leave</option>
              <option>Maternity Leave</option>
              <option>Other</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={labelStyle}>From Date</label>
              <input
                style={inputStyle}
                type="date"
                value={formData.fromDate}
                onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>To Date</label>
              <input
                style={inputStyle}
                type="date"
                value={formData.toDate}
                onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, height: "100px", resize: "vertical" }}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Reason for leave"
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
            {loading ? "Submitting..." : "Add Leave"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLeave;