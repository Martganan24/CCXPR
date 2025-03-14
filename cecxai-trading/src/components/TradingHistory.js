import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // ✅ Ensure correct import
import "./TradingHistory.css"; // ✅ Ensure this file exists

const TradingHistory = () => {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // ✅ Fetch trade history from Supabase
  useEffect(() => {
    const fetchTradeHistory = async () => {
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .order("timestamp", { ascending: false }) // ✅ Sorting by timestamp
        .limit(100); // ✅ Limit for performance

      if (error) {
        console.error("Error fetching trade history:", error.message);
      } else {
        setTradeHistory(data || []);
      }
    };

    fetchTradeHistory();
  }, []);

  // ✅ Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tradeHistory.slice(indexOfFirstRow, indexOfLastRow);

  // ✅ Calculate profit/loss
  const calculateProfitOrLoss = (trade) => {
    let profitOrLoss = 0;
    if (trade.type === "BUY") {
      profitOrLoss = (trade.sellPrice - trade.buyPrice) * (trade.amount || 1);
    } else if (trade.type === "SELL") {
      profitOrLoss = (trade.sellPrice - trade.buyPrice) * (trade.amount || 1);
    }
    return profitOrLoss > 0 ? `+${profitOrLoss.toFixed(2)} USD` : `${profitOrLoss.toFixed(2)} USD`;
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
            currentRows.map((trade) => (
              <tr 
                key={trade.id} 
                className={trade.type === "BUY" ? "buy" : trade.type === "SELL" ? "sell" : ""}
              >
                <td>{trade.type || "N/A"}</td> {/* ✅ Ensure Type is displayed */}
                <td>{trade.asset || "Unknown"}</td>
                <td>${trade.price || "0.00"}</td>
                <td>{new Date(trade.timestamp).toLocaleString()}</td> {/* ✅ Display timestamp */}
                <td>{calculateProfitOrLoss(trade)}</td>
              </tr>
            ))
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
