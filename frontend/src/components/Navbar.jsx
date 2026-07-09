import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      logout();
      navigate("/login");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: "220px",
        right: 0,
        height: "56px",
        backgroundColor: "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        zIndex: 30,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <span style={{ color: "white", fontSize: "14px", fontWeight: 500 }}>
        Welcome, {user?.name}
      </span>
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "white",
          color: "#2563eb",
          border: "none",
          padding: "6px 16px",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;