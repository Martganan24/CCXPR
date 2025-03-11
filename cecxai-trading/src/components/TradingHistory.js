import React from "react";
import "./TradingHistory.css"; // ✅ Make sure to create this CSS file

const TradingHistory = () => {
  // ✅ Dummy trade history data (Replace with real API data later)
  const tradeHistory = [
    { id: 1, type: "BUY", asset: "BTC/USDT", amount: "0.005", price: "$65,000", time: "12:30 PM" },
    { id: 2, type: "SELL", asset: "ETH/USDT", amount: "0.2", price: "$3,500", time: "12:45 PM" },
    { id: 3, type: "BUY", asset: "SOL/USDT", amount: "10", price: "$120", time: "1:00 PM" },
  ];

  return (
    <div className="trading-history">
      <h2>Trading History</h2>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Asset</th>
            <th>Amount</th>
            <th>Price</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {tradeHistory.map((trade) => (
            <tr key={trade.id} className={trade.type === "BUY" ? "buy" : "sell"}>
              <td>{trade.type}</td>
              <td>{trade.asset}</td>
              <td>{trade.amount}</td>
              <td>{trade.price}</td>
              <td>{trade.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradingHistory;
