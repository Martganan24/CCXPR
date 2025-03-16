import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Popup.css";
import { supabase } from "../supabaseClient";
import { ToastContainer } from "react-toastify";

const Withdraw = ({ onClose }) => {
  const [selectedToken, setSelectedToken] = useState("BTC");
  const [recipientWallet, setRecipientWallet] = useState("");
  const [amount, setAmount] = useState("");

  const handleTokenChange = (token) => {
    setSelectedToken(token);
  };

  const handleSubmit = async () => {
    if (!amount || !recipientWallet) {
      toast.error("Please enter an amount and wallet address.");
      return;
    }

    const transactionData = {
      token: selectedToken,
      amount,
      recipient_wallet: recipientWallet,
      status: "Pending",
    };

    try {
      const { data, error } = await supabase.from("withdrawals").insert([transactionData]);

      if (error) {
        toast.error(`Error submitting withdrawal: ${error.message}`);
      } else {
        toast.success("Withdrawal submitted successfully!");
        onClose();
      }
    } catch (err) {
      toast.error("Unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <motion.div className="popup-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        <motion.div className="popup-box glassmorphism" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeOut" }}>
          <h2 className="popup-title">Withdraw Funds</h2>
          <label>Select Token:</label>
          <div className="token-options">
            {["BTC", "ETH", "USDT"].map((token) => (
              <button key={token} className={`token-btn ${selectedToken === token ? "active" : ""}`} onClick={() => handleTokenChange(token)}>
                {token}
              </button>
            ))}
          </div>
          <label>Enter Your Wallet Address:</label>
          <input type="text" value={recipientWallet} onChange={(e) => setRecipientWallet(e.target.value)} placeholder="Enter your wallet address" />
          <label>Enter Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
          <div className="popup-actions">
            <button className="submit-btn" onClick={handleSubmit}>Submit Withdrawal</button>
            <button className="close-btn" onClick={onClose}>Close</button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Withdraw;
