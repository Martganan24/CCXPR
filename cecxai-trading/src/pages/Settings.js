import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/Settings.css";

function Settings() {
  const [userInfo] = useState({
    username: "JohnDoe",
    email: "johndoe@example.com",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
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
          <input type="text" value={userInfo.username} disabled />
        </div>
        <div className="input-group user-info">
          <label>Email:</label>
          <input type="email" value={userInfo.email} disabled />
        </div>
      </div>

      {/* ✅ Change Password Section */}
      <div className="settings-section">
        <h2>Change Password</h2>
        <div className="input-group password-input">
          <label>Current Password:</label>
          <input
            type="password"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handleChange}
          />
        </div>
        <div className="input-group password-input">
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
          />
        </div>
        <div className="input-group password-input">
          <label>Confirm New Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ✅ Save Button */}
      <motion.button
        className="save-btn"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        Save Changes
      </motion.button>
    </motion.div>
  );
}

export default Settings;
