import { useAuth0 } from "@auth0/auth0-react";
import { Button, Card, Alert, Spin } from "antd";
import { useEffect, useState } from "react";
import { useAuthAPI } from "../hooks/useAuthAPI"; // Ajusta la ruta según tu estructura

export default function SimpleLogin() {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    user,
    getAccessTokenSilently,
  } = useAuth0();

  const { verifyUser, loading, error } = useAuthAPI();
  const [verifiedUser, setVerifiedUser] = useState(null);

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
  const handleVerifyUser = async () => {
    const result = await verifyUser();
    if (result && result.valid) {
      setVerifiedUser(result.valid);
      console.log("Usuario verificado:", result.user);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("auth0_token");
    setVerifiedUser(null);
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
    <Card style={{ width: 400, margin: "50px auto", textAlign: "center" }}>
      <h3>¡Hola {user?.name}!</h3>

      <div style={{ margin: "20px 0" }}>
        <Button
          type="primary"
          onClick={handleVerifyUser}
          loading={loading}
          style={{ marginRight: "10px" }}
        >
          Verificar Usuario
        </Button>

        <Button onClick={handleLogout}>Cerrar Sesión</Button>
      </div>

      {loading && <Spin />}

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          style={{ marginTop: "10px" }}
        />
      )}

      {verifiedUser && (
        <Alert
          message="Usuario Verificado"
          description={`Email: ${verifiedUser.email || "No disponible"}`}
          type="success"
          style={{ marginTop: "10px" }}
        />
      )}
    </Card>
  );
}
