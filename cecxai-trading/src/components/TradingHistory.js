import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./TradingHistory.css"; // ✅ Ensure this file exists

// ✅ Supabase Client
const supabase = createClient(
  "https://ipdkpskicsvesobhodaz.supabase.co", // Replace with your Supabase URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwZGtwc2tpY3N2ZXNvYmhvZGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NzE5NjgsImV4cCI6MjA1NzE0Nzk2OH0.LJhXO0GjPYOLRcEk2t2lsmJMewtYwIFc9AxyzbGmT_g" // Replace with your Supabase anon key
);

const TradingHistory = () => {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // ✅ Fetch Trading History from Supabase
  useEffect(() => {
    const fetchTradingHistory = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("trades").select("*").order("time", { ascending: false });

      if (error) {
        console.error("Error fetching trading history:", error);
      } else {
        setTradeHistory(data);
      }
      setLoading(false);
    };

    fetchTradingHistory();

    // ✅ Real-time Updates
    const subscription = supabase
      .channel("trading-history")
      .on("postgres_changes", { event: "*", schema: "public", table: "trades" }, fetchTradingHistory)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // ✅ Function to calculate Profit/Loss
  const calculateProfitOrLoss = (trade) => {
    if (!trade.buy_price || !trade.sell_price) return "N/A"; // Prevent errors if missing data
    let profitOrLoss = trade.sell_price - trade.buy_price;
    return profitOrLoss > 0 ? `+${profitOrLoss.toFixed(2)} USD` : `${profitOrLoss.toFixed(2)} USD`;
  };

  // ✅ Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tradeHistory.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="trading-history">
      <h2>Trading History</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : tradeHistory.length === 0 ? (
        <p>No trading history available.</p>
      ) : (
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
            {currentRows.map((trade) => (
              <tr key={trade.id} className={trade.type === "BUY" ? "buy" : "sell"}>
                <td>{trade.type}</td>
                <td>{trade.asset}</td>
                <td>${trade.price}</td>
                <td>{new Date(trade.time).toLocaleString()}</td>
                <td>{calculateProfitOrLoss(trade)}</td> {/* ✅ Shows Profit/Loss dynamically */}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {tradeHistory.length > rowsPerPage && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: Math.ceil(tradeHistory.length / rowsPerPage) }, (_, index) => (
            <button key={index} onClick={() => setCurrentPage(index + 1)}>
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === Math.ceil(tradeHistory.length / rowsPerPage)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TradingHistory;
