import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../../../api/axios";

const AddSalary = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    department: "",
    employeeId: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    payDate: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    API.get("/departments").then(({ data }) => setDepartments(data));

    // Agar employee list se Salary button click hua
    const empId = searchParams.get("employeeId");
    if (empId) {
      setFormData((prev) => ({ ...prev, employeeId: empId }));
      // Employee ka department fetch karo
      API.get(`/employees/${empId}`).then(({ data }) => {
        setFormData((prev) => ({
          ...prev,
          department: data.department?._id || "",
          employeeId: empId,
        }));
        if (data.department?._id) {
          API.get(`/salary/department/${data.department._id}`).then(({ data: emps }) => {
            setEmployees(emps);
          });
        }
      });
    }
  }, []);

  // Department change hone par employees fetch karo
  const handleDepartmentChange = async (e) => {
    const deptId = e.target.value;
    setFormData({ ...formData, department: deptId, employeeId: "" });
    if (deptId) {
      try {
        const { data } = await API.get(`/salary/department/${deptId}`);
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employees");
      }
    } else {
      setEmployees([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/salary", {
        employeeId: formData.employeeId,
        basicSalary: Number(formData.basicSalary),
        allowances: Number(formData.allowances) || 0,
        deductions: Number(formData.deductions) || 0,
        payDate: formData.payDate,
      });
      navigate("/admin-dashboard/salary");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", border: "1px solid #d1d5db", borderRadius: "6px",
    padding: "8px 12px", fontSize: "14px", outline: "none", backgroundColor: "white",
  };
  const labelStyle = {
    fontSize: "14px", fontWeight: 600, color: "#374151",
    marginBottom: "4px", display: "block",
  };

  return (
    <div style={{ maxWidth: "700px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937", marginBottom: "24px" }}>
        Add New Salary
      </h2>

      {error && (
        <div style={{ backgroundColor: "#fee2e2", color: "#dc2626", padding: "10px 16px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Department</label>
            <select
              style={inputStyle}
              value={formData.department}
              onChange={handleDepartmentChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Employee</label>
            <select
              style={inputStyle}
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.employeeId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Basic Salary</label>
            <input
              style={inputStyle}
              type="number"
              value={formData.basicSalary}
              onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
              required
              placeholder="Insert Salary"
            />
          </div>

          <div>
            <label style={labelStyle}>Allowances</label>
            <input
              style={inputStyle}
              type="number"
              value={formData.allowances}
              onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
              placeholder="Monthly Allowances"
            />
          </div>

          <div>
            <label style={labelStyle}>Deductions</label>
            <input
              style={inputStyle}
              type="number"
              value={formData.deductions}
              onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
              placeholder="Monthly Deductions"
            />
          </div>

          <div>
            <label style={labelStyle}>Pay Date</label>
            <input
              style={inputStyle}
              type="date"
              value={formData.payDate}
              onChange={(e) => setFormData({ ...formData, payDate: e.target.value })}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#008080", color: "white", border: "none",
            padding: "12px", borderRadius: "6px", fontSize: "15px",
            fontWeight: 600, cursor: "pointer", marginTop: "8px",
          }}
        >
          {loading ? "Adding..." : "Add Salary"}
        </button>
      </form>
    </div>
  );
};

export default AddSalary;