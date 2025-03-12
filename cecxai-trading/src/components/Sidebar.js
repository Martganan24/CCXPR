import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import Navigation Hook
import { useUser } from "../context/UserContext"; // ✅ Import User Context
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
  const { user, logout } = useUser(); // ✅ Get User Data from Context
  const navigate = useNavigate(); // ✅ Initialize Navigation

  return (
    <>
      {/* ✅ Toggle Button */}
      <button className="toggle-btn">
        <FaBars />
      </button>

      <div className="sidebar">
        {/* ✅ Show User Info */}
        {user && (
          <div className="sidebar-user-info">
            <p>👤 {user.username}</p>
            <p>💰 ${user.balance}</p>
          </div>
        )}

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

        {/* ✅ Logout Button */}
        <button className="sidebar-btn logout" onClick={logout}>
          <FaSignOutAlt className="icon" /> Logout
        </button>
      </div>
    </>
  );
}

export default Sidebar;
