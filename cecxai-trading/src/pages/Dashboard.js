import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // ✅ Import Navbar
import Sidebar from "../components/Sidebar"; // ✅ Import Sidebar
import TradingChart from "../components/TradingChart"; // ✅ Import Trading Chart
import OrderForm from "../components/OrderForm"; // ✅ Import Order Form
import TradingHistory from "../components/TradingHistory"; // ✅ Import Trading History
import { useNavigate } from "react-router-dom"; // React Router v6 for redirection

function Dashboard() {
  const navigate = useNavigate(); // React Router's navigate hook to redirect
  const [userData, setUserData] = useState(null); // Store user data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Check if token exists
    if (!token) {
      navigate("/login"); // Redirect to login page if no token
    } else {
      // Fetch user-specific data from backend
      fetchUserData(token);
    }
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("https://console-cecxai-ed25296a7384.herokuapp.com/api/protected/user-data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data); // Set the user data to state
        setLoading(false); // Set loading to false after data is fetched
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

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

      {/* Display user-specific data */}
      <div className="user-data">
        <h2>Welcome, {userData.username}</h2>
        <p>Balance: ${userData.balance}</p>
        {/* Add more user-specific data here */}
      </div>
    </div>
  );
}

export default Dashboard;
