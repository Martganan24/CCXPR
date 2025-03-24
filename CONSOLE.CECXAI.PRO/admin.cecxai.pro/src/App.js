import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import UserTransactions from "./pages/UserTransactions";  // Import UserTransactions
import AdminChat from "./pages/AdminChat";

function App() {
  const isAuthenticated = localStorage.getItem("adminToken");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/transactions" element={isAuthenticated ? <Transactions /> : <Navigate to="/login" />} />
        
        {/* Add the route for user-specific transactions */}
        <Route path="/user-transactions/:userId" element={isAuthenticated ? <UserTransactions /> : <Navigate to="/login" />} />
        
        <Route path="/admin-chat" element={isAuthenticated ? <AdminChat /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
