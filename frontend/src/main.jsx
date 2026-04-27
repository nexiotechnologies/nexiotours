import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from '@clerk/react';
import App from "./App";
import ErrorBoundary from "./components/common/ErrorBoundary";
import "./styles/global.css";

const PUBLISHABLE_KEY = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
