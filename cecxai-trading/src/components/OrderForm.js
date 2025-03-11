import React, { useState } from "react";

function OrderForm() {
  const [amount, setAmount] = useState(0); // ✅ Default amount is 0

  // 🔥 Decrease amount (Min: 0)
  const decreaseAmount = () => {
    setAmount((prev) => Math.max(0, prev - 1));
  };

  // 🔥 Increase amount
  const increaseAmount = () => {
    setAmount((prev) => prev + 1);
  };

  // 🔥 Allow manual input
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // ✅ Allow only numbers
    setAmount(value ? parseInt(value, 10) : 0); // ✅ Convert to number, default to 0 if empty
  };

  // 🔥 Calculate +95% Profit in USD
  const profit = (amount * 0.95).toFixed(2); // ✅ 95% of input
  const total = (amount + parseFloat(profit)).toFixed(2); // ✅ Total earnings

  return (
    <div className="order-form">
      {/* 🔥 Amount Input with - & + Buttons */}
      <div className="amount-container">
        <button className="amount-btn" onClick={decreaseAmount}>−</button>
        <input
          type="text"
          value={amount}
          onChange={handleInputChange} /* ✅ Allows manual input */
          className="amount-input"
        />
        <button className="amount-btn" onClick={increaseAmount}>+</button>
      </div>

      {/* 🔥 Earnings Indicator (Now Fully Adjustable) */}
      <div className="profit-container">
        <p className="profit-indicator">
          Earnings <span className="profit-percent">+95%</span>
        </p>
        <p className="profit-total">$<span className="total-value">{total}</span></p>
      </div>

      {/* 🔥 Buy & Sell Buttons */}
      <div className="order-buttons">
        <button className="buy-button">Buy</button>
        <button className="sell-button">Sell</button>
      </div>
    </div>
  );
}

export default OrderForm;
