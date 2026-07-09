import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

const EmployeeProfile = () => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    if (user?._id) {
      API.get(`/employees/${user._id}`)
        .then(({ data }) => setEmployee(data))
        .catch(() => setEmployee(user));
    }
  }, [user]);

  if (!employee) return <p style={{ color: "#6b7280" }}>Loading...</p>;

  const details = [
    { label: "Full Name", value: employee.name },
    { label: "Employee ID", value: employee.employeeId },
    { label: "Email", value: employee.email },
    { label: "Phone", value: employee.phone || "-" },
    { label: "Date of Birth", value: employee.dob ? new Date(employee.dob).toLocaleDateString() : "-" },
    { label: "Gender", value: employee.gender },
    { label: "Department", value: employee.department?.name || "-" },
    { label: "Designation", value: employee.designation || "-" },
    { label: "Marital Status", value: employee.maritalStatus },
    { label: "Role", value: employee.role },
  ];

  return (
    <div style={{ maxWidth: "780px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", marginBottom: "20px" }}>
        My Profile
      </h2>

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden" }}>

        {/* Top Banner */}
        <div style={{ backgroundColor: "#2563eb", height: "80px" }} />

        {/* Profile Header */}
        <div style={{ padding: "0 28px 24px", marginTop: "-40px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "20px", marginBottom: "20px" }}>
            {/* Avatar */}
            {employee.image ? (
              <img
                src={`http://localhost:5000${employee.image}`}
                alt={employee.name}
                style={{
                  width: "90px", height: "90px", borderRadius: "50%",
                  objectFit: "cover", border: "3px solid white",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                }}
              />
            ) : (
              <div style={{
                width: "90px", height: "90px", borderRadius: "50%",
                backgroundColor: "#2563eb",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: "32px", fontWeight: 700,
                border: "3px solid white",
                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
              }}>
                {employee.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ paddingBottom: "6px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                {employee.name}
              </h3>
              <p style={{ fontSize: "13px", color: "#2563eb", fontWeight: 600, margin: "3px 0 0" }}>
                {employee.designation || "Employee"} • {employee.department?.name || ""}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #e2e8f0", marginBottom: "20px" }} />

          {/* Details Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
            {details.map(({ label, value }, index) => (
              <div
                key={label}
                style={{
                  padding: "14px 16px",
                  backgroundColor: index % 4 < 2 ? "#f8fafc" : "white",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <p style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 4px" }}>
                  {label}
                </p>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b", margin: 0, textTransform: "capitalize" }}>
                  {value || "-"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;