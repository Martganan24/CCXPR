import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { supabase } from "../supabaseClient";

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
  const [timeLeft, setTimeLeft] = useState(60);
  const [showCloseButton, setShowCloseButton] = useState(false);

  const decreaseAmount = () => setAmount((prev) => Math.max(0, prev - 1));
  const increaseAmount = () => setAmount((prev) => prev + 1);
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(value ? parseInt(value, 10) : 0);
  };

  const profit = (amount * 0.95).toFixed(60);
  const total = (amount + parseFloat(profit)).toFixed(60);

  const handleTrade = async (action) => {
    if (!user || amount <= 0) return alert("Trade amount must be greater than 0!");
    if (user.balance < amount) return alert("Not enough balance!");
    if (isProcessing) return alert("A trade is already in process. Please wait.");
  
    setIsProcessing(true);
    setPopupVisible(true);
    setShowCloseButton(false);
    setResult("");
    
    const balanceBefore = user.balance;
    setUser({ ...user, balance: user.balance - amount });

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setShowCloseButton(true);
        }
        return prevTime - 1;
      });
    }, 1000);

    setTimeout(async () => {
      const win = Math.random() > 0.5;
      let finalBalance = balanceBefore - amount;
      let tradeResult = "You Lose!";
      let finalAmount = amount;

      if (win) {
        finalBalance += parseFloat(total);
        tradeResult = "You Win!";
        finalAmount = total;
      }

      setUser({ ...user, balance: parseFloat(finalBalance.toFixed(60)) });
      setResult(tradeResult);

      const tradeData = {
        userId: user.id,
        action: action.toLowerCase(),
        asset: "BTC/USDT",
        amount: amount,
        balance_before: balanceBefore,
        result: tradeResult,
        balance_after: finalBalance,
        timestamp: new Date().toISOString(),
      };

      try {
        const { error } = await supabase.from("trades").insert([tradeData]);
        if (error) {
          console.error("🔥 Supabase Insert Error:", error);
          alert(`Trade failed: ${error.message}`);
          return;
        }

        const { updateError } = await supabase
          .from("users")
          .update({ balance: finalBalance })
          .eq("id", user.id);
        if (updateError) {
          console.error("🔥 Balance Update Error:", updateError);
          alert(`Balance update failed: ${updateError.message}`);
          return;
        }
      } catch (err) {
        console.error("🚨 Unexpected Insert Error:", err);
        alert("An unexpected error occurred while inserting trade data.");
        return;
      }

      setTransactionHistory([...transactionHistory, tradeData]);
      setIsProcessing(false);
      setPopupVisible(false);
    }, 2000);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setResult("");
    setTimeLeft(60);
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
            <h3>"Trade in Progress... Please avoid navigating or making changes."</h3>
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
