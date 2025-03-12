import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/Affiliate.css"; // ✅ Ensure this file exists
import { useUser } from "../context/UserContext"; // ✅ Import UserContext

function Affiliate() {
  const { user } = useUser(); // ✅ Get User Data from Context
  const [copied, setCopied] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]); // Optional leaderboard state

  const referralLink = user ? `https://cecxai.com/ref=${user.referral_code}` : ""; // Dynamic referral link

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
  };

  // ✅ Fetch leaderboard data (Optional)
  useEffect(() => {
    fetch("https://console-cecxai-ed25296a7384.herokuapp.com/api/auth/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLeaderboard(data.leaderboard); // ✅ Set leaderboard data
        } else {
          console.error("Error fetching leaderboard:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, []);

  return (
    <motion.div
      className="affiliate-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="affiliate-title">Affiliate Program</h1>

      {/* ✅ Affiliate Overview */}
      <div className="affiliate-grid">
        <motion.div
          className="affiliate-box earnings"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Total Earnings</h2>
          <p className="balance">{user ? `$${user.earnings}` : "Loading..."}</p> {/* Dynamic earnings */}
        </motion.div>

        <motion.div
          className="affiliate-box referrals"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Total Referrals</h2>
          <p className="referral-count">{user ? user.referral_count : "Loading..."}</p> {/* Dynamic referrals */}
        </motion.div>

        <motion.div
          className="affiliate-box commission"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Commission Rate</h2>
          <p className="commission-rate">{user ? `${user.commission_rate}%` : "Loading..."}</p> {/* Dynamic commission */}
        </motion.div>
      </div>

      {/* ✅ Referral Link with Copy Button */}
      <div className="referral-section">
        <input type="text" value={referralLink} readOnly className="referral-input" />
        <button className="copy-btn" onClick={copyToClipboard}>
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>

      {/* ✅ Leaderboard (Optional) */}
      <motion.div
        className="leaderboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2>Top Affiliates</h2>
        <ul>
          {leaderboard.length > 0 ? (
            leaderboard.map((user, index) => (
              <li key={user.id}>
                <span>#{index + 1}</span> {user.name} - <b>${user.total_earnings}</b>
              </li>
            ))
          ) : (
            <li>No leaderboard data available.</li>
          )}
        </ul>
      </motion.div>
    </motion.div>
  );
}

export default Affiliate;
