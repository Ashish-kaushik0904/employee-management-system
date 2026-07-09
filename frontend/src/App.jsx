import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminLayout from "./components/AdminLayout";
import EmployeeLayout from "./components/EmployeeLayout";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import EmployeeList from "./pages/admin/employees/EmployeeList";
import AddEmployee from "./pages/admin/employees/AddEmployee";
import EditEmployee from "./pages/admin/employees/EditEmployee";
import ViewEmployee from "./pages/admin/employees/ViewEmployee";
import DepartmentList from "./pages/admin/departments/DepartmentList";
import AddDepartment from "./pages/admin/departments/AddDepartment";
import EditDepartment from "./pages/admin/departments/EditDepartment";
import LeaveList from "./pages/admin/leaves/LeaveList";
import LeaveDetail from "./pages/admin/leaves/LeaveDetail";
import SalaryList from "./pages/admin/salary/SalaryList";
import AddSalary from "./pages/admin/salary/AddSalary";
import AdminSettings from "./pages/admin/Settings";
import AdminAttendance from "./pages/admin/Attendance";

// Employee pages
import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeProfile from "./pages/employee/Profile";
import MyLeaves from "./pages/employee/leaves/MyLeaves";
import AddLeave from "./pages/employee/leaves/AddLeave";
import MySalary from "./pages/employee/salary/MySalary";
import EmployeeSettings from "./pages/employee/Settings";
import EmployeeAttendance from "./pages/employee/Attendance";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" />;
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={
          !user ? (
            <Login />
          ) : user.role === "admin" ? (
            <Navigate to="/admin-dashboard" />
          ) : (
            <Navigate to="/employee-dashboard" />
          )
        }
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/login" />}
      />

      {/* Admin Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/add" element={<AddEmployee />} />
        <Route path="employees/edit/:id" element={<EditEmployee />} />
        <Route path="employees/:id" element={<ViewEmployee />} />
        <Route path="departments" element={<DepartmentList />} />
        <Route path="departments/add" element={<AddDepartment />} />
        <Route path="departments/edit/:id" element={<EditDepartment />} />
        <Route path="leaves" element={<LeaveList />} />
        <Route path="leaves/:id" element={<LeaveDetail />} />
        <Route path="salary" element={<SalaryList />} />
        <Route path="salary/add" element={<AddSalary />} />
        <Route path="setting" element={<AdminSettings />} />
        <Route path="attendance" element={<AdminAttendance />} />
      </Route>

      {/* Employee Routes */}
      <Route
        path="/employee-dashboard"
        element={
          <ProtectedRoute allowedRole="employee">
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeeDashboard />} />
        <Route path="profile" element={<EmployeeProfile />} />
        <Route path="leaves" element={<MyLeaves />} />
        <Route path="leaves/add" element={<AddLeave />} />
        <Route path="salary" element={<MySalary />} />
        <Route path="setting" element={<EmployeeSettings />} />
        <Route path="attendance" element={<EmployeeAttendance />} />
      </Route>

      {/* Default */}
      <Route
        path="*"
        element={
          <Navigate to={user ? (user.role === "admin" ? "/admin-dashboard" : "/employee-dashboard") : "/login"} />
        }
      />
    </Routes>
  );
}

export default App;