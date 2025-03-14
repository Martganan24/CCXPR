import React, { useState } from "react";
import { useEffect } from "react";
import { supabase } from "../supabaseClient"; // Import Supabase client
import { useUser } from "../UserContext"; // Ensure this is the correct path

const AmountInput = ({ amount, onIncrease, onDecrease, onChange }) => {
  return (
    <div className="amount-container">
      <button className="amount-btn" onClick={onDecrease}>−</button>
      <input type="text" value={amount} onChange={onChange} className="amount-input" />
      <button className="plus" onClick={onIncrease}>+</button>
    </div>
  );
};

const EarningsIndicator = ({ total }) => {
  return (
    <div className="profit-container">
      <p className="profit-indicator">Earnings <span className="profit-percent">+{total}</span></p>
    </div>
  );
};

const OrderButtons = ({ onTrade, disabled }) => {
  return (
    <div className="order-buttons">
      <button onClick={() => onTrade("buy")} disabled={disabled} className="buy-btn">Buy</button>
      <button onClick={() => onTrade("sell")} disabled={disabled} className="sell-btn">Sell</button>
    </div>
  );
};

function OrderForm() {
  const { user, setUser } = useState({ id: null, balance: 0 }); // Fetch from context
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

  const total = (amount * 1.5).toFixed(2); // Assuming a fixed multiplier for winning trades

  const handleTrade = async (action) => {
    if (!user || user.balance < amount) return alert("Not enough balance!");
    if (amount <= 0) return alert("Enter a valid amount!");

    setIsProcessing(true);
    setPopupVisible(true);
    setShowCloseButton(false);
    setResult("");
    setUser({ ...user, balance: user.balance - amount });

    let finalBalance = user.balance - amount;

    let countdown = 2;
    setTimeLeft(countdown);

    const timer = setInterval(() => {
      countdown -= 1;
      setTimeLeft(countdown);

      if (countdown <= 0) {
        clearInterval(timer);
        setShowCloseButton(true);
      }
    }, 1000);

    setTimeout(async () => {
      const win = Math.random() > 0.5;
      let finalAmount = amount;

      if (win) {
        finalAmount = parseFloat(total);
        setResult("You Win!");
        finalAmount = parseFloat(total);
        finalAmount = parseFloat(finalAmount);
        setUser((prev) => ({
          ...prev,
          balance: prev.balance + parseFloat(finalAmount - amount), // Increase balance only by profit
        }));
      } else {
        setResult("You Lose!");
      }

      // ✅ Update user balance in Supabase
      try {
        const { error } = await supabase
          .from("users")
          .update({ balance: finalBalance })
          .eq("id", user.id);
        if (error) {
          console.error("🔥 Balance Update Error:", error);
          alert(`Failed to update balance: ${error.message}`);
          return;
        }
      } catch (err) {
        console.error("🚨 Unexpected Balance Update Error:", err);
        alert("An unexpected error occurred while updating balance.");
        return;
      }

      // ✅ Step 2: Insert trade into Supabase
      const tradeData = {
        user_id: user.id,
        action: action.toLowerCase(),
        asset: "crypto",
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
        }
      } catch (err) {
        console.error("🚨 Unexpected Trade Insert Error:", err);
        alert("An unexpected error occurred while inserting trade data.");
      }

      setResult(tradeResult);
      setShowCloseButton(true);
    }, 2000);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setResult("");
    setTimeLeft(2);
  };

  return (
    <div className="order-form">
      <AmountInput amount={amount} onIncrease={increaseAmount} onDecrease={decreaseAmount} onChange={handleInputChange} />
      <EarningsIndicator total={total} />
      <OrderButtons onTrade={handleTrade} disabled={isProcessing || amount <= 0} />

      {popupVisible && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Trade in Progress...</h3>
            <p>Result will be shown in {timeLeft}s</p>
            {result && <h2 className={`result-message ${result === "You Win!" ? "win" : "lose"}`}>{result}</h2>}
            {showCloseButton && <button onClick={handleClosePopup} className="close-btn">Close</button>}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderForm;
