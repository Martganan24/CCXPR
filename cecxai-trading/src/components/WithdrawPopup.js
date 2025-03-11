import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/Popup.css"; // ✅ Ensure you have this file

function WithdrawPopup({ onClose }) {
  const [selectedToken, setSelectedToken] = useState("BTC");
  const [walletAddress, setWalletAddress] = useState("");

  return (
    <motion.div className="popup-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="popup-box" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
        <h2>Withdraw Funds</h2>

        {/* ✅ Select Token */}
        <label>Select Token:</label>
        <select value={selectedToken} onChange={(e) => setSelectedToken(e.target.value)}>
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
          <option value="USDT">USDT</option>
        </select>

        {/* ✅ Enter Wallet Address */}
        <label>Recipient Wallet Address:</label>
        <input
          type="text"
          placeholder="Enter recipient wallet"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />

        {/* ✅ Enter Amount */}
        <label>Enter Amount:</label>
        <input type="number" placeholder="Enter amount" />

        {/* ✅ Buttons */}
        <div className="popup-actions">
          <button className="submit-btn">Submit</button>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default WithdrawPopup;
