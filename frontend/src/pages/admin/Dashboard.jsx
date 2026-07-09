import { useState, useEffect } from "react";
import API from "../../api/axios";

const StatCard = ({ icon, label, value, bgColor }) => (
  <div style={{
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    flex: 1,
  }}>
    <div style={{
      width: "60px", height: "60px",
      backgroundColor: bgColor,
      borderRadius: "10px",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "26px", flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 4px", fontWeight: 500 }}>
        {label}
      </p>
      <p style={{ fontSize: "28px", fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1 }}>
        {value}
      </p>
    </div>
  </div>
);

const LeaveCard = ({ icon, label, value, bgColor }) => (
  <div style={{
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  }}>
    <div style={{
      width: "60px", height: "60px",
      backgroundColor: bgColor,
      borderRadius: "10px",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "26px", flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 4px", fontWeight: 500 }}>
        {label}
      </p>
      <p style={{ fontSize: "28px", fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1 }}>
        {value}
      </p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    monthlySalary: 0,
    leaveApplied: 0,
    leaveApproved: 0,
    leavePending: 0,
    leaveRejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [empRes, deptRes, leaveRes, salaryRes] = await Promise.all([
          API.get("/employees"),
          API.get("/departments"),
          API.get("/leaves"),
          API.get("/salary"),
        ]);

        const now = new Date();
        const monthlySalary = salaryRes.data
          .filter((s) => {
            const d = new Date(s.payDate);
            return d.getMonth() === now.getMonth() &&
              d.getFullYear() === now.getFullYear();
          })
          .reduce((sum, s) => sum + (s.total || 0), 0);

        setStats({
          totalEmployees: empRes.data.length,
          totalDepartments: deptRes.data.length,
          monthlySalary,
          leaveApplied: leaveRes.data.length,
          leaveApproved: leaveRes.data.filter((l) => l.status === "approved").length,
          leavePending: leaveRes.data.filter((l) => l.status === "pending").length,
          leaveRejected: leaveRes.data.filter((l) => l.status === "rejected").length,
        });
      } catch (error) {
        console.error("Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
        <p style={{ color: "#6b7280", fontSize: "15px" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Dashboard Overview */}
      <h2 style={{
        fontSize: "22px", fontWeight: 700,
        color: "#111827", marginBottom: "20px",
      }}>
        Dashboard Overview
      </h2>

      {/* Top 3 Stats */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "32px" }}>
        <StatCard
          icon="👥"
          label="Total Employees"
          value={stats.totalEmployees}
          bgColor="#e0f2f1"
        />
        <StatCard
          icon="🏢"
          label="Total Departments"
          value={stats.totalDepartments}
          bgColor="#fff8e1"
        />
        <StatCard
          icon="💵"
          label="Monthly Pay"
          value={`$${stats.monthlySalary.toLocaleString()}`}
          bgColor="#fce4ec"
        />
      </div>

      {/* Leave Details */}
      <h2 style={{
        fontSize: "22px", fontWeight: 700,
        color: "#111827", marginBottom: "20px",
        textAlign: "center",
      }}>
        Leave Details
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <LeaveCard
          icon="📄"
          label="Leave Applied"
          value={stats.leaveApplied}
          bgColor="#e0f2f1"
        />
        <LeaveCard
          icon="✅"
          label="Leave Approved"
          value={stats.leaveApproved}
          bgColor="#e8f5e9"
        />
        <LeaveCard
          icon="⏳"
          label="Leave Pending"
          value={stats.leavePending}
          bgColor="#fff8e1"
        />
        <LeaveCard
          icon="❌"
          label="Leave Rejected"
          value={stats.leaveRejected}
          bgColor="#fce4ec"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;