import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/Wallet.css"; // ✅ Ensure this file exists
import DepositWithdrawPopup from "../components/DepositWithdrawPopup"; // ✅ Popup Import
import { supabase } from "./supabase"; // Importing Supabase client
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

const Wallet = () => {
  const [user, setUser] = useState(null); // Store user data manually
  const [transactions, setTransactions] = useState([]); // State to hold transaction data
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
  const [popupType, setPopupType] = useState(null); // Type for the popup (deposit or withdraw)

  useEffect(() => {
    // Function to restore user session manually
    const restoreUserSession = async () => {
      const token = localStorage.getItem("authToken"); // Get authToken from localStorage
      if (!token) {
        console.error("No token found in localStorage.");
        return; // If no token, return early
      }

      try {
        const decoded = jwtDecode(token); // Decode the token to get user info
        const userId = decoded.userId; // Get userId from decoded token

        console.log("Decoded user ID:", userId); // Debugging line

        // Fetch user data from backend
        const response = await fetch(`https://console-cecxai-ed25296a7384.herokuapp.com/api/auth/user/${userId}`);
        
        if (!response.ok) {
          console.error("Failed to fetch user data:", response.statusText);
          return; // If fetch fails, log the error and stop
        }

        const data = await response.json();

        if (data.success) {
          const { total_referrals, commission_balance, ...userData } = data.user;
          setUser({
            ...userData,
            total_referrals,
            commission_balance,
          });
        } else {
          console.error("Failed to fetch user data:", data.message);
        }
      } catch (error) {
        console.error("Error decoding token or fetching user data:", error);
      }
    };

    restoreUserSession(); // Call restoreUserSession when the component mounts
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user || !user.id) return; // Ensure user is loaded

      const { data: withdrawals, error: withdrawalsError } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("user_id", user.id); // Filter withdrawals by user_id

      const { data: deposits, error: depositsError } = await supabase
        .from("deposits")
        .select("*")
        .eq("user_id", user.id); // Filter deposits by user_id

      if (withdrawalsError || depositsError) {
        console.error("Error fetching transactions:", withdrawalsError || depositsError);
        return;
      }

      const combinedTransactions = [
        ...withdrawals.map(tx => ({ ...tx, type: "Withdraw", status: tx.status, date: tx.created_at })),
        ...deposits.map(tx => ({ ...tx, type: "Deposit", status: tx.status, date: tx.created_at })),
      ];

      const sortedTransactions = combinedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(sortedTransactions);
    };

    if (user) fetchTransactions(); // Fetch transactions only if user is loaded
  }, [user]); // Fetch transactions whenever the user changes

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDepositClick = () => {
    setPopupType("deposit");
    setIsPopupVisible(true);
  };

  const handleWithdrawClick = () => {
    setPopupType("withdraw");
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setPopupType(null);
  };

  const balance = user ? user.balance : 0; // Assuming balance exists in the user object
  const commissionBalance = user ? user.commission_balance : 0; // Commission balance from the user context

  return (
    <motion.div
      className="wallet-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="wallet-title">Wallet Overview</h1>

      <div className="wallet-grid">
        <motion.div
          className="wallet-box main-wallet"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Main Wallet</h2>
          <p className="balance">${balance}</p>
          <div className="wallet-actions">
            <button className="wallet-btn" onClick={handleDepositClick}>Deposit</button>
            <button className="wallet-btn" onClick={handleWithdrawClick}>Withdraw</button>
          </div>
        </motion.div>

        <motion.div
          className="wallet-box commission-wallet"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Commission</h2>
          <p className="balance">${commissionBalance}</p>
          <div className="wallet-actions">
            <button className="wallet-btn" onClick={handleWithdrawClick}>Withdraw</button>
          </div>
        </motion.div>
      </div>

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
                <span className="tx-amount">${tx.amount}</span>
                <span className="tx-date">{tx.date ? new Date(tx.date).toLocaleDateString() : "Unknown Date"}</span>
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

      {isPopupVisible && (
        <DepositWithdrawPopup type={popupType} onClose={closePopup} />
      )}
    </motion.div>
  );
};

export default Wallet;
