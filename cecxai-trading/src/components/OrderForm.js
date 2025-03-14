import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { supabase } from "../supabaseClient";

const AmountInput = ({ amount, onIncrease, onDecrease, onChange }) => {
  return (
    <div className="amount-container">
      <button className="amount-btn" onClick={onDecrease}>-</button>
      <input type="number" className="amount-input" value={amount} onChange={onChange} />
      <button className="amount-btn" onClick={onIncrease}>+</button>
    </div>
  );
};

const OrderButtons = ({ onTrade, disabled }) => {
  return (
    <div className="order-buttons">
      <button className="buy-button" onClick={() => onTrade("buy")} disabled={disabled}>
        Buy
      </button>
      <button className="sell-button" onClick={() => onTrade("sell")} disabled={disabled}>
        Sell
      </button>
    </div>
  );
};

function OrderForm() {
  const { user, setUser, transactionHistory, setTransactionHistory } = useUser();
  const [amount, setAmount] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2);
  const [result, setResult] = useState("");

  const increaseAmount = () => setAmount((prev) => prev + 1);
  const decreaseAmount = () => setAmount((prev) => Math.max(1, prev - 1));
  const handleInput = (e) => setAmount(parseFloat(e.target.value) || 0);

  const profit = (amount * 0.95).toFixed(2);
  const total = (parseFloat(amount) + parseFloat(profit)).toFixed(2);

  const handleTrade = async (type) => {
    if (!user || amount <= 0) return alert("Invalid amount.");
    if (user.balance < amount) return alert("Not enough balance!");
    if (isProcessing) return alert("A trade is already in process. Please wait.");

    setIsProcessing(true);
    setPopupVisible(true);
    setTimeLeft(2);
    setResult("");
    
    // Deduct the trade amount first
    let finalBalance = user.balance - amount;
    setUser({ ...user, balance: finalBalance });

    // Start countdown timer
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
        });
      }, 1000);
    
    // Execute trade after 2 seconds
    const timer = setTimeout(async () => {
      clearInterval(timer);
      const win = Math.random() > 0.5;
      let tradeResult = win ? "You Win!" : "You Lose!";
      
      if (win) {
        finalBalance += parseFloat(profit);
      }

      // Update user balance in Supabase
      try {
        const { data, error } = await supabase
          .from("users")
          .update({ balance: finalBalance })
          .eq("id", user.id)
          .select();

        if (error) {
          console.error("🔥 Balance Update Error:", error);
          alert(`Failed to update balance: ${error.message}`);
          return;
        }

        setUser({ ...user, balance: finalBalance });
      } catch (error) {
        console.error("🚨 Unexpected Balance Update Error:", error);
        alert("An unexpected error occurred while updating balance.");
        return;
      }

      // Update Transaction History
      const tradeData = {
        asset: "BTC/USDT",
        amount: amount,
        result: tradeResult,
        balance_after: finalBalance,
        timestamp: new Date().toISOString(),
      };

      try {
        const { error } = await supabase.from("trades").insert([tradeResult]);
        if (error) {
          console.error("🔥 Trade Insert Error:", error);
          alert(`Trade failed: ${error.message}`);
          return;
        }
      } catch (error) {
        console.error("🚨 Unexpected Trade Insert Error:", error);
        alert("An unexpected error occurred while inserting trade data.");
        return;
      }
      
      setTransactionHistory([...transactionHistory, tradeResult]);
      setPopupVisible(true);
      
      setTimeout(() => {
        setPopupVisible(false);
        setTimeLeft(2);
        setIsProcessing(false);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="order-form">
      <AmountInput amount={amount} onIncrease={increaseAmount} onDecrease={decreaseAmount} onChange={handleInput} />
      <div className="profit-info">
        <p>Earnings: <span className="profit-value">+{profit}$</span></p>
      </div>
      <OrderButtons onTrade={handleTrade} disabled={isProcessing} />
      
      {popupVisible && (
        <div className="trade-popup">
          <p>Trade in progress... {timeLeft}s</p>
          {showCloseButton && <button onClick={handleClose}>Close</button>}
        </div>
      )}
      
      {result && <div className={`trade-result ${result === "You Win!" ? "win" : "lose"}`}>{result}</div>}
    </div>
  );
}

export default OrderForm;
