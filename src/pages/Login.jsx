import React from "react";
import { Button } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import logoImage from "../assets/pup-tinder-background.png";
import "./Login.css";

const Login = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  return (
    <div className="container">
      <img
        src={logoImage}
        alt="Pup-Tinder Logo"
        style={{ width: "180px", marginBottom: "24px" }}
      />
      <Button
        color="default"
        variant="solid"
        onClick={handleLogin}
        loading={isLoading}
        size="large"
      >
        Log in
      </Button>
    </div>
  );
};

export default Login;
