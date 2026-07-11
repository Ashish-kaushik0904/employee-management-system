import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api/axios";

const LeaveDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/leaves/${id}`).then(({ data }) => setLeave(data));
  }, [id]);

  const handleStatus = async (status) => {
    setLoading(true);
    try {
      await API.put(`/leaves/${id}/status`, { status });
      const { data } = await API.get(`/leaves/${id}`);
      setLeave(data);
    } catch (error) {
      console.error("Status update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!leave) return <p style={{ color: "#6b7280" }}>Loading...</p>;

  const emp = leave.employeeId;

  return (
    <div style={{ maxWidth: "700px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <button onClick={() => navigate(-1)} style={{ backgroundColor: "#f1f5f9", border: "none", padding: "7px 14px", borderRadius: "7px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#475569" }}>
          ← Back
        </button>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>Leave Details</h2>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        <div style={{ display: "flex", gap: "28px", alignItems: "flex-start" }}>
          {/* Image */}
          <div style={{ flexShrink: 0 }}>
            {emp?.image ? (
              <img
                src={emp.image}
                alt={emp?.name}
                style={{ width: "120px", height: "140px", objectFit: "cover", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
              />
            ) : (
              <div style={{ width: "120px", height: "140px", backgroundColor: "#2563eb", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "44px", fontWeight: "bold" }}>
                {emp?.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "14px", fontSize: "14px" }}>
            {[
              { label: "Name:", value: emp?.name },
              { label: "Employee ID:", value: emp?.employeeId },
              { label: "Leave Type:", value: leave.leaveType },
              { label: "Reason:", value: leave.description },
              { label: "Department:", value: emp?.department?.name },
              { label: "Start Date:", value: new Date(leave.fromDate).toLocaleDateString() },
              { label: "End Date:", value: new Date(leave.toDate).toLocaleDateString() },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontWeight: 700, color: "#1f2937", minWidth: "120px" }}>{label}</span>
                <span style={{ color: "#4b5563" }}>{value || "-"}</span>
              </div>
            ))}

            {/* Status + Action */}
            <div style={{ marginTop: "8px" }}>
              {leave.status === "pending" ? (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleStatus("approved")}
                    disabled={loading}
                    style={{ backgroundColor: "#22c55e", color: "white", border: "none", padding: "8px 20px", borderRadius: "6px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatus("rejected")}
                    disabled={loading}
                    style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "8px 20px", borderRadius: "6px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <span style={{
                  padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 600,
                  textTransform: "capitalize",
                  backgroundColor: leave.status === "approved" ? "#dcfce7" : "#fee2e2",
                  color: leave.status === "approved" ? "#16a34a" : "#dc2626",
                }}>
                  {leave.status}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetail;