import React, { useState, useEffect } from "react";
import { supabase } from "../supabase"; // ✅ Import Supabase client
import { motion } from "framer-motion";
import "../styles/Chat.css"; // ✅ Ensure this file exists

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // ✅ Get userId from localStorage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      console.error("❌ No userId found! Make sure the user is logged in.");
      return;
    }

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("userId", userId) // ✅ Load only messages for this user
        .order("timestamp", { ascending: true });

      if (error) {
        console.error("❌ Error fetching messages:", error);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();

    // ✅ Real-time message updates
    const subscription = supabase
      .channel("messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, fetchMessages)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  const sendMessage = async () => {
    if (!input.trim() || !userId) return;

    const newMessage = {
      userId,
      sender: "user",
      message: input,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput("");

    const { error } = await supabase.from("messages").insert(newMessage);
    if (error) console.error("❌ Error sending message:", error);
  };

  return (
    <motion.div
      className="chat-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="chat-title">Live Chat</h1>

      {/* ✅ Messages Display */}
      <div className="chat-box">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={`chat-message ${msg.sender}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {msg.message}
          </motion.div>
        ))}
      </div>

      {/* ✅ Chat Input */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()} // Send on Enter
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </motion.div>
  );
}

export default Chat;
