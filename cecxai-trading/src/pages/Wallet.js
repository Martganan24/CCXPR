import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/Wallet.css"; // ✅ Ensure this file exists
import DepositWithdrawPopup from "../components/DepositWithdrawPopup"; // ✅ Popup Import

const transactionsData = [
  { id: 1, type: "Deposit", amount: "+$500.00", date: "Mar 9, 2025", time: "10:30 AM", status: "Completed" },
  { id: 2, type: "Withdraw", amount: "-$200.00", date: "Mar 8, 2025", time: "5:45 PM", status: "Completed" },
  { id: 3, type: "Profit", amount: "+$150.00", date: "Mar 7, 2025", time: "2:15 PM", status: "Completed" },
  { id: 4, type: "Loss", amount: "-$75.00", date: "Mar 6, 2025", time: "11:10 AM", status: "Completed" },
  { id: 5, type: "Commission", amount: "+$50.00", date: "Mar 5, 2025", time: "3:20 PM", status: "Completed" },
  { id: 6, type: "Deposit", amount: "+$1,000.00", date: "Mar 4, 2025", time: "9:00 AM", status: "Completed" },
  { id: 7, type: "Withdraw", amount: "-$300.00", date: "Mar 3, 2025", time: "12:30 PM", status: "Completed" },
  { id: 8, type: "Profit", amount: "+$200.00", date: "Mar 2, 2025", time: "4:00 PM", status: "Completed" },
  { id: 9, type: "Loss", amount: "-$50.00", date: "Mar 1, 2025", time: "8:00 AM", status: "Completed" },
  { id: 10, type: "Commission", amount: "+$100.00", date: "Feb 28, 2025", time: "7:00 PM", status: "Completed" },
  { id: 11, type: "Deposit", amount: "+$2,000.00", date: "Feb 27, 2025", time: "10:00 AM", status: "Completed" },
  { id: 12, type: "Withdraw", amount: "-$500.00", date: "Feb 26, 2025", time: "11:30 AM", status: "Completed" },
];

const Wallet = () => {
  const [transactions] = useState(transactionsData); // ✅ Store transaction history

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Get the current page's transactions
  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <motion.div
      className="wallet-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="wallet-title">Wallet Overview</h1>

      <div className="wallet-grid">
        {/* Main Wallet */}
        <motion.div
          className="wallet-box main-wallet"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Main Wallet</h2>
          <p className="balance">$12,345.67</p>
          <div className="wallet-actions">
            <button className="wallet-btn">Deposit</button>
            <button className="wallet-btn">Withdraw</button>
          </div>
        </motion.div>

        {/* Commission Wallet */}
        <motion.div
          className="wallet-box commission-wallet"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Commission</h2>
          <p className="balance">$987.65</p>
          <div className="wallet-actions">
            <button className="wallet-btn">Withdraw</button>
          </div>
        </motion.div>
      </div>

      {/* Transaction History */}
      <motion.div
        className="transaction-history"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Transaction History</h2>
        <div className="transaction-list">
          {currentTransactions.length > 0 ? (
            currentTransactions.map((tx) => (
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
            ))
          ) : (
            <div>No transactions found.</div>
          )}
        </div>
      </motion.div>

      {/* Pagination */}
      <div className="pagination">
        {transactions.length > rowsPerPage && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        )}
        {Array.from({ length: Math.ceil(transactions.length / rowsPerPage) }, (_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
        {transactions.length > rowsPerPage && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(transactions.length / rowsPerPage)}
          >
            Next
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Wallet;
