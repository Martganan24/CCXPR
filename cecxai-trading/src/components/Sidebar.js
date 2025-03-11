import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import Navigation Hook
import {
  FaChartLine,
  FaWallet,
  FaUsers,
  FaComments,
  FaCog,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa"; // ✅ Sidebar Icons

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // ✅ Sidebar State
  const navigate = useNavigate(); // ✅ Initialize Navigation

  const handleLogout = () => {
    // ✅ Remove token from local storage (to log the user out)
    localStorage.removeItem("authToken");

    // ✅ Redirect user to main front page
    window.location.href = "https://ceccxai-frontend-b334232d6e3e.herokuapp.com/";
  };

  return (
    <>
      {/* ✅ Toggle Button (Always Visible & Clickable) */}
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </button>

      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <button className="sidebar-btn" onClick={() => navigate("/")}>
          <FaChartLine className="icon" /> Trade
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/wallet")}>
          <FaWallet className="icon" /> Wallet
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/affiliate")}>
          <FaUsers className="icon" /> Affiliate
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/chat")}>
          <FaComments className="icon" /> Chat
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/settings")}>
          <FaCog className="icon" /> Settings
        </button>

        {/* ✅ Logout is Now Directly Under Settings */}
        <button className="sidebar-btn logout" onClick={handleLogout}>
          <FaSignOutAlt className="icon" /> Logout
        </button>
      </div>
    </>
  );
}

export default Sidebar;
