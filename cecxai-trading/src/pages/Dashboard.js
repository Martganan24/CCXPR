import React, { useEffect } from "react";
import Navbar from "../components/Navbar"; // ✅ Import Navbar
import Sidebar from "../components/Sidebar"; // ✅ Import Sidebar
import TradingChart from "../components/TradingChart"; // ✅ Import Trading Chart
import OrderForm from "../components/OrderForm"; // ✅ Import Order Form
import TradingHistory from "../components/TradingHistory"; // ✅ Import Trading History
import { useNavigate } from "react-router-dom"; // ✅ Import React Router
import { useUser } from "../context/UserContext"; // ✅ Import User Context

function Dashboard() {
  const navigate = useNavigate(); // ✅ Navigation Hook
  const { user, loading } = useUser(); // ✅ Get User Data from Context

  useEffect(() => {
    if (!user && !loading) {
      navigate("/"); // ❌ Redirect to Front Page if No User Data
    }
  }, [user, loading, navigate]);

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
