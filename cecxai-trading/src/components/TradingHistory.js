import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./TradingHistory.css";

const TradingHistory = () => {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchTradeHistory = async () => {
      // ✅ Get the current session first
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("❌ Error fetching session:", sessionError?.message || "No session found!");
        return;
      }

      const user = session.user;
      if (!user) {
        console.error("❌ No user found in session!");
        return;
      }

      console.log("✅ Logged-in User ID:", user.id); // Debug log

      // ✅ Fetch trade history for the logged-in user
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("user_id", user.id) // ✅ Filter by user ID
        .order("timestamp", { ascending: false })
        .limit(100);

      if (error) {
        console.error("❌ Error fetching trade history:", error.message);
      } else {
        console.log("✅ Trade History Data:", data); // Debug log
        setTradeHistory(data || []);
      }
    };

    fetchTradeHistory();
  }, []);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tradeHistory.slice(indexOfFirstRow, indexOfLastRow);

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
              <tr key={trade.id} className={trade.balance_after > trade.balance_before ? "profit-row" : "loss-row"}>
                <td>{trade.action.toUpperCase()}</td>
                <td>{trade.asset}</td>
                <td>${trade.amount.toFixed(2)}</td>
                <td>{new Date(trade.timestamp).toLocaleString()}</td>
                <td>{(trade.balance_after - trade.balance_before).toFixed(2)} USD</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No trading history available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TradingHistory;
