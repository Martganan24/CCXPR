import React, { useState } from "react";

// Customizable Amount Input Component
const AmountInput = ({ amount, onIncrease, onDecrease, onChange }) => {
  return (
    <div className="amount-container">
      <button className="amount-btn" onClick={onDecrease}>−</button>
      <input
        type="text"
        value={amount}
        onChange={onChange} // Allows manual input
        className="amount-input"
      />
      <button className="amount-btn" onClick={onIncrease}>+</button>
    </div>
  );
};

// Customizable Earnings Indicator Component
const EarningsIndicator = ({ total }) => {
  return (
    <div className="profit-container">
      <p className="profit-indicator">
        Earnings <span className="profit-percent">+95%</span>
      </p>
      <p className="profit-total">$<span className="total-value">{total}</span></p>
    </div>
  );
};

// Customizable Buy/Sell Buttons Component
const OrderButtons = ({ onBuy, onSell }) => {
  return (
    <div className="order-buttons">
      <button className="buy-button" onClick={onBuy}>Buy</button>
      <button className="sell-button" onClick={onSell}>Sell</button>
    </div>
  );
};

function OrderForm() {
  const [amount, setAmount] = useState(0); // Default amount is 0

  // Decrease amount (Min: 0)
  const decreaseAmount = () => {
    setAmount((prev) => Math.max(0, prev - 1));
  };

  // Increase amount
  const increaseAmount = () => {
    setAmount((prev) => prev + 1);
  };

  // Handle manual input
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
    setAmount(value ? parseInt(value, 10) : 0); // Convert to number, default to 0 if empty
  };

  // Calculate +95% Profit in USD
  const profit = (amount * 0.95).toFixed(2); // 95% of input
  const total = (amount + parseFloat(profit)).toFixed(2); // Total earnings

  // Buy action
  const handleBuy = () => {
    console.log(`Buying with ${amount} USD.`);
    // Additional logic for buying goes here
  };

  // Sell action
  const handleSell = () => {
    console.log(`Selling with ${amount} USD.`);
    // Additional logic for selling goes here
  };

  return (
    <div className="order-form">
      {/* Customizable Amount Input */}
      <AmountInput 
        amount={amount}
        onIncrease={increaseAmount}
        onDecrease={decreaseAmount}
        onChange={handleInputChange}
      />

      {/* Customizable Earnings Indicator */}
      <EarningsIndicator total={total} />

      {/* Customizable Buy/Sell Buttons */}
      <OrderButtons onBuy={handleBuy} onSell={handleSell} />
    </div>
  );
}

export default OrderForm;
