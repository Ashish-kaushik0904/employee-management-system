import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import API from "../../../api/axios";

const MySalary = () => {
  const { user } = useAuth();
  const [salaries, setSalaries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      API.get(`/salary/employee/${user._id}`)
        .then(({ data }) => {
          setSalaries(data);
          setLoading(false);
        });
    }
  }, [user]);

  const filtered = salaries.filter((s) =>
    s.employeeId?.toString().includes(search)
  );

  return (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937", marginBottom: "20px" }}>
        Salary History
      </h2>

      <input
        type="text"
        placeholder="Search By Emp ID"
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
                {["SNO", "EMP ID", "Salary", "Allowance", "Deduction", "Total", "Pay Date"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {salaries.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                    No salary records found
                  </td>
                </tr>
              ) : (
                salaries.map((sal, index) => (
                  <tr
                    key={sal._id}
                    style={{ borderBottom: "1px solid #f3f4f6" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                  >
                    <td style={{ padding: "12px 16px", color: "#374151" }}>{index + 1}</td>
                    <td style={{ padding: "12px 16px", color: "#374151" }}>{user?.employeeId || "-"}</td>
                    <td style={{ padding: "12px 16px", color: "#374151" }}>{sal.basicSalary?.toLocaleString()}</td>
                    <td style={{ padding: "12px 16px", color: "#22c55e" }}>{sal.allowances?.toLocaleString()}</td>
                    <td style={{ padding: "12px 16px", color: "#ef4444" }}>{sal.deductions?.toLocaleString()}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#374151" }}>{sal.total?.toLocaleString()}</td>
                    <td style={{ padding: "12px 16px", color: "#6b7280" }}>{new Date(sal.payDate).toLocaleDateString()}</td>
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

export default MySalary;