import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // ✅ Ensure correct import
import { useUser } from "../context/UserContext"; // ✅ Use same user context as Wallet.js
import "./TradingHistory.css"; // ✅ Ensure this file exists

const TradingHistory = () => {
  const { user } = useUser(); // ✅ Get the logged-in user from context
  const [tradeHistory, setTradeHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // ✅ Fetch trade history only for the logged-in user
  useEffect(() => {
    const fetchTradeHistory = async () => {
      if (!user || !user.id) {
        console.error("No user found. Please log in.");
        return;
      }

      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("user_id", user.id) // ✅ Filter by user_id (same as Wallet.js)
        .order("timestamp", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching trade history:", error.message);
      } else {
        setTradeHistory(data || []);
      }
    };

    fetchTradeHistory();
  }, [user]); // ✅ Re-run when user changes

  // ✅ Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tradeHistory.slice(indexOfFirstRow, indexOfLastRow);

  // ✅ Correct price calculation
  const getPrice = (trade) => `$${trade.amount?.toFixed(2)}`;

  // ✅ Correct Profit/Loss calculation
  const calculateProfitOrLoss = (trade) => {
    if (!trade.balance_before || !trade.balance_after) return "0.00 USD";
    const profitOrLoss = trade.balance_after - trade.balance_before;
    return profitOrLoss > 0
      ? `+${profitOrLoss.toFixed(2)} USD`
      : `${profitOrLoss.toFixed(2)} USD`;
  };

  // ✅ Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="trading-history">
      <h2>Trading History</h2>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Asset</th>
            <th>Price</th>
            <th>Time</th>
            <th>Profit/Loss</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((trade) => {
              const profitOrLoss = calculateProfitOrLoss(trade);
              const rowClass = profitOrLoss.includes("+") ? "profit-row" : "loss-row";

              return (
                <tr key={trade.id} className={rowClass}>
                  <td>{trade.action?.toUpperCase()}</td> 
                  <td>{trade.asset}</td>
                  <td>{getPrice(trade)}</td>
                  <td>{trade.timestamp ? new Date(trade.timestamp).toLocaleString() : "Unknown"}</td>
                  <td>{profitOrLoss}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">No trading history available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Pagination */}
      <div className="pagination">
        {tradeHistory.length > rowsPerPage && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        )}
        {Array.from({ length: Math.ceil(tradeHistory.length / rowsPerPage) }, (_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
        {tradeHistory.length > rowsPerPage && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(tradeHistory.length / rowsPerPage)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default TradingHistory;
