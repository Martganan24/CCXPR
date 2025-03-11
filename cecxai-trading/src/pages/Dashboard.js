import React, { useEffect } from "react";
import Navbar from "../components/Navbar"; // ✅ Import Navbar
import Sidebar from "../components/Sidebar"; // ✅ Import Sidebar
import TradingChart from "../components/TradingChart"; // ✅ Import Trading Chart
import OrderForm from "../components/OrderForm"; // ✅ Import Order Form
import TradingHistory from "../components/TradingHistory"; // ✅ Import Trading History
import { useNavigate } from "react-router-dom"; // Import React Router v6 for redirection

function Dashboard() {
  const navigate = useNavigate(); // React Router's navigate hook to redirect

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Check if token exists
    if (!token) {
      // If no token, redirect to login page
      navigate("/"); // Redirect to the front page, not login page
    }
  }, [navigate]); // Only run when the component is mounted

  return (
    <div className="dashboard-container">
      <Navbar />
      <Sidebar /> {/* 🔥 Sidebar */}

      {/* 🔥 Very Tiny Space Line */}
      <div style={{ height: "2px" }}></div>

      {/* 🔥 Two Sections Layout */}
      <div className="dashboard-layout">
        {/* Left Side - Trading Chart */}
        <TradingChart />

        {/* Right Side - Order Form */}
        <OrderForm />
      </div>

      {/* 🔥 Trading History Section - Added Below */}
      <TradingHistory />
    </div>
  );
}

export default Dashboard;
