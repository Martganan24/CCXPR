import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { supabase } from "../supabaseClient"; // Import Supabase client

const AmountInput = ({ amount, onIncrease, onDecrease, onChange }) => {
  return (
    <div className="amount-container">
      <button className="amount-btn" onClick={onDecrease}>−</button>
      <input type="text" value={amount} onChange={onChange} className="amount-input" />
      <button className="amount-btn" onClick={onIncrease}>+</button>
    </div>
  );
};

const EarningsIndicator = ({ total }) => {
  return (
    <div className="profit-container">
      <p className="profit-indicator">Earnings <span className="profit-percent">+95%</span></p>
      <p className="profit-total">$<span className="total-value">{total}</span></p>
    </div>
  );
};

const OrderButtons = ({ onTrade, disabled }) => {
  return (
    <div className="order-buttons">
      <button className="buy-button" onClick={() => onTrade("buy")} disabled={disabled}>Buy</button>
      <button className="sell-button" onClick={() => onTrade("sell")} disabled={disabled}>Sell</button>
    </div>
  );
};

function OrderForm() {
  const { user, setUser, transactionHistory, setTransactionHistory } = useUser();
  const [amount, setAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2);
  const [showCloseButton, setShowCloseButton] = useState(false);

  const decreaseAmount = () => setAmount((prev) => Math.max(0, prev - 1));
  const increaseAmount = () => setAmount((prev) => prev + 1);
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(value ? parseInt(value, 10) : 0);
  };

  const profit = (amount * 0.95).toFixed(2);
  const total = (amount + parseFloat(profit)).toFixed(2);

  const handleTrade = async (action) => {
    if (!user || user.balance < amount) return alert("Not enough balance!");
    if (isProcessing) return alert("A trade is already in process. Please wait.");
  
    setIsProcessing(true);
    setPopupVisible(true);
    setShowCloseButton(false);
    setResult("");
  
    let finalBalance = user.balance - amount;
    let tradeResult = "You Lose!";
    let finalAmount = amount;
  
    // Simulate trade result (50% win chance)
    const win = Math.random() > 0.5;
    if (win) {
      finalBalance += parseFloat(total);
      tradeResult = "You Win!";
      finalAmount = total;
    }
  
    setUser({ ...user, balance: finalBalance });
  
    // ✅ Step 1: Update user balance in Supabase
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ balance: finalBalance })
        .eq("id", user.id)
        .select("balance");
  
      if (error) {
        console.error("🔥 Balance Update Error:", error);
        alert(`Failed to update balance: ${error.message}`);
        return;
      } else {
        console.log("✅ Supabase Balance Updated:", data);
      }
    } catch (err) {
      console.error("🚨 Unexpected Balance Update Error:", err);
      alert("An unexpected error occurred while updating balance.");
      return;
    }
  
    // ✅ Step 2: Insert trade into Supabase
    const tradeData = {
      userId: user.id,
      action: action.toLowerCase(),
      asset: "BTC/USDT",
      amount: amount,
      result: tradeResult,
      balance_after: finalBalance,
      timestamp: new Date().toISOString(),
    };
  
    try {
      const { error } = await supabase.from("trades").insert([tradeData]);
      if (error) {
        console.error("🔥 Trade Insert Error:", error);
        alert(`Trade failed: ${error.message}`);
        return;
      }
    } catch (err) {
      console.error("🚨 Unexpected Trade Insert Error:", err);
      alert("An unexpected error occurred while inserting trade data.");
      return;
    }
  
    setTransactionHistory([...transactionHistory, tradeData]);
    setIsProcessing(false);
    setPopupVisible(false);
  };
  
  
  

  const handleClosePopup = () => {
    setPopupVisible(false);
    setResult("");
    setTimeLeft(2);
    setIsProcessing(false);
  };

  return (
    <div className="order-form">
      <AmountInput amount={amount} onIncrease={increaseAmount} onDecrease={decreaseAmount} onChange={handleInputChange} />
      <EarningsIndicator total={total} />
      <OrderButtons onTrade={handleTrade} disabled={isProcessing} />
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
      {result && <div className={`notification ${result === "You Win!" ? "win" : "lose"}`}>{result}</div>}
    </div>
  );
}

export default OrderForm;