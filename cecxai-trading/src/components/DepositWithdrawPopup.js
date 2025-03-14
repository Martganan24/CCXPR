import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/Popup.css"; // ✅ Ensure this file exists

const DepositWithdrawPopup = ({ type, onClose }) => {
  const [selectedToken, setSelectedToken] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [recipientWallet, setRecipientWallet] = useState("");

  // ✅ Dummy wallet addresses
  const walletAddresses = {
    BTC: "15UwrDBZhrNcgJVnx6xTLNepQg69dPnay9",
    ETH: "0xdff3195fef04d5531614c1461c48ae55e0a2e7ed",
    USDT: "TM78QTsBXxDmLRMvMxTfsBRLUek1SgPfcU",
  };

  // ✅ Handle token selection
  const handleTokenChange = (token) => {
    setSelectedToken(token);
    setWalletAddress(walletAddresses[token]);
  };

  // ✅ Handle file upload
  const handleFileChange = (e) => {
    setReceipt(e.target.files[0]);
  };

  return (
    <motion.div
      className="popup-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="popup-box glassmorphism"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <h2 className="popup-title">{type === "deposit" ? "Deposit Funds" : "Withdraw Funds"}</h2>

        {/* ✅ Token Selection */}
        <label>Select Token:</label>
        <div className="token-options">
          {["BTC", "ETH", "USDT"].map((token) => (
            <button
              key={token}
              className={`token-btn ${selectedToken === token ? "active" : ""}`}
              onClick={() => handleTokenChange(token)}
            >
              {token}
            </button>
          ))}
        </div>

        {/* ✅ Show wallet address if deposit */}
        {type === "deposit" && (
          <>
            <label>Wallet Address:</label>
            <div className="wallet-address">
              <input type="text" value={walletAddress} readOnly />
              <button onClick={() => navigator.clipboard.writeText(walletAddress)}>Copy</button>
            </div>
          </>
        )}

        {/* ✅ Show recipient wallet input if withdrawal */}
        {type === "withdraw" && (
          <>
            <label>Enter Your Wallet Address:</label>
            <input
              type="text"
              value={recipientWallet}
              onChange={(e) => setRecipientWallet(e.target.value)}
              placeholder="Enter your wallet address"
            />
          </>
        )}

        {/* ✅ Amount Input */}
        <label>Enter Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />

        {/* ✅ Upload Receipt for Deposit */}
        {type === "deposit" && (
          <>
            <label>Upload Receipt:</label>
            <input type="file" onChange={handleFileChange} />
          </>
        )}

        {/* ✅ Action Buttons */}
        <div className="popup-actions">
          <button className="submit-btn">{type === "deposit" ? "Submit Deposit" : "Submit Withdrawal"}</button>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DepositWithdrawPopup;
