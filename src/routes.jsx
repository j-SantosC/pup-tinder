import { createBrowserRouter, Navigate } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Spin } from "antd";

import Login from "./pages/Login";
import Home from "./pages/Home";
import App from "./App";
import AuthCallback from "./components/AuthCallback";
import Profile from "./pages/Profile";

const AppProtected = withAuthenticationRequired(App, {
  onRedirecting: () => <Spin />,
});

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthCallback />,
  },
  { path: "/login", element: <Login /> },
  {
    path: "/app",
    element: <AppProtected />,
    children: [
      { path: "", element: <Navigate to="/app/home" replace /> },

      { path: "home", element: <Home /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);
