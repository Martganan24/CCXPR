import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase"; // ✅ Import Supabase client
import { motion } from "framer-motion";
import "../styles/Chat.css"; // ✅ Ensure this file exists
import { useUser } from "../context/UserContext"; // ✅ Import User Context

function Chat() {
  const { user } = useUser(); // ✅ Get user data
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null); // ✅ For auto-scrolling

  useEffect(() => {
    if (!user) {
      console.error("❌ No user found! Make sure the user is logged in.");
      return;
    }

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("userId", user.id) // ✅ Load only messages for this user
        .order("timestamp", { ascending: true });

      if (error) {
        console.error("❌ Error fetching messages:", error);
      } else {
        setMessages(data);
        scrollToBottom(); // ✅ Scroll after fetching
      }
    };

    fetchMessages();

    // ✅ Real-time chat
    const subscription = supabase
      .channel("messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        if (payload.new.userId === user.id || payload.new.sender === "admin") {
          setMessages((prev) => [...prev, payload.new]);
          scrollToBottom(); // ✅ Scroll after new message
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const newMessage = {
      userId: user.id,
      sender: "user",
      message: input,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput("");
    scrollToBottom(); // ✅ Scroll after sending

    const { error } = await supabase.from("messages").insert(newMessage);
    if (error) console.error("❌ Error sending message:", error);
  };

  // ✅ Scroll to the bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <motion.div
      className="chat-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="chat-title">Live Chat: "Thank you for reaching out. Our admin will respond shortly. Please feel free to share any concerns you may have."</h1>

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
        <div ref={chatEndRef} /> {/* ✅ Auto-scroll target */}
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