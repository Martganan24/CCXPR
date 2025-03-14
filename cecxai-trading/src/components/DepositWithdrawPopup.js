import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient"; // Assuming you have a Supabase client
import { useUserContext } from "../context/UserContext"; // Assuming you have user context
import { toast } from "react-toastify"; // Assuming you use a notification library like react-toastify

const DepositWithdrawPopup = ({ onClose, type }) => {
  const { userId, balance, setBalance } = useUserContext(); // Get userId and balance from context
  const [amount, setAmount] = useState("");
  const [receiptUrl, setReceiptUrl] = useState(""); // For deposit only
  const [recipientWallet, setRecipientWallet] = useState(""); // For withdrawal only
  const [processing, setProcessing] = useState(false);
  const [selectedToken, setSelectedToken] = useState("ETH"); // Example token selection

  // Handle form submission for deposit/withdrawal
  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0 || (type === "withdraw" && !recipientWallet)) {
      toast.error("Please enter a valid amount and recipient wallet address.");
      return;
    }

    // For deposit, ensure receipt is uploaded
    if (type === "deposit" && !receiptUrl) {
      toast.error("Please upload a receipt for the deposit.");
      return;
    }

    // Show processing message
    setProcessing(true);

    const transactionData = {
      token: selectedToken,
      amount,
      status: "pending", // Default status
      ...(type === "deposit" && { receipt: receiptUrl }), // Only include receipt for deposits
      ...(type === "withdraw" && { recipient_wallet: recipientWallet }), // Include recipient wallet for withdrawals
    };

    console.log("Submitting transaction data:", transactionData);

    try {
      // Insert transaction data into Supabase (or other database)
      const { data, error } = await supabase
        .from(type === "deposit" ? 'deposits' : 'withdrawals') // Use different tables for deposit and withdrawal
        .insert([transactionData]);

      if (error) {
        console.error("Error submitting transaction:", error.message);
        toast.error("Error submitting transaction.");
        setProcessing(false);
      } else {
        // Deduct balance for withdrawal
        if (type === "withdraw") {
          const newBalance = balance - amount;

          // Update the balance in your database
          const { updateError } = await supabase
            .from('users') // Assuming you have a 'users' table
            .update({ balance: newBalance })
            .eq('user_id', userId); // Ensure userId is available

          if (updateError) {
            console.error("Error updating balance:", updateError.message);
            toast.error("Error updating balance.");
            setProcessing(false);
            return;
          }
        }

        // Show success notification
        toast.success(`${type === "deposit" ? "Deposit" : "Withdrawal"} in process!`);

        onClose(); // Close the popup after successful submission
        setBalance(balance - amount); // Update the local state for balance
      }
    } catch (err) {
      console.error("Unexpected error during submit:", err);
      toast.error("Unexpected error during submission.");
      setProcessing(false);
    }
  };

  // Handle balance rollback in case of rejection
  const handleWithdrawalRejection = async (transactionId) => {
    const { data, error } = await supabase
      .from('withdrawals')
      .select('status, amount')
      .eq('id', transactionId)
      .single();

    if (error || data.status !== 'approved') {
      // If the withdrawal is rejected, roll back the balance deduction
      const newBalance = balance + data.amount;

      // Update the user's balance
      const { updateError } = await supabase
        .from('users') // Assuming you have a 'users' table
        .update({ balance: newBalance })
        .eq('user_id', userId); // Ensure userId is available

      if (updateError) {
        console.error("Error updating balance:", updateError.message);
        toast.error("Error rolling back balance.");
      } else {
        toast.success("Your withdrawal was rejected. Your balance has been refunded.");
      }
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-content">
        <h2>{type === "deposit" ? "Deposit" : "Withdrawal"}</h2>

        <div>
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="any" // Allow decimal values
          />
        </div>

        {type === "deposit" && (
          <div>
            <label>Upload Receipt</label>
            <input
              type="file"
              onChange={(e) => setReceiptUrl(e.target.files[0])}
            />
          </div>
        )}

        {type === "withdraw" && (
          <div>
            <label>Recipient Wallet Address</label>
            <input
              type="text"
              value={recipientWallet}
              onChange={(e) => setRecipientWallet(e.target.value)}
            />
          </div>
        )}

        <button onClick={handleSubmit} disabled={processing}>
          {processing ? "Processing..." : "Submit"}
        </button>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DepositWithdrawPopup;
