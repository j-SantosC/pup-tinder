import { useAuth0 } from "@auth0/auth0-react";
import { Button, Card } from "antd";
import { useEffect } from "react";

export default function SimpleLogin() {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    user,
    getAccessTokenSilently,
  } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently()
        .then((token) => {
          sessionStorage.setItem("auth0_token", token);
          console.log("Token guardado:", token);
        })
        .catch((error) => {
          console.error("Error obteniendo token:", error);
        });
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleLogout = () => {
    sessionStorage.removeItem("auth0_token");
    logout();
  };

  if (!isAuthenticated) {
    return (
      <Card style={{ width: 300, margin: "50px auto", textAlign: "center" }}>
        <h3>Login</h3>
        <Button type="primary" onClick={loginWithRedirect}>
          Iniciar Sesión
        </Button>
      </Card>
    );
  }

  return (
    <Card style={{ width: 300, margin: "50px auto", textAlign: "center" }}>
      <h3>¡Hola {user?.name}!</h3>
      <Button onClick={handleLogout}>Cerrar Sesión</Button>
    </Card>
  );
}
