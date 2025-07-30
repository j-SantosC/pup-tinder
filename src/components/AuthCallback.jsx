import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";

const AuthCallback = () => {
  const { user, isAuthenticated, isLoading, error, getAccessTokenSilently } =
    useAuth0();
  const [userCreated, setUserCreated] = useState(false);

  useEffect(() => {
    const createUserIfNew = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();

          await fetch("http://localhost:3001/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: user.email,
            }),
          });
        } catch (error) {
          if (error.status !== 409) {
            console.error("Error creating user:", error);
          }
        }
        setUserCreated(true);
      }
    };

    if (isAuthenticated && !userCreated) {
      createUserIfNew();
    }
  }, [isAuthenticated, user, getAccessTokenSilently, userCreated]);

  useEffect(() => {
    if (error) {
      console.error("Auth0 error:", error);
    }
  }, [error]);

  if (isLoading || (isAuthenticated && !userCreated)) {
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
