import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UrlProvider from "./context";
import AppLayout from "./layouts/app-layout";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UrlProvider>
      <AppLayout>
        <App />
      </AppLayout>
    </UrlProvider>
  </StrictMode>
);
