import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/Popup.css"; // ✅ Ensure you have this file

function DepositPopup({ onClose }) {
  const [selectedToken, setSelectedToken] = useState("BTC");
  const walletAddresses = {
    BTC: "15UwrDBZhrNcgJVnx6xTLNepQg69dPnay9",
    ETH: "0xdff3195fef04d5531614c1461c48ae55e0a2e7ed",
    USDT: "TM78QTsBXxDmLRMvMxTfsBRLUek1SgPfcU",
  };

  return (
    <motion.div className="popup-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="popup-box" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
        <h2>Deposit Funds</h2>

        {/* ✅ Select Token */}
        <label>Select Token:</label>
        <select value={selectedToken} onChange={(e) => setSelectedToken(e.target.value)}>
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
          <option value="USDT">USDT</option>
        </select>

        {/* ✅ Display Wallet Address */}
        <label>Wallet Address:</label>
        <div className="wallet-address">
          <span>{walletAddresses[selectedToken]}</span>
          <button onClick={() => navigator.clipboard.writeText(walletAddresses[selectedToken])}>
            Copy
          </button>
        </div>

        {/* ✅ Amount Input */}
        <label>Enter Amount:</label>
        <input type="number" placeholder="Enter amount" />

        {/* ✅ Upload Receipt */}
        <label>Upload Receipt:</label>
        <input type="file" accept="image/*" />

        {/* ✅ Buttons */}
        <div className="popup-actions">
          <button className="submit-btn">Submit</button>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DepositPopup;
