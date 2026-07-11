import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api/axios";

const ViewEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/employees/${id}`).then(({ data }) => setEmployee(data));
  }, [id]);

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
    { label: "Salary", value: employee.salary ? `₹${Number(employee.salary).toLocaleString()}` : "-" },
    { label: "Role", value: employee.role },
    { label: "Status", value: employee.status },
  ];

  return (
    <div style={{ maxWidth: "780px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <button onClick={() => navigate(-1)} style={{ backgroundColor: "#f1f5f9", border: "none", padding: "7px 14px", borderRadius: "7px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#475569" }}>
          ← Back
        </button>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>Employee Details</h2>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden" }}>
        <div style={{ backgroundColor: "#2563eb", height: "80px" }} />
        <div style={{ padding: "0 28px 28px", marginTop: "-40px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "20px", marginBottom: "20px" }}>
            {employee.image ? (
              <img src={employee.image} alt={employee.name}
                style={{ width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover", border: "3px solid white", boxShadow: "0 2px 10px rgba(0,0,0,0.15)" }} />
            ) : (
              <div style={{ width: "90px", height: "90px", borderRadius: "50%", backgroundColor: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "32px", fontWeight: 700, border: "3px solid white" }}>
                {employee.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ paddingBottom: "6px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: 0 }}>{employee.name}</h3>
              <p style={{ fontSize: "13px", color: "#2563eb", fontWeight: 600, margin: "3px 0 0" }}>
                {employee.designation || "Employee"} • {employee.department?.name || ""}
              </p>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #e2e8f0", marginBottom: "20px" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
            {details.map(({ label, value }, index) => (
              <div key={label} style={{ padding: "14px 16px", backgroundColor: index % 4 < 2 ? "#f8fafc" : "white", borderBottom: "1px solid #f1f5f9" }}>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 4px" }}>{label}</p>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b", margin: 0, textTransform: "capitalize" }}>{value || "-"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;