import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/Popup.css"; // ✅ Ensure this file exists
import { supabase } from "../supabaseClient"; // Make sure to initialize supabase client correctly

const DepositWithdrawPopup = ({ type, onClose }) => {
  const [selectedToken, setSelectedToken] = useState("BTC");
  const [walletAddress, setWalletAddress] = useState("15UwrDBZhrNcgJVnx6xTLNepQg69dPnay9"); // Default BTC address
  const [amount, setAmount] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [recipientWallet, setRecipientWallet] = useState("");
  const [copied, setCopied] = useState(false); // State for tracking copy status
  const [receiptUrl, setReceiptUrl] = useState(""); // State for the uploaded receipt URL

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
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setReceipt(file);

    // Upload the file to Supabase storage
    const { data, error } = await supabase
      .storage
      .from('receipts') // The name of the bucket
      .upload(`receipts/${file.name}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error("Error uploading receipt:", error);
    } else {
      const { publicURL, error: urlError } = supabase
        .storage
        .from('receipts')
        .getPublicUrl(data.path); // Get the public URL of the uploaded file

      if (urlError) {
        console.error("Error getting public URL:", urlError);
      } else {
        setReceiptUrl(publicURL); // Save the receipt URL to state
      }
    }
  };

  // ✅ Copy function with auto update to "Copied!"
  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true); // Update button text to "Copied!"
    setTimeout(() => setCopied(false), 2000); // Reset to original text after 2 seconds
  };

  // ✅ Handle submit
  const handleSubmit = async () => {
    // Create the deposit data object
    const depositData = {
      token: selectedToken,
      amount,
      receipt: receiptUrl, // Store the receipt URL in the deposit
      status: "pending", // Default status
    };

    // Submit deposit data to your database (Supabase)
    // Assuming you have a `deposits` table to store the deposit
    const { data, error } = await supabase
      .from('deposits')
      .insert([depositData]);

    if (error) {
      console.error("Error submitting deposit:", error);
    } else {
      console.log("Deposit submitted successfully:", data);
      // You may want to clear fields or close the popup here
    }
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
              <button onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </button>
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
          <button className="submit-btn" onClick={handleSubmit}>
            {type === "deposit" ? "Submit Deposit" : "Submit Withdrawal"}
          </button>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DepositWithdrawPopup;
