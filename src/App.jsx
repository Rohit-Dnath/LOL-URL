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

const router = createBrowserRouter([
  {
    element: <AppLayout />,
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
        path: "/:id",
        element: (
          <>
            <head>
              <title>LOL URL - Redirecting...</title>
              <meta name="description" content="Redirecting to your destination URL." />
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
            <RedirectLink />
          </>
        ),
      },
      {
        path: "*",
        element: (
          <>
            <head>
              <title>LOL URL - Not Found</title>
              <meta name="description" content="The page you are looking for does not exist." />
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
            <div>Not Found</div>
          </>
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
