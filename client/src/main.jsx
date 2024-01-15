import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import { Home } from "./pages/index.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <App error={<Error />} />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      // {
      //   path: "/login",
      //   element: <Login signup={false} />,
      // },
      // {
      //   path: "/signup",
      //   element: <Login signup={true} />,
      // },
      // {
      //   path: "/logout",
      //   element: <Logout />,
      // },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
