import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Affiliate from "./pages/Affiliate";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import { useUser } from "./context/UserContext"; // ✅ Import User Context
import "./styles/global.css"; // ✅ Global Styles

function ProtectedRoute({ element }) {
  const { user } = useUser();
  const location = useLocation();

  return user ? element : <Navigate to="/" state={{ from: location }} />;
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar /> {/* ✅ Sidebar Always Visible */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/wallet" element={<ProtectedRoute element={<Wallet />} />} />
            <Route path="/affiliate" element={<ProtectedRoute element={<Affiliate />} />} />
            <Route path="/chat" element={<ProtectedRoute element={<Chat />} />} />
            <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} /> {/* ✅ Handle Unknown Routes */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;