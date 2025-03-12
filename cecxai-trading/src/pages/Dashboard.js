import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // ✅ Import Navbar
import Sidebar from "../components/Sidebar"; // ✅ Import Sidebar
import TradingChart from "../components/TradingChart"; // ✅ Import Trading Chart
import OrderForm from "../components/OrderForm"; // ✅ Import Order Form
import TradingHistory from "../components/TradingHistory"; // ✅ Import Trading History
import { useNavigate } from "react-router-dom"; // ✅ Import React Router
import { jwtDecode } from "jwt-decode"; // ✅ Import JWT Decoder

function Dashboard() {
  const navigate = useNavigate(); // ✅ Navigation Hook
  const [user, setUser] = useState(null); // ✅ Store User Data

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // ✅ Get Auth Token
    if (!token) {
      navigate("/"); // ❌ Redirect to Front Page if No Token
      return;
    }

    try {
      // ✅ Decode JWT Token to Get userId
      const decoded = jwtDecode(token);
      const userId = decoded.userId; // 🔥 Extract userId

      // ✅ Fetch User Data from Supabase
      fetch(`https://console-cecxai-ed25296a7384.herokuapp.com/api/auth/user/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUser(data.user); // ✅ Store User Data in State
          } else {
            console.error("Error fetching user:", data.message);
          }
        })
        .catch((error) => console.error("Error fetching user:", error));
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/"); // ❌ Redirect if Token is Invalid
    }
  }, [navigate]); // ✅ Run on Component Mount

  return (
    <div className="dashboard-container">
      <Navbar />
      <Sidebar /> {/* 🔥 Sidebar */}

      {/* ✅ Show User Info on Dashboard */}
      {user ? (
        <div className="user-info">
          <h2>Welcome, {user.username}!</h2>
          <p>Email: {user.email}</p>
          <p>Balance: ${user.balance}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}

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
