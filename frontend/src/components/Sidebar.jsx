import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  DollarSign,
  Settings,
  UserCircle,
  Clock,
} from "lucide-react";

const adminLinks = [
  { to: "/admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin-dashboard/employees", label: "Employees", icon: Users },
  { to: "/admin-dashboard/departments", label: "Departments", icon: Building2 },
  { to: "/admin-dashboard/attendance", label: "Attendance", icon: Clock },
  { to: "/admin-dashboard/leaves", label: "Leaves", icon: CalendarDays },
  { to: "/admin-dashboard/salary", label: "Salary", icon: DollarSign },
  { to: "/admin-dashboard/setting", label: "Setting", icon: Settings },
];

const employeeLinks = [
  { to: "/employee-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employee-dashboard/profile", label: "My Profile", icon: UserCircle },
  { to: "/employee-dashboard/attendance", label: "Attendance", icon: Clock },
  { to: "/employee-dashboard/leaves", label: "Leave", icon: CalendarDays },
  { to: "/employee-dashboard/salary", label: "Salary", icon: DollarSign },
  { to: "/employee-dashboard/setting", label: "Setting", icon: Settings },
];

const Sidebar = ({ role }) => {
  const links = role === "admin" ? adminLinks : employeeLinks;

  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "#0f172a",
        display: "flex",
        flexDirection: "column",
        zIndex: 40,
      }}
    >
      <div
        style={{
          backgroundColor: "#2563eb",
          padding: "16px",
          textAlign: "center",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          Employee MS
        </h1>
      </div>

      <nav style={{ flex: 1, paddingTop: "8px", overflowY: "auto" }}>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split("/").length === 2}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              fontSize: "14px",
              textDecoration: "none",
              color: isActive ? "white" : "#9ca3af",
              backgroundColor: isActive ? "#2563eb" : "transparent",
              transition: "all 0.2s",
            })}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;