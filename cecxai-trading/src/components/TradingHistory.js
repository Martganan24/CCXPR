import React, { useState, useEffect } from "react";
import "./TradingHistory.css"; // ✅ Ensure this file exists
import supabase from "../supabaseClient"; // ✅ Adjust import if needed

const TradingHistory = () => {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchTradeHistory();
  }, []);

  const fetchTradeHistory = async () => {
    const { data, error } = await supabase
      .from("trades")
      .select("id, type, amount, balance_after, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching trades:", error);
    } else {
      setTradeHistory(data);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tradeHistory.slice(indexOfFirstRow, indexOfLastRow);

  // Function to calculate profit or loss
  const calculateProfitOrLoss = (trade, index) => {
    if (index === tradeHistory.length - 1) return "0.00 USD"; // First trade has no previous balance

    const previousBalance = tradeHistory[index + 1]?.balance_after || 0;
    const profitOrLoss = trade.balance_after - previousBalance;

    return profitOrLoss >= 0 ? `+${profitOrLoss.toFixed(2)} USD` : `${profitOrLoss.toFixed(2)} USD`;
  };

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
            <th>Price</th>
            <th>Time</th>
            <th>Profit/Loss</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((trade, index) => (
              <tr key={trade.id} className={trade.type === "BUY" ? "buy" : "sell"}>
                <td>{trade.type}</td>
                <td>${trade.amount.toFixed(2)}</td>
                <td>{new Date(trade.created_at).toLocaleString()}</td>
                <td className={parseFloat(calculateProfitOrLoss(trade, index)) >= 0 ? "profit" : "loss"}>
                  {calculateProfitOrLoss(trade, index)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No trading history available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
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
