import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/Chat.css"; // ✅ Ensure this file exists

function Chat() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Welcome to the chat! 🎉" },
    { sender: "user", text: "Hello! How's the market today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { sender: "user", text: input }]);
      setInput(""); // Clear input after sending
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "I'm just a bot, but the market is always exciting! 🚀" },
        ]);
      }, 1000); // Simulated bot reply after 1 sec
    }
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
            {msg.text}
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
