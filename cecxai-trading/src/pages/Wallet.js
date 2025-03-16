import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/Wallet.css";
import Deposit from "../components/Deposit";
import Withdraw from "../components/Withdraw";
import { useUser } from "../context/UserContext";
import { supabase } from "./supabase";

const Wallet = () => {
  const { user } = useUser();
  const balance = user ? user.balance : 0;
  const commissionBalance = user ? user.commission_balance : 0;

  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [isDepositPopupVisible, setIsDepositPopupVisible] = useState(false);
  const [isWithdrawPopupVisible, setIsWithdrawPopupVisible] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data: withdrawals, error: withdrawalsError } = await supabase
        .from("withdrawals")
        .select("*");

      const { data: deposits, error: depositsError } = await supabase
        .from("deposits")
        .select("*");

      if (withdrawalsError || depositsError) {
        console.error("Error fetching transactions:", withdrawalsError || depositsError);
        return;
      }

      const combinedTransactions = [
        ...withdrawals.map((tx) => ({ ...tx, type: "Withdraw", status: tx.status })),
        ...deposits.map((tx) => ({ ...tx, type: "Deposit", status: tx.status })),
      ];

      const sortedTransactions = combinedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(sortedTransactions);
    };

    fetchTransactions();
  }, []);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <motion.div className="wallet-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="wallet-title">Wallet Overview</h1>
      <div className="wallet-grid">
        <motion.div className="wallet-box main-wallet" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
          <h2>Main Wallet</h2>
          <p className="balance">${balance}</p>
          <div className="wallet-actions">
            <button className="wallet-btn" onClick={() => setIsDepositPopupVisible(true)}>Deposit</button>
            <button className="wallet-btn" onClick={() => setIsWithdrawPopupVisible(true)}>Withdraw</button>
          </div>
        </motion.div>
        <motion.div className="wallet-box commission-wallet" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
          <h2>Commission</h2>
          <p className="balance">${commissionBalance}</p>
          <div className="wallet-actions">
            <button className="wallet-btn" onClick={() => setIsWithdrawPopupVisible(true)}>Withdraw</button>
          </div>
        </motion.div>
      </div>
      <motion.div className="transaction-history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h2>Transaction History</h2>
        <div className="transaction-list">
          {currentTransactions.length > 0 ? (
            currentTransactions.map((tx) => (
              <motion.div key={tx.id} className={`transaction-item ${tx.type.toLowerCase()}`} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                <span className="tx-type">{tx.type}</span>
                <span className="tx-amount">${tx.amount}</span>
                <span className="tx-date">{tx.date} - {tx.time}</span>
                <span className="tx-status">{tx.status}</span>
              </motion.div>
            ))
          ) : (
            <div>No transactions found.</div>
          )}
        </div>
      </motion.div>
      <div className="pagination">
        {transactions.length > rowsPerPage && (
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        )}
        {Array.from({ length: Math.ceil(transactions.length / rowsPerPage) }, (_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
        ))}
        {transactions.length > rowsPerPage && (
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === Math.ceil(transactions.length / rowsPerPage)}>Next</button>
        )}
      </div>
      {isDepositPopupVisible && <Deposit onClose={() => setIsDepositPopupVisible(false)} />}
      {isWithdrawPopupVisible && <Withdraw onClose={() => setIsWithdrawPopupVisible(false)} />}
    </motion.div>
  );
};

export default Wallet;
