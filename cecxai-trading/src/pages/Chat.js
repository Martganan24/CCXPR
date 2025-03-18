import React, { useState, useEffect } from "react";
import { supabase } from "../supabase"; // ✅ Import Supabase client
import { motion } from "framer-motion";
import "../styles/Chat.css"; // ✅ Ensure this file exists

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  useEffect(() => {
    // ✅ If userId is missing, fetch it from Supabase
    const fetchUserId = async () => {
      if (!userId) {
        const { data: user, error } = await supabase.from("users").select("id").single();
        if (error) {
          console.error("❌ Error fetching user ID:", error);
        } else {
          setUserId(user.id);
          localStorage.setItem("userId", user.id);
        }
      }
    };

    fetchUserId();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("userId", userId)
        .order("timestamp", { ascending: true });

      if (error) {
        console.error("❌ Error fetching messages:", error);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();

    // ✅ Real-time subscription for new messages only
    const subscription = supabase
      .channel("messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        if (payload.new.userId === userId) {
          setMessages((prev) => [...prev, payload.new]);
        }
      })
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
      timestamp: new Date().toISOString(),
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