import React from "react";
import "./TradingHistory.css"; // ✅ Make sure to create this CSS file

const TradingHistory = () => {
  // ✅ Dummy trade history data (Replace with real API data later)
  const tradeHistory = [
    { id: 1, type: "BUY", asset: "BTC/USDT", amount: "0.005", price: "$65,000", time: "12:30 PM", buyPrice: 65000, sellPrice: 67000 },
    { id: 2, type: "SELL", asset: "ETH/USDT", amount: "0.2", price: "$3,500", time: "12:45 PM", buyPrice: 3400, sellPrice: 3500 },
    { id: 3, type: "BUY", asset: "SOL/USDT", amount: "10", price: "$120", time: "1:00 PM", buyPrice: 120, sellPrice: 115 },
  ];

  // Function to calculate profit or loss based on type and price
  const calculateProfitOrLoss = (trade) => {
    let profitOrLoss = 0;
    if (trade.type === "BUY") {
      // Profit/Loss for BUY transactions
      profitOrLoss = (trade.sellPrice - trade.buyPrice) * trade.amount;
    } else if (trade.type === "SELL") {
      // Profit/Loss for SELL transactions
      profitOrLoss = (trade.sellPrice - trade.buyPrice) * trade.amount;
    }
    return profitOrLoss > 0 ? `+${profitOrLoss.toFixed(2)} USD` : `${profitOrLoss.toFixed(2)} USD`;
  };

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
            <th>Profit/Loss</th> {/* Added column for Profit/Loss */}
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
              <td>{calculateProfitOrLoss(trade)}</td> {/* Show Profit/Loss */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradingHistory;
