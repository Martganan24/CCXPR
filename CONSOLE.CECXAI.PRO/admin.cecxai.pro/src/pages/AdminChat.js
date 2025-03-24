import React, { useState, useEffect } from "react";
import { supabase } from "../supabase"; // ✅ Ensure correct import
import { Box, List, ListItem, ListItemText, Typography, TextField, Button, Badge } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate for back button
import "./AdminChat.css"; // ✅ Make sure to create this CSS file for styling

function AdminChat() {
  const navigate = useNavigate(); // Initialize navigate function
  const [users, setUsers] = useState([]); // List of users with messages
  const [selectedUser, setSelectedUser] = useState(null); // Currently selected user
  const [messages, setMessages] = useState([]); // Chat messages
  const [input, setInput] = useState(""); // Admin message input
  const [unreadUsers, setUnreadUsers] = useState(new Set()); // Track unread messages

  useEffect(() => {
    // ✅ Fetch users who sent messages
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("userId, sender, message, timestamp, read_status") // ✅ Fixed column name read -> read_status
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      // ✅ Group messages by user and check for unread messages
      const userMap = new Map();
      const unreadSet = new Set();

      data.forEach((msg) => {
        if (!userMap.has(msg.userId)) {
          userMap.set(msg.userId, { userId: msg.userId, lastMessage: msg.message });
        }
        if (msg.sender === "user" && !msg.read_status) {
          unreadSet.add(msg.userId);
        }
      });

      setUsers(Array.from(userMap.values()));
      setUnreadUsers(unreadSet);
    };

    fetchUsers();
    const subscription = supabase
      .channel("messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, fetchUsers)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchMessages = async (userId) => {
    setSelectedUser(userId);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("userId", userId)
      .order("timestamp", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    setMessages(data);

    // ✅ Mark messages as read
    await supabase
      .from("messages")
      .update({ read_status: true })
      .eq("userId", userId)
      .eq("sender", "user");

    setUnreadUsers((prev) => {
      const updated = new Set(prev);
      updated.delete(userId);
      return updated;
    });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = {
      userId: selectedUser,
      sender: "admin",
      message: input,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput("");

    const { error } = await supabase.from("messages").insert(newMessage);
    if (error) console.error("Error sending message:", error);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#0f172a", color: "#fff", padding: 3 }}>
  {/* Users List */}
  <Box sx={{ width: "30%", borderRight: "2px solid #334155", paddingRight: 2 }}>
    <Typography variant="h5" sx={{ marginBottom: 2 }}>
      User Messages
    </Typography>
    <List>
      {users.length > 0 ? (
        users.map((user) => (
          <ListItem
            key={user.userId}
            button
            onClick={() => fetchMessages(user.userId)}
            sx={{
              backgroundColor: unreadUsers.has(user.userId) ? "#ff9800" : "#1e293b",
              marginBottom: 1,
              borderRadius: 2,
            }}
          >
            <Badge color="secondary" variant={unreadUsers.has(user.userId) ? "dot" : "standard"}>
              <ListItemText primary={`User ${user.userId.slice(-4)}`} secondary={user.lastMessage} />
            </Badge>
          </ListItem>
        ))
      ) : (
        <Typography variant="body1">No messages yet.</Typography>
      )}
    </List>
  </Box>

  {/* Chat Box */}
  <Box sx={{ width: "70%", paddingLeft: 3, display: "flex", flexDirection: "column", height: "100%" }}>
    <Typography variant="h5" sx={{ mb: 2 }}>
      Chat with User {selectedUser ? selectedUser.slice(-4) : ""}
    </Typography>
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        border: "1px solid #fff",
        padding: 2,
        marginBottom: 2,
      }}
    >
      {messages.map((msg, index) => (
        <Box key={index} sx={{ marginBottom: 2, textAlign: msg.sender === "admin" ? "right" : "left" }}>
          <Typography
            sx={{
              display: "inline-block",
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: msg.sender === "admin" ? "#4caf50" : "#3b82f6",
              color: "#fff",
            }}
          >
            {msg.message}
          </Typography>
        </Box>
      ))}
    </Box>

    {/* Message Input */}
    <Box sx={{ display: "flex", marginBottom: 2 }}>
      <TextField
        fullWidth
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        sx={{ backgroundColor: "#fff", borderRadius: 2 }}
      />
      <Button variant="contained" color="primary" onClick={sendMessage} sx={{ marginLeft: 2 }}>
        Send
      </Button>
    </Box>

    {/* Back Button at the Bottom */}
    <Box sx={{ width: "100%", paddingTop: "auto", display: "flex", justifyContent: "center" }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/dashboard")}
        sx={{
          width: "80%",
          fontSize: "0.875rem", // Smaller font size
          padding: "6px 12px", // Smaller padding
          height: "auto", // Adjust height if necessary
        }}
      >
        Back to Dashboard
      </Button>
    </Box>
  </Box>
</Box>

  );
}

export default AdminChat;
