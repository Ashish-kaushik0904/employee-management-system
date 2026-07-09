import { useAuth } from "../../context/AuthContext";

const EmployeeDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          maxWidth: "400px",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "#008080",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "28px" }}>👥</span>
        </div>
        <div>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>Welcome Back</p>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>
            {user?.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;