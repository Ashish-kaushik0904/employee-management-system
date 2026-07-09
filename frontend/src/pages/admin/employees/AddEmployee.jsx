import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/axios";

const AddEmployee = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: "", name: "", email: "", password: "",
    dob: "", gender: "male", maritalStatus: "single",
    designation: "", department: "", salary: "",
    phone: "", role: "employee",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/departments").then(({ data }) => setDepartments(data));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) form.append(key, formData[key]);
      });
      if (image) form.append("image", image);
      await API.post("/employees", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/admin-dashboard/employees");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: "100%", border: "1.5px solid #e2e8f0", borderRadius: "8px",
    padding: "9px 12px", fontSize: "14px", outline: "none",
    backgroundColor: "white", boxSizing: "border-box", color: "#0f172a",
  };
  const lbl = { fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "5px", display: "block" };

  const fields = [
    { label: "Name", name: "name", type: "text", placeholder: "Full Name", required: true },
    { label: "Email", name: "email", type: "email", placeholder: "Email Address", required: true },
    { label: "Employee ID", name: "employeeId", type: "text", placeholder: "EMP001", required: true },
    { label: "Password", name: "password", type: "password", placeholder: "••••••", required: true },
    { label: "Phone", name: "phone", type: "text", placeholder: "9876543210" },
    { label: "Date of Birth", name: "dob", type: "date" },
    { label: "Designation", name: "designation", type: "text", placeholder: "e.g. Developer" },
    { label: "Salary", name: "salary", type: "number", placeholder: "Monthly Salary" },
  ];

  return (
    <div style={{ maxWidth: "820px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <button onClick={() => navigate(-1)} style={{ backgroundColor: "#f1f5f9", border: "none", padding: "7px 14px", borderRadius: "7px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#475569" }}>
          ← Back
        </button>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>Add New Employee</h2>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        {error && (
          <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px", border: "1px solid #fecaca" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            {fields.map(({ label, name, type, placeholder, required }) => (
              <div key={name}>
                <label style={lbl}>{label}</label>
                <input
                  style={inp} type={type} name={name}
                  value={formData[name]} onChange={handleChange}
                  required={required} placeholder={placeholder}
                  onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
            ))}

            <div>
              <label style={lbl}>Gender</label>
              <select style={inp} name="gender" value={formData.gender} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label style={lbl}>Marital Status</label>
              <select style={inp} name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                <option value="single">Single</option>
                <option value="married">Married</option>
              </select>
            </div>

            <div>
              <label style={lbl}>Department</label>
              <select style={inp} name="department" value={formData.department} onChange={handleChange} required>
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={lbl}>Role</label>
              <select style={inp} name="role" value={formData.role} onChange={handleChange}>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={lbl}>Profile Image</label>
            <input
              type="file" accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              style={{ ...inp, padding: "7px 12px" }}
            />
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", backgroundColor: "#2563eb", color: "white",
              border: "none", padding: "12px", borderRadius: "8px",
              fontSize: "15px", fontWeight: 700, cursor: "pointer",
            }}
          >
            {loading ? "Adding..." : "Add Employee"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;