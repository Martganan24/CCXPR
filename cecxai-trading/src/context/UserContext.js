import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// ✅ Create Context
const UserContext = createContext();

// ✅ UserContext Provider (Wraps the Whole App)
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 🔥 Store User Data

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // ✅ Get Token
    if (!token) return;

    try {
      // ✅ Decode JWT to get user ID
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      // ✅ Fetch User Data from Backend
      fetch(`https://console-cecxai-ed25296a7384.herokuapp.com/api/auth/user/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUser(data.user); // ✅ Store User Data Globally
          } else {
            console.error("Error fetching user:", data.message);
          }
        })
        .catch((error) => console.error("Error fetching user:", error));
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    window.location.href = "https://ceccxai-frontend-b334232d6e3e.herokuapp.com/"; // ✅ Redirect to Frontend
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Fix: Export `useUser` Hook
export const useUser = () => useContext(UserContext);
