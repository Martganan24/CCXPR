import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Create Context
const UserContext = createContext();

// UserContext Provider (Wraps the Whole App)
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store User Data
  const [chatHistory, setChatHistory] = useState([]); // Store Chat History
  const [loading, setLoading] = useState(true); // Track loading state

  // Function to restore user session
  const restoreUserSession = async () => {
    const token = localStorage.getItem("authToken"); // Get Token
    if (!token) return;

    try {
      // Decode JWT to get user ID
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      // Fetch User Data from Backend
      const response = await fetch(`https://console-cecxai-ed25296a7384.herokuapp.com/api/auth/user/${userId}`);
      const data = await response.json();

      if (data.success) {
        const { total_referrals, commission_balance, ...userData } = data.user;
        setUser({
          ...userData,
          total_referrals,
          commission_balance,
        });
        fetchChatHistory(userId); // Fetch chat history
      } else {
        console.error("Error fetching user:", data.message);
      }
    } catch (error) {
      console.error("Invalid token:", error);
    } finally {
      setLoading(false); // Set loading to false after fetch
    }
  };

  // Function to fetch chat history from Supabase
  const fetchChatHistory = async (userId) => {
    try {
      const response = await fetch(`https://console-cecxai-ed25296a7384.herokuapp.com/api/chat/history/${userId}`);
      const result = await response.json();
      if (response.ok) {
        setChatHistory(result.chatHistory || []);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    window.location.href = "https://ceccxai-frontend-b334232d6e3e.herokuapp.com/"; // Redirect to Frontend
  };

  // Ensure user session is restored after refresh
  useEffect(() => {
    restoreUserSession(); // ✅ Restore user session on refresh
  }, []); // Empty dependency array means it runs once when the component mounts

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "https://ceccxai-frontend-b334232d6e3e.herokuapp.com/"; // Redirect only if user is not logged in
    }
  }, [loading, user]);

  return (
    <UserContext.Provider value={{ user, chatHistory, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Export `useUser` Hook
export const useUser = () => useContext(UserContext);
