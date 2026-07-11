import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/axios";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const { data } = await API.get("/employees");
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Delete failed");
    }
  };

  const filtered = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>Manage Employees</h2>
        <button onClick={() => navigate("/admin-dashboard/employees/add")} style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
          Add New Employee
        </button>
      </div>

      <input type="text" placeholder="Search By Employee ID or Name" value={search} onChange={(e) => setSearch(e.target.value)}
        style={{ border: "1px solid #d1d5db", borderRadius: "6px", padding: "8px 12px", fontSize: "14px", marginBottom: "16px", width: "280px", outline: "none" }} />

      {loading ? (
        <p style={{ color: "#6b7280", textAlign: "center", padding: "40px" }}>Loading...</p>
      ) : (
        <div style={{ backgroundColor: "white", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f9fafb" }}>
                {["S No", "Image", "Name", "DOB", "Department", "Action"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>No employees found</td></tr>
              ) : (
                filtered.map((emp, index) => (
                  <tr key={emp._id} style={{ borderBottom: "1px solid #f3f4f6" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}>
                    <td style={{ padding: "12px 16px", color: "#374151" }}>{index + 1}</td>
                    <td style={{ padding: "12px 16px" }}>
                      {emp.image ? (
                        <img src={emp.image} alt={emp.name}
                          style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#2563eb", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "16px" }}>
                          {emp.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#374151", fontWeight: 500 }}>{emp.name}</td>
                    <td style={{ padding: "12px 16px", color: "#6b7280" }}>{emp.dob ? new Date(emp.dob).toLocaleDateString() : "-"}</td>
                    <td style={{ padding: "12px 16px", color: "#6b7280" }}>{emp.department?.name || "-"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => navigate(`/admin-dashboard/employees/${emp._id}`)} style={{ backgroundColor: "#3b82f6", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>View</button>
                        <button onClick={() => navigate(`/admin-dashboard/employees/edit/${emp._id}`)} style={{ backgroundColor: "#22c55e", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>Edit</button>
                        <button onClick={() => navigate(`/admin-dashboard/salary/add?employeeId=${emp._id}`)} style={{ backgroundColor: "#f59e0b", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>Salary</button>
                        <button onClick={() => handleDelete(emp._id)} style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>Delete</button>
                      </div>
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

export default EmployeeList;