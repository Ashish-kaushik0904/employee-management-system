import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/axios";

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/leaves").then(({ data }) => {
      setLeaves(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = leaves;
    if (activeFilter !== "all") {
      result = result.filter((l) => l.status === activeFilter);
    }
    if (search) {
      result = result.filter((l) =>
        l.employeeId?.employeeId?.toLowerCase().includes(search.toLowerCase()) ||
        l.employeeId?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [activeFilter, search, leaves]);

  const filterButtons = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  const statusStyle = {
    pending: { bg: "#fff8e1", color: "#f59e0b" },
    approved: { bg: "#e8f5e9", color: "#16a34a" },
    rejected: { bg: "#fce4ec", color: "#dc2626" },
  };

  return (
    <div>
      {/* Header */}
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", marginBottom: "20px" }}>
        Manage Leaves
      </h2>

      {/* Search + Filter Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", gap: "12px" }}>
        <input
          type="text"
          placeholder="Search By Employee ID or Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            border: "1.5px solid #e2e8f0", borderRadius: "8px",
            padding: "9px 14px", fontSize: "13px", width: "280px",
            outline: "none", color: "#374151",
          }}
          onFocus={(e) => e.target.style.borderColor = "#2563eb"}
          onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
        />

        <div style={{ display: "flex", gap: "8px" }}>
          {filterButtons.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              style={{
                padding: "8px 18px", borderRadius: "8px",
                border: "none", fontSize: "13px", fontWeight: 600,
                cursor: "pointer",
                backgroundColor: activeFilter === value ? "#2563eb" : "#f1f5f9",
                color: activeFilter === value ? "white" : "#475569",
                transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>Loading...</div>
      ) : (
        <div style={{
          backgroundColor: "white", borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)", overflow: "hidden",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                {["S No", "Emp ID", "Name", "Leave Type", "Department", "Days", "Status", "Action"].map((h) => (
                  <th key={h} style={{
                    padding: "13px 16px", textAlign: "left",
                    fontWeight: 700, color: "#374151", fontSize: "13px",
                    letterSpacing: "0.3px",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "50px", color: "#9ca3af", fontSize: "14px" }}>
                    No leaves found
                  </td>
                </tr>
              ) : (
                filtered.map((leave, index) => {
                  const from = new Date(leave.fromDate);
                  const to = new Date(leave.toDate);
                  const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
                  const emp = leave.employeeId;
                  const s = statusStyle[leave.status] || { bg: "#f1f5f9", color: "#6b7280" };

                  return (
                    <tr
                      key={leave._id}
                      style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                    >
                      <td style={{ padding: "14px 16px", color: "#6b7280", fontWeight: 500 }}>{index + 1}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{
                          backgroundColor: "#eff6ff", color: "#2563eb",
                          padding: "3px 10px", borderRadius: "20px",
                          fontSize: "12px", fontWeight: 700,
                        }}>
                          {emp?.employeeId || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {emp?.image ? (
                            <img
                              src={`http://localhost:5000${emp.image}`}
                              style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                            />
                          ) : (
                            <div style={{
                              width: "32px", height: "32px", borderRadius: "50%",
                              backgroundColor: "#2563eb", color: "white",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "13px", fontWeight: 700, flexShrink: 0,
                            }}>
                              {emp?.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                          )}
                          <span style={{ fontWeight: 600, color: "#111827" }}>
                            {emp?.name || "—"}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#374151" }}>{leave.leaveType}</td>
                      <td style={{ padding: "14px 16px", color: "#6b7280" }}>
                        {emp?.department?.name || "—"}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#374151", fontWeight: 600 }}>{days}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{
                          backgroundColor: s.bg, color: s.color,
                          padding: "4px 12px", borderRadius: "20px",
                          fontSize: "12px", fontWeight: 700,
                          textTransform: "capitalize",
                        }}>
                          {leave.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <button
                          onClick={() => navigate(`/admin-dashboard/leaves/${leave._id}`)}
                          style={{
                            backgroundColor: "#2563eb", color: "white",
                            border: "none", padding: "6px 16px",
                            borderRadius: "7px", fontSize: "12px",
                            fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveList;