import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import React from "react";
import "./index.css";
import AppLayout from "./layouts/app-layout";
import Dashboard from "./pages/dashboard";
import LandingPage from "./pages/landing";
import Auth from "./pages/auth";
import Link from "./pages/link";
import RedirectLink from "./pages/redirect-link";
import UrlProvider from "./context";
import RequireAuth from "./components/require-auth";
import { Analytics } from "@vercel/analytics/react";
import RedirectHandler from "./components/redirect-handler"; // Import the updated component

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <LandingPage />
          </>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <>
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          </>
        ),
      },
      {
        path: "/auth",
        element: (
          <>
            <Auth />
          </>
        )
      },
      {
        path: "/link/:id",
        element: (
          <>
            <RequireAuth>
              <Link />
            </RequireAuth>
          </>
        ),
      },
      {
        path: "/:id",
        element: <RedirectHandler />, // Use the updated component for handling redirection
      },
      {
        path: "*",
        element: (
          <div>Not Found</div>
        ),
      }
    ],
  },
]);

function App() {
  return (
    <UrlProvider>
      <RouterProvider router={router} />
      <Analytics />
    </UrlProvider>
  );
}

export default App;
