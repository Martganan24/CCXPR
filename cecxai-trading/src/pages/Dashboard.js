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
      
      {/* 🔥 Trading Sections */}
      <div style={{ height: "2px" }}></div>
      <div className="dashboard-layout">
        <TradingChart />
        <OrderForm />
      </div>

      <TradingHistory />
    </div>
  );
}

export default Dashboard;
 