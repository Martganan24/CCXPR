import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./context/UserContext"; // ✅ Import Context

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserProvider> {/* ✅ Wrap App inside UserProvider */}
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </UserProvider>
);
