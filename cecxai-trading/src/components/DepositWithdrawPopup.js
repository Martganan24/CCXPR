import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify"; // Import toast notifications
import "react-toastify/dist/ReactToastify.css";
import "../styles/Popup.css"; // Ensure this file exists
import { supabase } from "../supabaseClient"; // Ensure Supabase is correctly initialized

// Initialize toast notifications
import { ToastContainer } from "react-toastify";

const DepositWithdrawPopup = ({ type, onClose }) => {
  const [selectedToken, setSelectedToken] = useState("BTC");
  const [walletAddress, setWalletAddress] = useState("15UwrDBZhrNcgJVnx6xTLNepQg69dPnay9"); // Default BTC address
  const [amount, setAmount] = useState("");
  const [recipientWallet, setRecipientWallet] = useState("");
  const [txid, setTxid] = useState("");
  const [copied, setCopied] = useState(false);

  const walletAddresses = {
    BTC: "15UwrDBZhrNcgJVnx6xTLNepQg69dPnay9",
    ETH: "0xdff3195fef04d5531614c1461c48ae55e0a2e7ed",
    USDT: "TM78QTsBXxDmLRMvMxTfsBRLUek1SgPfcU",
  };

  const handleTokenChange = (token) => {
    setSelectedToken(token);
    setWalletAddress(walletAddresses[token]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!amount) {
      toast.error("Please enter an amount."); // Show error notification
      return;
    }

    const transactionData = {
      token: selectedToken,
      amount,
      status: "pending",
      ...(type === "withdraw" && { recipient_wallet: recipientWallet }),
      ...(type === "deposit" && { txid })
    };

    try {
      const { data, error } = await supabase
        .from(type === "deposit" ? 'deposits' : 'withdrawals')
        .insert([transactionData]);

      if (error) {
        toast.error(`Error submitting ${type}: ${error.message}`); // Show error notification
      } else {
        toast.success(`${type === "deposit" ? "Deposit" : "Withdrawal"} submitted successfully!`); // Show success notification
        onClose();
      }
    } catch (err) {
      toast.error("Unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
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

          {type === "deposit" && (
            <>
              <label>Wallet Address:</label>
              <div className="wallet-address">
                <input type="text" value={walletAddress} readOnly />
                <button onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
              </div>
              <label>Transaction Receipt TxID Hash:</label>
              <input
                type="text"
                value={txid}
                onChange={(e) => setTxid(e.target.value)}
                placeholder="Enter TxID Hash"
              />
            </>
          )}

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

          <label>Enter Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />

          <div className="popup-actions">
            <button className="submit-btn" onClick={handleSubmit}>
              {type === "deposit" ? "Submit Deposit" : "Submit Withdrawal"}
            </button>
            <button className="close-btn" onClick={onClose}>Close</button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default DepositWithdrawPopup;
