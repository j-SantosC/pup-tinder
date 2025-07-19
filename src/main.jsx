import "antd/dist/reset.css";
import "./index.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { router } from "./routes";

const rootElement = document.getElementById("root");

const onRedirectCallback = (appState) => {
  const returnTo = appState?.returnTo || "/app/home";
  window.history.replaceState({}, document.title, returnTo);
};

createRoot(rootElement).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
      cacheLocation="localstorage"
      onRedirectCallback={onRedirectCallback}
    >
      <RouterProvider router={router} />
    </Auth0Provider>
  </React.StrictMode>
);
