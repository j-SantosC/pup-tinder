import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import SimpleLogin from "./pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/",
        Component: Home,
      },
    ],
  },
  {
    path: "/login",
    Component: SimpleLogin,
  },
]);
