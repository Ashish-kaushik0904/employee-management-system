import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

const EmployeeAttendance = () => {
  const { user } = useAuth();
  const [today, setToday] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [todayRes, historyRes] = await Promise.all([
        API.get(`/attendance/today/${user._id}`),
        API.get(`/attendance/employee/${user._id}`),
      ]);
      setToday(todayRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      console.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchData();
  }, [user]);

  const handleCheckIn = async () => {
    setError("");
    setActionLoading(true);
    try {
      await API.post("/attendance/checkin", { employeeId: user._id });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Check-in failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setError("");
    setActionLoading(true);
    try {
      await API.put("/attendance/checkout", { employeeId: user._id });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Check-out failed");
    } finally {
      setActionLoading(false);
    }
  };

  const statusStyle = {
    present: { bg: "#e8f5e9", color: "#16a34a" },
    late: { bg: "#fff8e1", color: "#f59e0b" },
    absent: { bg: "#fce4ec", color: "#dc2626" },
  };

  if (loading) return <p style={{ color: "#6b7280" }}>Loading...</p>;

  return (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", marginBottom: "20px" }}>
        Attendance
      </h2>

      {error && (
        <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "10px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px", border: "1px solid #fecaca" }}>
          {error}
        </div>
      )}

      {/* Check-in/out Card */}
      <div style={{
        backgroundColor: "white", borderRadius: "12px",
        padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        marginBottom: "28px", maxWidth: "420px",
      }}>
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>

        {!today ? (
          <>
            <p style={{ fontSize: "15px", color: "#374151", marginBottom: "16px" }}>
              You haven't checked in today
            </p>
            <button
              onClick={handleCheckIn}
              disabled={actionLoading}
              style={{
                width: "100%", backgroundColor: "#2563eb", color: "white",
                border: "none", padding: "12px", borderRadius: "8px",
                fontSize: "15px", fontWeight: 700, cursor: "pointer",
              }}
            >
              {actionLoading ? "Checking in..." : "✓ Check In"}
            </button>
          </>
        ) : !today.checkOut ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <div>
                <p style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }}>Checked In</p>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
                  {new Date(today.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <span style={{
                backgroundColor: statusStyle[today.status]?.bg,
                color: statusStyle[today.status]?.color,
                padding: "4px 12px", borderRadius: "20px",
                fontSize: "12px", fontWeight: 700, height: "fit-content",
                textTransform: "capitalize",
              }}>
                {today.status}
              </span>
            </div>
            <button
              onClick={handleCheckOut}
              disabled={actionLoading}
              style={{
                width: "100%", backgroundColor: "#dc2626", color: "white",
                border: "none", padding: "12px", borderRadius: "8px",
                fontSize: "15px", fontWeight: 700, cursor: "pointer",
              }}
            >
              {actionLoading ? "Checking out..." : "Check Out"}
            </button>
          </>
        ) : (
          <div>
            <div style={{ display: "flex", gap: "16px", marginBottom: "8px" }}>
              <div>
                <p style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }}>Check In</p>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                  {new Date(today.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }}>Check Out</p>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                  {new Date(today.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }}>Hours</p>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#2563eb" }}>
                  {today.workingHours}h
                </p>
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "#16a34a", fontWeight: 600, marginTop: "12px" }}>
              ✓ Attendance completed for today
            </p>
          </div>
        )}
      </div>

      {/* History Table */}
      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>
        Attendance History
      </h3>

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
              {["Date", "Check In", "Check Out", "Hours", "Status"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151", fontSize: "13px" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
                  No attendance records yet
                </td>
              </tr>
            ) : (
              history.map((rec) => (
                <tr key={rec._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 16px", color: "#374151" }}>{rec.date}</td>
                  <td style={{ padding: "12px 16px", color: "#6b7280" }}>
                    {rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#6b7280" }}>
                    {rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#374151", fontWeight: 600 }}>{rec.workingHours}h</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      backgroundColor: statusStyle[rec.status]?.bg,
                      color: statusStyle[rec.status]?.color,
                      padding: "3px 10px", borderRadius: "20px",
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
    </div>
  );
};

export default EmployeeAttendance;