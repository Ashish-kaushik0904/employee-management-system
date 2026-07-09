import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api/axios";

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/departments/${id}`).then(({ data }) => {
      setFormData({ name: data.name, description: data.description || "" });
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put(`/departments/${id}`, formData);
      navigate("/admin-dashboard/departments");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: "100%", border: "1px solid #d1d5db", borderRadius: "6px", padding: "8px 12px", fontSize: "14px", outline: "none" };
  const labelStyle = { fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" };

  return (
    <div style={{ maxWidth: "600px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937", marginBottom: "24px" }}>
        Edit Department
      </h2>

      {error && (
        <div style={{ backgroundColor: "#fee2e2", color: "#dc2626", padding: "10px 16px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={labelStyle}>Department Name</label>
          <input
            style={inputStyle}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            style={{ ...inputStyle, height: "100px", resize: "vertical" }}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ backgroundColor: "#008080", color: "white", border: "none", padding: "10px", borderRadius: "6px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default EditDepartment;