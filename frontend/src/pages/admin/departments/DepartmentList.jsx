import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/axios";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    try {
      const { data } = await API.get("/departments");
      setDepartments(data);
    } catch (error) {
      console.error("Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await API.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (error) {
      console.error("Delete failed");
    }
  };

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>
          Manage Departments
        </h2>
        <button
          onClick={() => navigate("/admin-dashboard/departments/add")}
          style={{ backgroundColor: "#008080", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
        >
          Add New Department
        </button>
      </div>

      <input
        type="text"
        placeholder="Search Department"
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
                {["S No", "Department", "Action"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                    No departments found
                  </td>
                </tr>
              ) : (
                filtered.map((dept, index) => (
                  <tr
                    key={dept._id}
                    style={{ borderBottom: "1px solid #f3f4f6" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                  >
                    <td style={{ padding: "12px 16px", color: "#374151" }}>{index + 1}</td>
                    <td style={{ padding: "12px 16px", color: "#374151", fontWeight: 500 }}>{dept.name}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => navigate(`/admin-dashboard/departments/edit/${dept._id}`)}
                          style={{ backgroundColor: "#22c55e", color: "white", border: "none", padding: "5px 14px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(dept._id)}
                          style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "5px 14px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                        >
                          Delete
                        </button>
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

export default DepartmentList;