import React from "react";
import { Button } from "antd";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Button
        type="primary"
        size="large"
        onClick={handleLogin}
        loading={isLoading}
      >
        Login with Auth0
      </Button>
    </div>
  );
};

export default Login;
