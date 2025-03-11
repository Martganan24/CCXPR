import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/Wallet.css"; // ✅ Make sure this file exists
import DepositWithdrawPopup from "../components/DepositWithdrawPopup"; // ✅ Added Popup Import

const transactionsData = [
  { id: 1, type: "Deposit", amount: "+$500.00", date: "Mar 9, 2025", time: "10:30 AM", status: "Completed" },
  { id: 2, type: "Withdraw", amount: "-$200.00", date: "Mar 8, 2025", time: "5:45 PM", status: "Completed" },
  { id: 3, type: "Profit", amount: "+$150.00", date: "Mar 7, 2025", time: "2:15 PM", status: "Completed" },
  { id: 4, type: "Loss", amount: "-$75.00", date: "Mar 6, 2025", time: "11:10 AM", status: "Completed" },
  { id: 5, type: "Commission", amount: "+$50.00", date: "Mar 5, 2025", time: "3:20 PM", status: "Completed" },
];

function Wallet() {
  const [transactions] = useState(transactionsData); // ✅ Store transaction history
  const [popupType, setPopupType] = useState(null); // ✅ Added state to control popups

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
          <p className="balance">$12,345.67</p>
          <div className="wallet-actions">
            <button className="wallet-btn" onClick={() => setPopupType("deposit")}>Deposit</button> {/* ✅ Added click event */}
            <button className="wallet-btn" onClick={() => setPopupType("withdraw")}>Withdraw</button> {/* ✅ Added click event */}
          </div>
        </motion.div>

        {/* ✅ Commission Wallet */}
        <motion.div
          className="wallet-box commission-wallet"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Commission</h2>
          <p className="balance">$987.65</p>
          <div className="wallet-actions">
            <button className="wallet-btn" onClick={() => setPopupType("withdraw")}>Withdraw</button> {/* ✅ Added click event */}
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
          {transactions.map((tx) => (
            <motion.div
              key={tx.id}
              className={`transaction-item ${tx.type.toLowerCase()}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <span className="tx-type">{tx.type}</span>
              <span className="tx-amount">{tx.amount}</span>
              <span className="tx-date">{tx.date} - {tx.time}</span>
              <span className="tx-status">{tx.status}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ✅ Deposit & Withdraw Popups (Only Added This) */}
      {popupType && <DepositWithdrawPopup type={popupType} onClose={() => setPopupType(null)} />}
    </motion.div>
  );
}

export default Wallet;
