import React, { useState } from "react";
import { useUser } from "../context/UserContext"; // ✅ Import User Context
import DepositWithdrawPopup from "./DepositWithdrawPopup"; // ✅ Import popup

function Navbar() {
  const [showDepositPopup, setShowDepositPopup] = useState(false); // ✅ State to show/hide popup
  const { user } = useUser(); // ✅ Get User Data from Context

  return (
    <div className="navbar">
      {/* ✅ Replace text with Logo */}
      <img src="/assets/Logo.png" alt="CECXAI Logo" className="navbar-Logo" />

      {/* 🔥 Navbar Right Section */}
      <div className="navbar-right">
        {/* ✅ Show User Balance from Context */}
        <button className="balance-button">
          {user ? `$${user.balance}` : "Loading..."}
        </button>

        {/* ✅ Deposit Button (Opens Popup) */}
        <button className="deposit-button" onClick={() => setShowDepositPopup(true)}>
          Deposit
        </button>

        {/* ✅ Notification Bell */}
        <button className="notification-button">🔔</button>
      </div>

      {/* ✅ Deposit Popup */}
      {showDepositPopup && (
        <DepositWithdrawPopup type="deposit" onClose={() => setShowDepositPopup(false)} />
      )}
    </div>
  );
}

export default Navbar;
