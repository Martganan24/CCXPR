import React from "react";
import Navbar from "../components/Navbar"; // ✅ Import Navbar
import Sidebar from "../components/Sidebar"; // ✅ Import Sidebar
import TradingChart from "../components/TradingChart"; // ✅ Import Trading Chart
import OrderForm from "../components/OrderForm"; // ✅ Import Order Form
import TradingHistory from "../components/TradingHistory"; // ✅ Import Trading History

function Dashboard() {
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
