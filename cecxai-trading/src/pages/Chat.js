import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/Chat.css"; // ✅ Ensure this file exists

function Chat() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Welcome to CECXAI Chat Support! 🎉" },
    { sender: "bot", text: "We're currently in beta mode! For support, chat with our customer service on Telegram: @CECXAI https://t.me/CECXAI. Happy trading!" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { sender: "user", text: input }]);
      setInput(""); // Clear input after sending
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "Admin", text: "Thank you! for reaching out to us. We have received your message and one of our team members will get in touch with you as soon as possible. We appreciate your patience and look forward to assisting you.! 🚀" },
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
