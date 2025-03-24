import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  CssBaseline,
  CircularProgress,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  AccountBalanceWallet,
  People,
  ExitToApp,
  Chat as ChatIcon,
} from "@mui/icons-material";
import { supabase } from "../supabase"; // Ensure Supabase client is imported

function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [outcome, setOutcome] = useState("");  // For storing win/lose outcome

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("🔄 Fetching users from Supabase...");
        const { data, error } = await supabase
          .from("users")
          .select("id, username, balance, commission_balance, last_login, notes, password, outcome");

        if (error) {
          console.error("❌ Supabase error:", error);
          return;
        }

        console.log("✅ Users fetched successfully:", data);
        setUsers(data || []);
      } catch (err) {
        console.error("❌ Error fetching users:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const handleEditClick = (user) => {
    setEditedUser(user);
    setOutcome(user.outcome || ""); // Set the outcome if available
    setOpenEditDialog(true);
  };

  const handleSaveChanges = async () => {
    if (!editedUser || !outcome) return;

    try {
      const { error } = await supabase
        .from("users")
        .update({
          username: editedUser.username,
          balance: editedUser.balance,
          commission_balance: editedUser.commission_balance,
          notes: editedUser.notes, // Save the notes
          outcome: outcome, // Save win/lose outcome
        })
        .eq("id", editedUser.id);

      if (error) {
        console.error("❌ Error saving changes:", error);
      } else {
        console.log("✅ User updated successfully");
        setOpenEditDialog(false);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editedUser.id ? { ...user, ...editedUser, outcome: outcome } : user
          )
        );
      }
    } catch (err) {
      console.error("❌ Error saving changes:", err.message);
    }
  };

  const handleCancelEdit = () => {
    setOpenEditDialog(false);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#0f172a" }}>
      <CssBaseline />

      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            backgroundColor: "#1e1e1e",
            color: "#fff",
            borderRight: "1px solid #334155",
            transition: "all 0.3s ease",
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button onClick={() => navigate("/dashboard")}>
            <AccountBalanceWallet sx={{ marginRight: 1 }} />
            <ListItemText primary="Manage Users" />
          </ListItem>
          <ListItem button onClick={() => navigate("/transactions")}>
            <People sx={{ marginRight: 1 }} />
            <ListItemText primary="Transactions" />
          </ListItem>
          <ListItem button onClick={() => navigate("/admin-chat")}>
            <ChatIcon sx={{ marginRight: 1 }} />
            <ListItemText primary="Chat" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ExitToApp sx={{ marginRight: 1 }} />
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <AppBar position="static" sx={{ backgroundColor: "#1e1e1e" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Admin Panel
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* User Table */}
        <Typography variant="h5" sx={{ marginTop: 2, color: "#fff" }}>
          Users
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <Box sx={{ overflowX: "auto", mt: 2 }}>
            <Table sx={{ minWidth: 600, backgroundColor: "#1e293b", borderRadius: "10px" }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#334155", color: "#fff" }}>
                  <TableCell sx={{ color: "#fff" }}>ID</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Username</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Balance</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Last Login</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} sx={{ backgroundColor: "#f9f9f9" }}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>${user.balance}</TableCell>
                    <TableCell>{user.last_login || "N/A"}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditClick(user)}
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={handleCancelEdit}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {editedUser && (
            <>
              <TextField
                label="Username"
                fullWidth
                value={editedUser.username}
                onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Balance"
                fullWidth
                value={editedUser.balance}
                onChange={(e) => setEditedUser({ ...editedUser, balance: e.target.value })}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Commission Balance"
                fullWidth
                value={editedUser.commission_balance}
                onChange={(e) => setEditedUser({ ...editedUser, commission_balance: e.target.value })}
                sx={{ marginBottom: 2 }}
              />
              {/* User Notes */}
              <TextField
                label="User Notes"
                fullWidth
                multiline
                rows={4}
                value={editedUser.notes || ""}
                onChange={(e) => setEditedUser({ ...editedUser, notes: e.target.value })}
                sx={{ marginBottom: 2 }}
              />

              {/* Win/Lose Selection */}
              <div>
                <label>SET WIN or LOSE:</label>
                <select value={outcome} onChange={(e) => setOutcome(e.target.value)}>
                  <option value="">------------</option>
                  <option value="win">Win</option>
                  <option value="lose">Lose</option>
                </select>
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Dashboard;
