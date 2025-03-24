import React, { useEffect, useState } from "react";
import { supabase } from "../supabase"; // Ensure supabase is imported correctly
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Button } from "@mui/material"; // Import Pagination here
import { useNavigate } from "react-router-dom"; // For navigation

function Transactions() {
  const [users, setUsers] = useState([]); // List of users
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate(); // Initialize navigate function

  // Fetch list of users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("users") // Assuming you have a users table
          .select("id, username, email");

        if (error) {
          console.error("❌ Error fetching users:", error.message);
          return;
        }

        setUsers(data || []);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching users:", err);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // This will fetch users on mount

  // Navigate to user's specific transactions (trades, withdrawals, deposits)
  const handleUserClick = (userId) => {
    navigate(`/user-transactions/${userId}`); // Adjust this route as needed
  };

  // Back to Dashboard function
  const handleBackClick = () => {
    navigate("/dashboard"); // Navigate back to the dashboard
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Back to Dashboard Button */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleBackClick} 
        sx={{ mb: 2 }}>
        Back to Dashboard
      </Button>

      <Typography variant="h5" sx={{ color: "#fff", mb: 2 }}>
        Users
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <>
          <Table sx={{ minWidth: 600, backgroundColor: "#1e293b", borderRadius: "10px", mt: 2 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#334155", color: "#fff" }}>
                <TableCell sx={{ color: "#fff" }}>User ID</TableCell>
                <TableCell sx={{ color: "#fff" }}>Username</TableCell>
                <TableCell sx={{ color: "#fff" }}>Email</TableCell>
                <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} sx={{ backgroundColor: "#f9f9f9" }}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => handleUserClick(user.id)}>
                      View Transactions
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </Box>
  );
}

export default Transactions;
