import React, { useState } from "react";
import { useUser } from "../context/UserContext"; // ✅ Import User Context
import Deposit from "./Deposit"; // ✅ Updated to use Deposit.js

// Customizable Logo Component
const Logo = ({ logoStyle }) => {
  return <img src="/assets/Logo.png" alt="CECXAI Logo" className="navbar-logo" style={logoStyle} />;
};

// Customizable Balance Component
const Balance = ({ balanceStyle }) => {
  const { user } = useUser(); // ✅ Get User Data from Context
  return (
    <button className="balance-button" style={balanceStyle}>
      {user ? `$${user.balance}` : "Loading..."}
    </button>
  );
};

// Customizable Deposit Button Component
const DepositButton = ({ buttonStyle, onClick }) => {
  return (
    <button className="deposit-button" style={buttonStyle} onClick={onClick}>
      Deposit
    </button>
  );
};

// Customizable Notification Bell Component
const NotificationBell = ({ bellStyle }) => {
  return (
    <button className="notification-button" style={bellStyle}>
      🔔
    </button>
  );
};

function Navbar() {
  const [showDepositPopup, setShowDepositPopup] = useState(false); // ✅ State to show/hide deposit popup

  // Define styles for customization (these can be passed as props)
  const logoStyle = {}; // Placeholder for logo styles
  const balanceStyle = {}; // Placeholder for balance button styles
  const buttonStyle = {}; // Placeholder for deposit button styles
  const bellStyle = {}; // Placeholder for notification bell styles

  return (
    <div className="navbar">
      {/* Customizable Logo */}
      <Logo logoStyle={logoStyle} />

      {/* Navbar Right Section */}
      <div className="navbar-right">
        {/* Customizable Balance Button */}
        <Balance balanceStyle={balanceStyle} />

        {/* Customizable Deposit Button */}
        <DepositButton buttonStyle={buttonStyle} onClick={() => setShowDepositPopup(true)} />

        {/* Customizable Notification Bell */}
        <NotificationBell bellStyle={bellStyle} />
      </div>

      {/* Deposit Popup */}
      {showDepositPopup && (
        <Deposit onClose={() => setShowDepositPopup(false)} />
      )}
    </div>
  );
}

export default Navbar;