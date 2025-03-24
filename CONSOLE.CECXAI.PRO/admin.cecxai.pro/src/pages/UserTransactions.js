import React, { useEffect, useState } from "react";
import { supabase } from "../supabase"; // Ensure correct import
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Button } from "@mui/material"; // Import Button
import { useNavigate } from "react-router-dom"; // For navigation

const UserTransactions = () => {
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = "e3f99dad-0e60-4656-8269-483a690e4c35"; // This should come from the URL params or user context
  
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);

      try {
        // Fetch Deposits
        const { data: depositsData, error: depositsError } = await supabase
          .from("deposits")
          .select("*")
          .eq("user_id", userId);
        
        if (depositsError) {
          console.error("❌ Error fetching deposits:", depositsError);
          return;
        }
        setDeposits(depositsData);

        // Fetch Withdrawals
        const { data: withdrawalsData, error: withdrawalsError } = await supabase
          .from("withdrawals")
          .select("*")
          .eq("user_id", userId);
        
        if (withdrawalsError) {
          console.error("❌ Error fetching withdrawals:", withdrawalsError);
          return;
        }
        setWithdrawals(withdrawalsData);

        // Fetch Trades
        const { data: tradesData, error: tradesError } = await supabase
          .from("trades")
          .select("*")
          .eq("userId", userId);

        if (tradesError) {
          console.error("❌ Error fetching trades:", tradesError);
          return;
        }
        setTrades(tradesData);

      } catch (error) {
        console.error("❌ Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  // Handle back button click
  const handleBackClick = () => {
    navigate("/transactions"); // Navigate to the transactions page
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ color: "#fff", mb: 2 }}>
        User Transactions
      </Typography>

      {/* Back Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleBackClick}
        sx={{
          mb: 2, 
          backgroundColor: "#1976d2", // Blue color like other buttons in admin panel
          '&:hover': { backgroundColor: '#1565c0' }, // Darker blue on hover
        }}
      >
        Back to Transactions
      </Button>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <>
          {/* Combined Table */}
          <Table sx={{ minWidth: 600, backgroundColor: "#1e293b", borderRadius: "10px", mt: 2 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#334155", color: "#fff" }}>
                <TableCell sx={{ color: "#fff" }}>ID</TableCell>
                <TableCell sx={{ color: "#fff" }}>Type</TableCell>
                <TableCell sx={{ color: "#fff" }}>Amount</TableCell>
                <TableCell sx={{ color: "#fff" }}>Status</TableCell>
                <TableCell sx={{ color: "#fff" }}>Date</TableCell>
                <TableCell sx={{ color: "#fff" }}>Action</TableCell>
                <TableCell sx={{ color: "#fff" }}>Asset</TableCell>
                <TableCell sx={{ color: "#fff" }}>Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Combine Deposits */}
              {deposits.map((deposit) => (
                <TableRow key={deposit.user_id} sx={{ backgroundColor: "#f9f9f9" }}>
                  <TableCell>{deposit.user_id}</TableCell>
                  <TableCell>Deposit</TableCell>
                  <TableCell>${deposit.amount}</TableCell>
                  <TableCell>{deposit.status}</TableCell>
                  <TableCell>{new Date(deposit.created_at).toLocaleString()}</TableCell>
                  <TableCell>-</TableCell> {/* Action - not applicable for deposits */}
                  <TableCell>-</TableCell> {/* Asset - not applicable for deposits */}
                  <TableCell>-</TableCell> {/* Result - not applicable for deposits */}
                </TableRow>
              ))}

              {/* Combine Withdrawals */}
              {withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.user_id} sx={{ backgroundColor: "#f9f9f9" }}>
                  <TableCell>{withdrawal.user_id}</TableCell>
                  <TableCell>Withdrawal</TableCell>
                  <TableCell>${withdrawal.amount}</TableCell>
                  <TableCell>{withdrawal.status}</TableCell>
                  <TableCell>{new Date(withdrawal.created_at).toLocaleString()}</TableCell>
                  <TableCell>-</TableCell> {/* Action - not applicable for withdrawals */}
                  <TableCell>-</TableCell> {/* Asset - not applicable for withdrawals */}
                  <TableCell>-</TableCell> {/* Result - not applicable for withdrawals */}
                </TableRow>
              ))}

              {/* Combine Trades */}
              {trades.map((trade) => (
                <TableRow key={trade.userId} sx={{ backgroundColor: "#f9f9f9" }}>
                  <TableCell>{trade.userId}</TableCell>
                  <TableCell>Trade</TableCell>
                  <TableCell>${trade.amount}</TableCell>
                  <TableCell>{trade.result}</TableCell>
                  <TableCell>{new Date(trade.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{trade.action}</TableCell> {/* Action for trades */}
                  <TableCell>{trade.asset}</TableCell> {/* Asset for trades */}
                  <TableCell>{trade.result}</TableCell> {/* Result for trades */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </Box>
  );
};

export default UserTransactions;
