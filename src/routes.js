import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "home",
        Component: Home,
      },
    ],
  },
]);
