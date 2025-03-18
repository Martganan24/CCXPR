import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabase"; // ✅ Import Supabase client
import "../styles/Chat.css"; // ✅ Ensure this file exists

function Chat() {
  const [messages, setMessages] = useState([]); // ✅ Store messages from Supabase
  const [input, setInput] = useState("");
  const userId = "e3f99dad-0e60-4656-8269-483a690e4c35"; // ✅ Replace with actual logged-in user ID

  // ✅ Fetch past messages on load
  useEffect(() => {
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

    // ✅ Listen for new messages in real-time
    const subscription = supabase
      .channel("messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, fetchMessages)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  // ✅ Send message to Supabase
  const sendMessage = async () => {
    if (!input.trim()) return;

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
