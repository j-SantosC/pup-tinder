import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Menu, Button } from "antd";
import { Header, Footer } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";
import { useNavigate, useLocation } from "react-router-dom";

function App() {
  const { logout } = useAuth0();
  const items = [
    { key: "/app/home", label: "Home" },
    { key: "/app/match", label: "Match" },
    { key: "/app/likes", label: "My Likes" },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.removeItem("auth0_token");
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header className="header">
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={items}
          className="menu"
          onClick={({ key }) => navigate(key)}
        />

        <div className="header-actions">
          <UserOutlined
            className="user-icon"
            onClick={() => navigate("/app/profile")}
            style={{ cursor: "pointer" }}
          />
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </Button>
        </div>
      </Header>

      <main className="main-content" style={{ flex: 1 }}>
        <Outlet />
      </main>

      <Footer
        style={{
          textAlign: "center",
          background: "#001529",
          color: "rgba(255, 255, 255, 0.65)",
          padding: "24px 50px",
        }}
      >
        <div style={{ marginBottom: "8px" }}>
          🐕 PupTinder ©{new Date().getFullYear()}
        </div>
        <div style={{ fontSize: "14px" }}>
          Conectando amigos peludos | Hecho con ❤️ para perros
        </div>
      </Footer>
    </div>
  );
}

export default App;
