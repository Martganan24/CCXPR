import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Affiliate from "./pages/Affiliate";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import "./styles/global.css"; // ✅ Global Styles

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar /> {/* ✅ Sidebar Always Visible */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/affiliate" element={<Affiliate />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} /> {/* ✅ Handle Unknown Routes */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
