import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Popup.css";
import { supabase } from "../supabaseClient";
import { ToastContainer } from "react-toastify";

const Deposit = ({ onClose }) => {
  const [selectedToken, setSelectedToken] = useState("BTC");
  const [walletAddress, setWalletAddress] = useState("15UwrDBZhrNcgJVnx6xTLNepQg69dPnay9");
  const [amount, setAmount] = useState("");
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
      toast.error("Please enter an amount.");
      return;
    }

    const transactionData = {
      token: selectedToken,
      amount,
      status: "Pending",
      txid,
    };

    try {
      const { data, error } = await supabase.from("deposits").insert([transactionData]);

      if (error) {
        toast.error(`Error submitting deposit: ${error.message}`);
      } else {
        toast.success("Deposit submitted successfully!");
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
          <h2 className="popup-title">Deposit Funds</h2>
          <label>Select Token:</label>
          <div className="token-options">
            {["BTC", "ETH", "USDT"].map((token) => (
              <button key={token} className={`token-btn ${selectedToken === token ? "active" : ""}`} onClick={() => handleTokenChange(token)}>
                {token}
              </button>
            ))}
          </div>
          <label>Wallet Address:</label>
          <div className="wallet-address">
            <input type="text" value={walletAddress} readOnly />
            <button onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
          </div>
          <label>Transaction Receipt TxID Hash:</label>
          <input type="text" value={txid} onChange={(e) => setTxid(e.target.value)} placeholder="Enter TxID Hash" />
          <label>Enter Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
          <div className="popup-actions">
            <button className="submit-btn" onClick={handleSubmit}>Submit Deposit</button>
            <button className="close-btn" onClick={onClose}>Close</button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Deposit;
