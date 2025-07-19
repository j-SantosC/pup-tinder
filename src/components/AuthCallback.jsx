import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";

const AuthCallback = () => {
  const { isAuthenticated, isLoading, error } = useAuth0();

  useEffect(() => {
    if (error) {
      console.error("Auth0 error:", error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated) {
    return <Navigate to="/app/home" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default AuthCallback;
