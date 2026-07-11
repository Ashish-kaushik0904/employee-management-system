import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api/axios";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: "", name: "", email: "", phone: "",
    dob: "", gender: "male", maritalStatus: "single",
    designation: "", department: "", salary: "", role: "employee",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("/departments").then(({ data }) => setDepartments(data));
    API.get(`/employees/${id}`).then(({ data }) => {
      setFormData({
        employeeId: data.employeeId || "",
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        dob: data.dob ? data.dob.split("T")[0] : "",
        gender: data.gender || "male",
        maritalStatus: data.maritalStatus || "single",
        designation: data.designation || "",
        department: data.department?._id || "",
        salary: data.salary || "",
        role: data.role || "employee",
      });
      // ✅ Cloudinary URL directly use karo
      if (data.image) setPreview(data.image);
    });
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "") form.append(key, formData[key]);
      });
      if (image) form.append("image", image);

      await API.put(`/employees/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Employee updated successfully!");
      setTimeout(() => navigate("/admin-dashboard/employees"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const inp = { width: "100%", border: "1.5px solid #e2e8f0", borderRadius: "8px", padding: "9px 12px", fontSize: "14px", outline: "none", backgroundColor: "white", boxSizing: "border-box", color: "#0f172a" };
  const lbl = { fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "5px", display: "block" };

  const fields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Employee ID", name: "employeeId", type: "text" },
    { label: "Phone", name: "phone", type: "text" },
    { label: "Date of Birth", name: "dob", type: "date" },
    { label: "Designation", name: "designation", type: "text" },
    { label: "Salary", name: "salary", type: "number" },
  ];

  return (
    <div style={{ maxWidth: "820px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <button onClick={() => navigate(-1)} style={{ backgroundColor: "#f1f5f9", border: "none", padding: "7px 14px", borderRadius: "7px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#475569" }}>← Back</button>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>Edit Employee</h2>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        {error && <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>{error}</div>}
        {success && <div style={{ backgroundColor: "#f0fdf4", color: "#16a34a", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>{success}</div>}

        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px", padding: "16px", backgroundColor: "#f8fafc", borderRadius: "10px" }}>
          {preview ? (
            <img src={preview} alt="Preview"
              style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "3px solid #2563eb" }} />
          ) : (
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "28px", fontWeight: 700 }}>
              {formData.name?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Profile Picture</p>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: "13px", color: "#475569" }} />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            {fields.map(({ label, name, type }) => (
              <div key={name}>
                <label style={lbl}>{label}</label>
                <input style={inp} type={type} name={name} value={formData[name]} onChange={handleChange}
                  onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
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
              <select style={inp} name="department" value={formData.department} onChange={handleChange}>
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

          <button type="submit" disabled={loading}
            style={{ width: "100%", backgroundColor: "#2563eb", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Updating..." : "Update Employee"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;