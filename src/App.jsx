import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Menu, Button } from "antd";
import { Header } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";

function App() {
  const { logout } = useAuth0();
  const items = [{ key: "1", label: "Home" }];

  const handleLogout = () => {
    sessionStorage.removeItem("auth0_token");
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <div>
      <Header className="header">
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={items}
          className="menu"
        />
        <div className="header-actions">
          <UserOutlined className="user-icon" />
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
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
