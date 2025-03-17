import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // ✅ Ensure correct import
import "./TradingHistory.css"; // ✅ Ensure this file exists

const TradingHistory = () => {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchTradeHistory = async () => {
      setLoading(true);
      setErrorMessage("");

      // ✅ Get session to check if user is logged in
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        setErrorMessage("❌ Auth session missing! Please log in.");
        setLoading(false);
        return;
      }

      try {
        // ✅ Fetch trade history only for the logged-in user
        const { data, error } = await supabase
          .from("trades")
          .select("*")
          .eq("user_id", session.user.id) // ✅ Filter by user_id
          .order("timestamp", { ascending: false })
          .limit(100);

        if (error) throw error;

        setTradeHistory(data || []);
      } catch (err) {
        setErrorMessage("❌ Error fetching trade history.");
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTradeHistory();
  }, []);

  // ✅ Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tradeHistory.slice(indexOfFirstRow, indexOfLastRow);

  // ✅ Format trade price
  const getPrice = (trade) => `$${trade.amount.toFixed(2)}`;

  // ✅ Calculate profit/loss
  const calculateProfitOrLoss = (trade) => {
    if (!trade.balance_before || !trade.balance_after) return "0.00 USD";
    const profitOrLoss = trade.balance_after - trade.balance_before;
    return profitOrLoss > 0
      ? `+${profitOrLoss.toFixed(2)} USD`
      : `${profitOrLoss.toFixed(2)} USD`;
  };

  // ✅ Handle page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="trading-history">
      <h2>Trading History</h2>

      {loading && <p>Loading trading history...</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}

      {!loading && !errorMessage && (
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
                    <td>{trade.action.toUpperCase()}</td>
                    <td>{trade.asset}</td>
                    <td>{getPrice(trade)}</td>
                    <td>{new Date(trade.timestamp).toLocaleString()}</td>
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
      )}

      {/* ✅ Pagination */}
      {!loading && !errorMessage && tradeHistory.length > rowsPerPage && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: Math.ceil(tradeHistory.length / rowsPerPage) }, (_, index) => (
            <button key={index} onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
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
