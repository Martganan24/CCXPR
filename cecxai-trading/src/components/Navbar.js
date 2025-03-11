import React, { useState } from "react";
import DepositWithdrawPopup from "./DepositWithdrawPopup"; // ✅ Import popup

function Navbar() {
  const [showDepositPopup, setShowDepositPopup] = useState(false); // ✅ State to show/hide popup

  return (
    <div className="navbar">
      {/* ✅ Replace text with Logo */}
      <img src="/assets/Logo.png" alt="CECXAI Logo" className="navbar-Logo" />

      {/* 🔥 Navbar Right Section */}
      <div className="navbar-right">
        {/* ✅ Balance as a Button */}
        <button className="balance-button">$10,000</button>

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
