import React, { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext"; // Import UserContext
import "../styles/Settings.css";

function Settings() {
  const { user } = useUser(); // Get user data from context
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(""); // To display error messages

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password inputs
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      // Send currentPassword and newPassword to the backend for validation and update
      const response = await fetch("https://console-cecxai-ed25296a7384.herokuapp.com/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`, // Send JWT token
        },
        body: JSON.stringify({
          oldPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Password updated successfully!");
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setError(""); // Clear any previous errors
      } else {
        setError(result.message || "Failed to update password.");
      }
    } catch (error) {
      setError("Error connecting to the server. Please try again.");
    }
  };

  return (
    <motion.div
      className="settings-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="settings-title">Account Settings</h1>

      {/* ✅ User Information Section */}
      <div className="settings-section">
        <h2>User Information</h2>
        <div className="input-group user-info">
          <label>Username:</label>
          <input type="text" value={user ? user.username : "Loading..."} disabled />
        </div>
        <div className="input-group user-info">
          <label>Email:</label>
          <input type="email" value={user ? user.email : "Loading..."} disabled />
        </div>
      </div>

      {/* ✅ Change Password Section */}
      <div className="settings-section">
        <h2>Change Password</h2>
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
        <form onSubmit={handleSubmit}>
          <div className="input-group password-input">
            <label>Current Password:</label>
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group password-input">
            <label>New Password:</label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group password-input">
            <label>Confirm New Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <motion.button
            type="submit"
            className="save-btn"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            Save Changes
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default Settings;
