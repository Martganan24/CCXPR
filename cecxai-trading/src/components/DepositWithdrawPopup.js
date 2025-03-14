import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/Popup.css"; // Ensure this file exists
import { supabase } from "../supabaseClient"; // Make sure to initialize supabase client correctly

const DepositWithdrawPopup = ({ type, onClose, userId }) => {
  const [selectedToken, setSelectedToken] = useState("BTC");
  const [walletAddress, setWalletAddress] = useState("15UwrDBZhrNcgJVnx6xTLNepQg69dPnay9"); // Default BTC address
  const [amount, setAmount] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [recipientWallet, setRecipientWallet] = useState("");
  const [copied, setCopied] = useState(false); // State for tracking copy status
  const [receiptUrl, setReceiptUrl] = useState(""); // State for the uploaded receipt URL
  const [fileName, setFileName] = useState(""); // State to store file name
  const [notification, setNotification] = useState(""); // State to store notification message

  // Dummy wallet addresses
  const walletAddresses = {
    BTC: "15UwrDBZhrNcgJVnx6xTLNepQg69dPnay9",
    ETH: "0xdff3195fef04d5531614c1461c48ae55e0a2e7ed",
    USDT: "TM78QTsBXxDmLRMvMxTfsBRLUek1SgPfcU",
  };

  // Handle token selection
  const handleTokenChange = (token) => {
    setSelectedToken(token);
    setWalletAddress(walletAddresses[token]);
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceipt(file);
      setFileName(file.name); // Display the file name
    } else {
      console.log("No file selected.");
    }
  };

  // Handle copy function with auto update to "Copied!"
  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true); // Update button text to "Copied!"
    setTimeout(() => setCopied(false), 2000); // Reset to original text after 2 seconds
  };

  // Handle submit (single handler for both deposit and withdrawal)
  const handleSubmit = async () => {
    if (!amount || (type === "deposit" && !receiptUrl)) {
      console.log("Please enter amount and upload a receipt.");
      setNotification("Please enter amount and upload a receipt.");
      return;
    }

    const transactionData = {
      token: selectedToken,
      amount,
      status: "pending", // Default status
      ...(type === "deposit" && { receipt: receiptUrl }), // Only include receipt for deposits
      ...(type === "withdraw" && { recipient_wallet: recipientWallet }), // Include recipient wallet for withdrawals
    };

    console.log("Submitting transaction data:", transactionData);

    try {
      // Insert transaction data into Supabase (or other database)
      const { data, error } = await supabase
        .from(type === "deposit" ? 'deposits' : 'withdrawals') // Use different tables for deposit and withdrawal
        .insert([transactionData]);

      if (error) {
        console.error("Error submitting transaction:", error.message); // Display detailed error message
        setNotification(`Error: ${error.message}`);
      } else {
        console.log(`${type === "deposit" ? "Deposit" : "Withdrawal"} submitted successfully:`, data);

        // If it's a withdrawal, deduct the amount from the user's balance
        if (type === "withdraw") {
          // Fetch the current balance first
          const { data: userData, error: balanceError } = await supabase
            .from("users") // Assuming balance is stored in the "users" table
            .select("balance")
            .eq("id", userId) // Use the unique user ID for querying
            .single(); // Ensure a single row is returned

          if (balanceError) {
            console.error("Error fetching balance:", balanceError.message);
            setNotification("Error fetching balance for deduction.");
            return;
          }

          const currentBalance = userData.balance;
          const newBalance = currentBalance - parseFloat(amount);

          // Update the balance after the withdrawal
          const { updateError } = await supabase
            .from("users")
            .update({ balance: newBalance })
            .eq("id", userId);

          if (updateError) {
            console.error("Error updating balance:", updateError.message);
            setNotification("Error updating balance after withdrawal.");
          } else {
            console.log("Balance updated successfully after withdrawal.");
            setNotification("Withdrawal successful, balance updated.");
          }
        }

        // Optionally clear fields or close popup
        onClose(); // Close the popup after successful submission
      }
    } catch (err) {
      console.error("Unexpected error during submit:", err); // Catch any unexpected errors during submission
      setNotification("Unexpected error. Please try again.");
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

        {/* Notification */}
        {notification && <div className="notification">{notification}</div>}

        {/* Token Selection */}
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

        {/* Show wallet address if deposit */}
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

        {/* Show recipient wallet input if withdrawal */}
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

        {/* Amount Input */}
        <label>Enter Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />

        {/* Upload Receipt for Deposit */}
        {type === "deposit" && (
          <>
            <label>Upload Receipt:</label>
            <input type="file" onChange={handleFileChange} />
            {/* Show the file name after selection */}
            {fileName && <p>Selected File: {fileName}</p>}
          </>
        )}

        {/* Action Buttons moved up here */}
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
