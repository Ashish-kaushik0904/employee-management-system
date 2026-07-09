import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <Sidebar role="admin" />
      <div style={{ marginLeft: "220px", flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ marginTop: "56px", padding: "24px", flex: 1 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;