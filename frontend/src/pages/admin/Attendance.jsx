import { useState, useEffect } from "react";
import API from "../../api/axios";

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async (date) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/attendance?date=${date}`);
      setAttendance(data);
    } catch (error) {
      console.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate]);

  const filtered = attendance.filter(
    (a) =>
      a.employeeId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.employeeId?.employeeId?.toLowerCase().includes(search.toLowerCase())
  );

  const statusStyle = {
    present: { bg: "#e8f5e9", color: "#16a34a" },
    late: { bg: "#fff8e1", color: "#f59e0b" },
    absent: { bg: "#fce4ec", color: "#dc2626" },
  };

  // Summary counts
  const presentCount = attendance.filter((a) => a.status === "present").length;
  const lateCount = attendance.filter((a) => a.status === "late").length;

  return (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", marginBottom: "20px" }}>
        Attendance Management
      </h2>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "10px", padding: "16px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", flex: 1 }}>
          <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px", fontWeight: 600 }}>Total Check-ins</p>
          <p style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a" }}>{attendance.length}</p>
        </div>
        <div style={{ backgroundColor: "white", borderRadius: "10px", padding: "16px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", flex: 1 }}>
          <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px", fontWeight: 600 }}>On Time</p>
          <p style={{ fontSize: "24px", fontWeight: 800, color: "#16a34a" }}>{presentCount}</p>
        </div>
        <div style={{ backgroundColor: "white", borderRadius: "10px", padding: "16px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", flex: 1 }}>
          <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px", fontWeight: 600 }}>Late Arrivals</p>
          <p style={{ fontSize: "24px", fontWeight: 800, color: "#f59e0b" }}>{lateCount}</p>
        </div>
      </div>

      {/* Filters */}
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
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            border: "1.5px solid #e2e8f0", borderRadius: "8px",
            padding: "9px 14px", fontSize: "13px",
            outline: "none", color: "#374151",
          }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>Loading...</div>
      ) : (
        <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                {["Emp ID", "Name", "Department", "Check In", "Check Out", "Hours", "Status"].map((h) => (
                  <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontWeight: 700, color: "#374151", fontSize: "13px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "50px", color: "#9ca3af" }}>
                    No attendance records for this date
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => (
                  <tr key={rec._id} style={{ borderBottom: "1px solid #f1f5f9" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ backgroundColor: "#eff6ff", color: "#2563eb", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 700 }}>
                        {rec.employeeId?.employeeId || "-"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {rec.employeeId?.image ? (
                          <img src={`http://localhost:5000${rec.employeeId.image}`} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#2563eb", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700 }}>
                            {rec.employeeId?.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                        )}
                        <span style={{ fontWeight: 600, color: "#111827" }}>{rec.employeeId?.name || "-"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#6b7280" }}>{rec.employeeId?.department?.name || "-"}</td>
                    <td style={{ padding: "14px 16px", color: "#374151" }}>
                      {rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#374151" }}>
                      {rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#374151", fontWeight: 600 }}>{rec.workingHours}h</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        backgroundColor: statusStyle[rec.status]?.bg,
                        color: statusStyle[rec.status]?.color,
                        padding: "4px 12px", borderRadius: "20px",
                        fontSize: "12px", fontWeight: 700,
                        textTransform: "capitalize",
                      }}>
                        {rec.status}
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

export default AdminAttendance;