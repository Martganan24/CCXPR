import React, { useState } from 'react';
import { useUser } from "../context/UserContext"; // Assuming you are using UserContext
import { supabase } from '../utils/supabaseClient'; // Assuming supabase is set up
import "../styles/Popup.css"; // Popup styling

const DepositWithdrawPopup = ({ type, onClose }) => {
  const { user } = useUser(); // Access the user object from UserContext
  const [amount, setAmount] = useState('');
  const [recipientWallet, setRecipientWallet] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle submit for deposit
  const handleDepositSubmit = async () => {
    if (!amount) {
      setError("Please enter an amount.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Perform deposit logic
      const depositData = {
        amount,
        userId: user.id, // Assuming user ID is available
        status: "pending", // Set status as pending
      };

      const { data, error } = await supabase
        .from('deposits') // Assuming you have a deposits table
        .insert([depositData]);

      if (error) {
        throw error;
      }

      console.log("Deposit successful:", data);
      onClose(); // Close the popup after success
    } catch (error) {
      console.error("Error processing deposit:", error);
      setError("An error occurred while processing your deposit.");
    } finally {
      setLoading(false);
    }
  };

  // Handle submit for withdrawal
  const handleWithdrawSubmit = async () => {
    if (!amount || !recipientWallet) {
      setError("Please enter amount and wallet address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Perform withdrawal logic
      const withdrawalData = {
        amount,
        recipientWallet,
        userId: user.id, // Assuming user ID is available
        status: "pending", // Set status as pending
      };

      const { data, error } = await supabase
        .from('withdrawals') // Assuming you have a withdrawals table
        .insert([withdrawalData]);

      if (error) {
        throw error;
      }

      console.log("Withdrawal successful:", data);
      onClose(); // Close the popup after success
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      setError("An error occurred while processing your withdrawal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <h2>{type === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}</h2>
        
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            disabled={loading}
          />
        </div>

        {type === 'withdraw' && (
          <div className="form-group">
            <label>Recipient Wallet Address</label>
            <input
              type="text"
              value={recipientWallet}
              onChange={(e) => setRecipientWallet(e.target.value)}
              placeholder="Enter wallet address"
              disabled={loading}
            />
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="popup-actions">
          <button onClick={onClose} disabled={loading}>Cancel</button>
          <button
            onClick={type === 'deposit' ? handleDepositSubmit : handleWithdrawSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : type === 'deposit' ? 'Deposit' : 'Withdraw'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositWithdrawPopup;
