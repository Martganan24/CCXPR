import React, { useState } from "react";
import { useUser } from "../context/UserContext"; // Use UserContext to get user data and transactionHistory

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
const OrderButtons = ({ onTrade, disabled }) => {
  return (
    <div className="order-buttons">
      <button className="buy-button" onClick={() => onTrade("buy")} disabled={disabled}>Buy</button>
      <button className="sell-button" onClick={() => onTrade("sell")} disabled={disabled}>Sell</button>
    </div>
  );
};

function OrderForm() {
  const { user, setUser, transactionHistory, setTransactionHistory } = useUser(); // Get user data and transaction history
  const [amount, setAmount] = useState(0); // Default amount is 0
  const [isProcessing, setIsProcessing] = useState(false); // To track if a trade is in process
  const [result, setResult] = useState(""); // To store the result (win/loss)
  const [popupVisible, setPopupVisible] = useState(false); // Show the countdown popup
  const [timeLeft, setTimeLeft] = useState(2); // Timer state for countdown (2 seconds for testing)
  const [showCloseButton, setShowCloseButton] = useState(false); // State to control close button visibility

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

  // Generalized Trade action (buy/sell)
  const handleTrade = async (action) => {
    if (!user || user.balance < amount) return alert("Not enough balance!");
    if (isProcessing) return alert("A trade is already in process. Please wait.");

    setIsProcessing(true);
    setPopupVisible(true);
    setShowCloseButton(false); // Hide close button at the start
    setResult(""); // Reset result when a new trade starts

    // Deduct balance immediately
    setUser({ ...user, balance: user.balance - amount });

    // Start countdown timer (only using setInterval now)
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer); // Stop the timer when time runs out
          setShowCloseButton(true); // Show the close button after countdown ends
        }
        return prevTime - 1;
      });
    }, 1000); // Update every second

    // Simulate result after countdown (e.g., 2s for testing)
    setTimeout(() => {
      const win = Math.random() > 0.5; // 50% chance to win
      if (win) {
        setUser({ ...user, balance: user.balance + parseFloat(total) });
        setResult("You Win!");
        // Update transaction history
        setTransactionHistory([...transactionHistory, { type: action === "buy" ? "BUY" : "SELL", asset: "BTC/USDT", price: `$${total}`, time: new Date().toLocaleTimeString(), buyPrice: amount, sellPrice: total }]);
      } else {
        setResult("You Lose!");
        // Update transaction history
        setTransactionHistory([...transactionHistory, { type: action === "buy" ? "BUY" : "SELL", asset: "BTC/USDT", price: `$${amount}`, time: new Date().toLocaleTimeString(), buyPrice: amount, sellPrice: total }]);
      }
      setIsProcessing(false);
      setPopupVisible(false);
    }, 2000); // Simulate 2s countdown for testing
  };

  const handleClosePopup = () => {
    setPopupVisible(false); // Close popup
    setResult(""); // Reset result when closing the popup
    setTimeLeft(2); // Reset the timer when closing the popup
    setIsProcessing(false); // Allow new trade to be initiated
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
      <OrderButtons onTrade={handleTrade} disabled={isProcessing} />

      {/* Countdown Timer Popup */}
      {popupVisible && (
        <div className="popup">
          <div className="popup-content">
            <h3>Trade in Progress...</h3>
            <p>Result will be shown after {timeLeft}s.</p>
            {isProcessing && <p>Processing... {timeLeft}s</p>}
            {showCloseButton && (
              <button className="close-btn" onClick={handleClosePopup}>Close</button>
            )}
          </div>
        </div>
      )}

      {/* Notification */}
      {result && <div className={`notification ${result === "You Win!" ? "win" : "lose"}`}>{result}</div>}
    </div>
  );
}

export default OrderForm;
