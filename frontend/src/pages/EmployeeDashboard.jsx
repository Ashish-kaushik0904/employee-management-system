import { useState, useEffect } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await API.get("/employees");
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Employees</h2>
          <p className="text-gray-500 text-sm">{employees.length} total employees</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : employees.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No employees found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((emp) => (
              <div key={emp._id} className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                    {emp.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{emp.name}</h3>
                    <p className="text-sm text-gray-500">{emp.position}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium">Email</span>
                    <span>{emp.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Phone</span>
                    <span>{emp.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Department</span>
                    <span>{emp.department?.name || emp.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Salary</span>
                    <span>₹{emp.salary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      emp.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {emp.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;