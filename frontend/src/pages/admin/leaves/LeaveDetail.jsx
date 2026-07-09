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
    <div style={{ maxWidth: "700px", backgroundColor: "white", borderRadius: "10px", padding: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center", marginBottom: "24px", color: "#1f2937" }}>
        Leave Details
      </h2>

      <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        {/* Image */}
        <div style={{ flexShrink: 0 }}>
          {emp?.image ? (
            <img
              src={`http://localhost:5000${emp.image}`}
              alt={emp?.name}
              style={{ width: "130px", height: "150px", objectFit: "cover", borderRadius: "8px" }}
            />
          ) : (
            <div style={{ width: "130px", height: "150px", backgroundColor: "#008080", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "48px", fontWeight: "bold" }}>
              {emp?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
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

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            {leave.status === "pending" ? (
              <>
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
              </>
            ) : (
              <span style={{
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: 600,
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

      <div style={{ marginTop: "24px", borderTop: "1px solid #e5e7eb", paddingTop: "16px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{ backgroundColor: "#6b7280", color: "white", border: "none", padding: "8px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" }}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default LeaveDetail;