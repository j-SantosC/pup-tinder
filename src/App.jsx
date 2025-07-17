import { Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";

function App() {
  const items = [{ key: "1", label: "Home" }];

  return (
    <div>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]} // Cambiado para coincidir con la key del item
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <main style={{ padding: "20px" }}>
        {" "}
        <Outlet /> {/* Aquí se cargan las rutas hijas */}
      </main>
    </div>
  );
}

export default App;
