import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext"; // Import UserContext

function Chat() {
  const { user, chatHistory } = useUser(); // Access user data and chat history from UserContext
  const [message, setMessage] = useState(""); // State for the user's current message
  const [botReply, setBotReply] = useState(""); // State for bot reply
  const [waitingForAdmin, setWaitingForAdmin] = useState(false); // To check if waiting for admin response

  // Handle sending a new message
  const sendMessage = async () => {
    if (!message) return; // Do not send empty messages

    // Save user's message to chat history (simulated, save to backend)
    const newMessage = { sender: "user", message };
    const updatedChatHistory = [...chatHistory, newMessage];

    // Simulate bot reply only once and wait for admin response
    const botMessage = { sender: "bot", message: "Thank you for your message! Please wait for the admin to respond." };
    setBotReply(botMessage.message); // Bot response
    setWaitingForAdmin(true); // Set waiting for admin response

    // Store the new message and bot reply in chat history
    updatedChatHistory.push(botMessage);
    // Here, you would also send the updated chat history to the backend (Supabase)
    
    // Update the chat history in UserContext (you would also save to Supabase)
    setMessage(""); // Clear input after sending
  };

  return (
    <div className="chat-container">
      <h2>Chat with Support</h2>

      {/* Display Chat History */}
      <div className="chat-history">
        {chatHistory.length > 0 ? (
          chatHistory.map((chat, index) => (
            <div key={index} className={`chat-message ${chat.sender}`}>
              <p>{chat.message}</p>
            </div>
          ))
        ) : (
          <div>No previous chat history.</div> // If no chat history, display this message
        )}
      </div>

      {/* Display Bot's Last Reply */}
      {botReply && <div className="bot-reply">{botReply}</div>}

      {/* User's Message Input */}
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} disabled={waitingForAdmin}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
