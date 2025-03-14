import React, { useState } from "react";
import "./TradingHistory.css"; // ✅ Ensure this file exists

const TradingHistory = () => {
  // ✅ Dummy trade history data (Replace with real API data later)
  const tradeHistory = [
    { id: 1, type: "BUY", asset: "BTC/USDT", price: "$65,000", time: "12:30 PM", buyPrice: 65000, sellPrice: 67000 },
    { id: 2, type: "SELL", asset: "BTC/USDT", price: "$3,500", time: "12:45 PM", buyPrice: 3400, sellPrice: 3500 },
    { id: 3, type: "BUY", asset: "BTC/USDT", price: "$120", time: "1:00 PM", buyPrice: 120, sellPrice: 115 },
    { id: 4, type: "SELL", asset: "BTC/USDT", price: "$2,500", time: "1:30 PM", buyPrice: 2450, sellPrice: 2500 },
    // Add more data to test pagination...
  ];

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Logic for showing the current page's data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tradeHistory.slice(indexOfFirstRow, indexOfLastRow);

  // ✅ Function to calculate profit or loss dynamically
  const calculateProfitOrLoss = (trade) => {
    if (!trade.buyPrice || !trade.sellPrice) return "N/A"; // Prevent errors if missing data
    let profitOrLoss = trade.sellPrice - trade.buyPrice;
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
            <th>Profit/Loss</th> {/* ✅ Profit/Loss column added */}
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
                <td>{calculateProfitOrLoss(trade)}</td> {/* ✅ Shows Profit/Loss dynamically */}
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
