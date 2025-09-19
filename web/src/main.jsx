import React from "react";
import ReactDOM from "react-dom/client";  // <-- REQUIRED import
import App from "./App";
import { AuthProvider } from "./authContext";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
