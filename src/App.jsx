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
import WorkspaceSettings from "./pages/workspace-settings";
import AcceptInvite from "./pages/accept-invite";
import UrlProvider from "./context";
import RequireAuth from "./components/require-auth";
import { Analytics } from "@vercel/analytics/react";
import RedirectHandler from "./components/redirect-handler";
import ErrorBoundary from "./components/error-boundary";
import RouteError from "./components/route-error";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      {
        path: "/",
        element: (
          <>
            <head>
              <title>LOL URL - Home</title>
              <meta name="description" content="Welcome to LOL URL, the best URL shortener and tracker." />
              <meta property="og:title" content="LOL URL - Efficient URL Shortening and Tracking" />
              <meta property="og:description" content="Shorten, share, and track your URLs with LOL URL. Monitor click data, user engagement, and more." />
              <meta property="og:url" content="https://lolurl.site" />
              <meta property="og:type" content="website" />
              <meta property="og:image" content="https://lolurl.site/og-image.jpg" />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="LOL URL - Efficient URL Shortening and Tracking" />
              <meta name="twitter:description" content="Shorten, share, and track your URLs with LOL URL. Monitor click data, user engagement, and more." />
              <meta name="twitter:image" content="https://lolurl.site/twitter-image.jpg" />
            </head>
            <LandingPage />
          </>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <>
            <head>
              <title>LOL URL - Dashboard</title>
              <meta name="description" content="View and manage your shortened URLs and track their performance." />
              <meta property="og:title" content="LOL URL - Efficient URL Shortening and Tracking" />
              <meta property="og:description" content="Shorten, share, and track your URLs with LOL URL. Monitor click data, user engagement, and more." />
              <meta property="og:url" content="https://lolurl.site" />
              <meta property="og:type" content="website" />
              <meta property="og:image" content="https://lolurl.site/og-image.jpg" />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="LOL URL - Efficient URL Shortening and Tracking" />
              <meta name="twitter:description" content="Shorten, share, and track your URLs with LOL URL. Monitor click data, user engagement, and more." />
              <meta name="twitter:image" content="https://lolurl.site/twitter-image.jpg" />
            </head>
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
            <head>
              <title>LOL URL - Auth</title>
              <meta name="description" content="Authenticate to access your LOL URL account." />
              <meta property="og:title" content="LOL URL - Efficient URL Shortening and Tracking" />
              <meta property="og:description" content="Shorten, share, and track your URLs with LOL URL. Monitor click data, user engagement, and more." />
              <meta property="og:url" content="https://lolurl.site" />
              <meta property="og:type" content="website" />
              <meta property="og:image" content="https://lolurl.site/og-image.jpg" />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="LOL URL - Efficient URL Shortening and Tracking" />
              <meta name="twitter:description" content="Shorten, share, and track your URLs with LOL URL. Monitor click data, user engagement, and more." />
              <meta name="twitter:image" content="https://lolurl.site/twitter-image.jpg" />
            </head>
            <Auth />
          </>
        )
      },
      {
        path: "/link/:id",
        element: (
          <>
            <head>
              <title>LOL URL - Link Details</title>
              <meta name="description" content="View detailed analytics for your shortened URL." />
              <meta property="og:title" content="LOL URL - Efficient URL Shortening and Tracking" />
              <meta property="og:description" content="Shorten, share, and track your URLs with LOL URL. Monitor click data, user engagement, and more." />
              <meta property="og:url" content="https://lolurl.site" />
              <meta property="og:type" content="website" />
              <meta property="og:image" content="https://lolurl.site/og-image.jpg" />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="LOL URL - Efficient URL Shortening and Tracking" />
              <meta name="twitter:description" content="Shorten, share, and track your URLs with LOL URL. Monitor click data, user engagement, and more." />
              <meta name="twitter:image" content="https://lolurl.site/twitter-image.jpg" />
            </head>
            <RequireAuth>
              <Link />
            </RequireAuth>
          </>
        ),
      },
      {
        path: "/workspace-settings",
        element: (
          <>
            <head>
              <title>LOL URL - Workspace Settings</title>
              <meta name="description" content="Manage your workspace settings, members, and invitations." />
            </head>
            <RequireAuth>
              <WorkspaceSettings />
            </RequireAuth>
          </>
        ),
      },
      {
        path: "/invite/:token",
        element: (
          <>
            <head>
              <title>LOL URL - Accept Workspace Invite</title>
              <meta name="description" content="Join a workspace and collaborate with your team." />
            </head>
            <AcceptInvite />
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
    <ErrorBoundary>
      <UrlProvider>
        <RouterProvider router={router} />
        <Analytics />
      </UrlProvider>
    </ErrorBoundary>
  );
}

export default App;
