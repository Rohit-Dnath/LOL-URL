import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import React from "react";
import "./index.css";
import Dashboard from "./pages/dashboard";
import LandingPage from "./pages/landing";
import Auth from "./pages/auth";
import Link from "./pages/link";
import RedirectLink from "./pages/redirect-link";
import UrlProvider from "./context";
import RequireAuth from "./components/require-auth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/link/:id"
          element={
            <RequireAuth>
              <Link />
            </RequireAuth>
          }
        />
        <Route path="/:id" element={<RedirectLink />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
