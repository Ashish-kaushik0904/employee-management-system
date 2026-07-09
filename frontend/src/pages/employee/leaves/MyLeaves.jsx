import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import API from "../../../api/axios";

const MyLeaves = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      API.get(`/leaves/employee/${user._id}`)
        .then(({ data }) => {
          setLeaves(data);
          setLoading(false);
        });
    }
  }, [user]);

  const filtered = leaves.filter((l) =>
    l.leaveType.toLowerCase().includes(search.toLowerCase()) ||
    l.status.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = {
    pending: "#f59e0b",
    approved: "#22c55e",
    rejected: "#ef4444",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>
          Manage Leaves
        </h2>
        <button
          onClick={() => navigate("/employee-dashboard/leaves/add")}
          style={{ backgroundColor: "#008080", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
        >
          Add Leave
        </button>
      </div>

      <input
        type="text"
        placeholder="Search By Status or Type"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ border: "1px solid #d1d5db", borderRadius: "6px", padding: "8px 12px", fontSize: "14px", marginBottom: "16px", width: "280px", outline: "none" }}
      />

      {loading ? (
        <p style={{ color: "#6b7280", textAlign: "center", padding: "40px" }}>Loading...</p>
      ) : (
        <div style={{ backgroundColor: "white", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f9fafb" }}>
                {["SNO", "Leave Type", "From", "To", "Description", "Applied Date", "Status"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                    No leaves found
                  </td>
                </tr>
              ) : (
                filtered.map((leave, index) => (
                  <tr
                    key={leave._id}
                    style={{ borderBottom: "1px solid #f3f4f6" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                  >
                    <td style={{ padding: "12px 16px", color: "#374151" }}>{index + 1}</td>
                    <td style={{ padding: "12px 16px", color: "#374151" }}>{leave.leaveType}</td>
                    <td style={{ padding: "12px 16px", color: "#6b7280" }}>{new Date(leave.fromDate).toLocaleDateString()}</td>
                    <td style={{ padding: "12px 16px", color: "#6b7280" }}>{new Date(leave.toDate).toLocaleDateString()}</td>
                    <td style={{ padding: "12px 16px", color: "#6b7280" }}>{leave.description}</td>
                    <td style={{ padding: "12px 16px", color: "#6b7280" }}>{new Date(leave.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        backgroundColor: statusColor[leave.status] + "20",
                        color: statusColor[leave.status],
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyLeaves;