import React, { useState } from "react";
import "./TradingHistory.css"; // ✅ Ensure this file exists

const TradingHistory = ({ transactionHistory }) => {
  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Logic for showing the current page's data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = transactionHistory.slice(indexOfFirstRow, indexOfLastRow);

  // Function to calculate profit or loss based on price and type
  const calculateProfitOrLoss = (trade) => {
    let profitOrLoss = 0;
    if (trade.type === "BUY") {
      // Profit/Loss for BUY transactions
      profitOrLoss = (trade.sellPrice - trade.buyPrice) * 1; // Adjusted to amount or quantity if necessary
    } else if (trade.type === "SELL") {
      // Profit/Loss for SELL transactions
      profitOrLoss = (trade.sellPrice - trade.buyPrice) * 1; // Adjusted to amount or quantity if necessary
    }
    return profitOrLoss > 0 ? `+${profitOrLoss.toFixed(2)} USD` : `${profitOrLoss.toFixed(2)} USD`;
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
            <th>Asset</th>
            <th>Price</th>
            <th>Time</th>
            <th>Profit/Loss</th> {/* Profit/Loss column */}
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((trade) => (
              <tr key={trade.id} className={trade.type === "BUY" ? "buy" : "sell"}>
                <td>{trade.type}</td>
                <td>{trade.asset}</td>
                <td>{trade.price}</td>
                <td>{trade.time}</td>
                <td>{calculateProfitOrLoss(trade)}</td> {/* Show Profit/Loss */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No trading history available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {transactionHistory.length > rowsPerPage && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        )}
        {Array.from({ length: Math.ceil(transactionHistory.length / rowsPerPage) }, (_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
        {transactionHistory.length > rowsPerPage && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(transactionHistory.length / rowsPerPage)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default TradingHistory;
