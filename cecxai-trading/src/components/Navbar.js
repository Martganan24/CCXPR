import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import Deposit from "./Deposit";

const Logo = ({ logoStyle }) => {
  return <img src="/assets/Logo.png" alt="CECXAI Logo" className="navbar-logo" style={logoStyle} />;
};

const Balance = ({ balanceStyle }) => {
  const { user } = useUser();
  return (
    <button className="balance-button" style={balanceStyle}>
      {user ? `$${user.balance}` : "Loading..."}
    </button>
  );
};

const DepositButton = ({ buttonStyle, onClick }) => {
  return (
    <button className="deposit-button" style={buttonStyle} onClick={onClick}>
      Deposit
    </button>
  );
};

const NotificationBell = ({ bellStyle }) => {
  return (
    <button className="notification-button" style={bellStyle}>
      🔔
    </button>
  );
};

function Navbar() {
  const [showDepositPopup, setShowDepositPopup] = useState(false);

  const logoStyle = {};
  const balanceStyle = {};
  const buttonStyle = {};
  const bellStyle = {};

  return (
    <div className="navbar">
      <Logo logoStyle={logoStyle} />
      <div className="navbar-right">
        <Balance balanceStyle={balanceStyle} />
        <DepositButton buttonStyle={buttonStyle} onClick={() => setShowDepositPopup(true)} />
        <NotificationBell bellStyle={bellStyle} />
      </div>
      {showDepositPopup && <Deposit onClose={() => setShowDepositPopup(false)} />}
    </div>
  );
}

export default Navbar;
