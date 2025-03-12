import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/Wallet.css"; // ✅ Ensure this file exists
import DepositWithdrawPopup from "../components/DepositWithdrawPopup"; // ✅ Import popup
import { useUser } from "../context/UserContext"; // ✅ Import User Context

function Wallet() {
  const { user } = useUser(); // ✅ Get User Data from Context
  const [popupType, setPopupType] = useState(null); // ✅ Control popups
  const [transactions, setTransactions] = useState([]); // ✅ Store transactions

  // ✅ Fetch Transaction History
  useEffect(() => {
    if (!user) return; // ✅ Prevent fetching if user is not loaded

    fetch(`https://console-cecxai-ed25296a7384.herokuapp.com/api/auth/transactions/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTransactions(data.transactions); // ✅ Set transaction history
        } else {
          console.error("Error fetching transactions:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching transactions:", error));
  }, [user]); // ✅ Runs when user data is available

  return (
    <motion.div
      className="wallet-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="wallet-title">Wallet Overview</h1>

      <div className="wallet-grid">
        {/* ✅ Main Wallet */}
        <motion.div
          className="wallet-box main-wallet"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Main Wallet</h2>
          <p className="balance">{user ? `$${user.balance}` : "Loading..."}</p>
          <div className="wallet-actions">
            <button className="wallet-btn" onClick={() => setPopupType("deposit")}>Deposit</button>
            <button className="wallet-btn" onClick={() => setPopupType("withdraw")}>Withdraw</button>
          </div>
        </motion.div>

        {/* ✅ Commission Wallet */}
        <motion.div
          className="wallet-box commission-wallet"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Commission</h2>
          <p className="balance">{user ? `$${user.commission_balance}` : "Loading..."}</p>
          <div className="wallet-actions">
            <button className="wallet-btn" onClick={() => setPopupType("withdraw")}>Withdraw</button>
          </div>
        </motion.div>
      </div>

      {/* ✅ Transaction History */}
      <motion.div
        className="transaction-history"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Transaction History</h2>
        <div className="transaction-list">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <motion.div
                key={tx.id}
                className={`transaction-item ${tx.type.toLowerCase()}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <span className="tx-type">{tx.type}</span>
                <span className="tx-amount">{tx.amount > 0 ? `+ $${tx.amount}` : `- $${Math.abs(tx.amount)}`}</span>
                <span className="tx-date">{tx.date}</span>
                <span className="tx-status">{tx.status}</span>
              </motion.div>
            ))
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
      </motion.div>

      {/* ✅ Deposit & Withdraw Popups */}
      {popupType && <DepositWithdrawPopup type={popupType} onClose={() => setPopupType(null)} />}
    </motion.div>
  );
}

export default Wallet;
