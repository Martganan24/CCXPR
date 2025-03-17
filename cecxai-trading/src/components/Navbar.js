import React from "react";
import { useUser } from "../context/UserContext"; // ✅ Import User Context

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

// Customizable Notification Bell Component
const NotificationBell = ({ bellStyle }) => {
  return (
    <button className="notification-button" style={bellStyle}>
      🔔
    </button>
  );
};

function Navbar() {
  // Define styles for customization (these can be passed as props)
  const logoStyle = { /* Default styling for the logo */ };
  const balanceStyle = { /* Default styling for the balance button */ };
  const bellStyle = { /* Default styling for the notification bell */ };

  return (
    <div className="navbar">
      {/* Customizable Logo */}
      <Logo logoStyle={logoStyle} />

      {/* Navbar Right Section */}
      <div className="navbar-right">
        {/* Customizable Balance Button */}
        <Balance balanceStyle={balanceStyle} />

        {/* Customizable Notification Bell */}
        <NotificationBell bellStyle={bellStyle} />
      </div>
    </div>
  );
}

export default Navbar;
