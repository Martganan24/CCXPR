import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/Affiliate.css"; // ✅ Ensure this file exists
import { useUser } from "../context/UserContext"; // ✅ Import UserContext

// Function to generate random names
const generateRandomName = () => {
  const names = [
    "John Doe", "Jane Smith", "Mike Johnson", "Emily Davis", "David Wilson",
    "Sarah Brown", "Chris Lee", "Jessica White", "Matthew Harris", "Amanda Clark"
  ];
  return names[Math.floor(Math.random() * names.length)];
};

// Function to generate random earnings in the range
const generateRandomEarnings = () => {
  return (Math.random() * (100000 - 8000) + 8000).toFixed(2); // Random between $8,000 and $100,000
};

function Affiliate() {
  const { user } = useUser(); // ✅ Get User Data from Context
  const [copied, setCopied] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]); // Optional leaderboard state

  const referralLink = user ? user.referral_code : ""; // Dynamic referral code (already system-generated)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
  };

  // ✅ Fetch leaderboard data (Optional)
  useEffect(() => {
    const generateLeaderboard = () => {
      const newLeaderboard = Array.from({ length: 5 }).map((_, index) => ({
        id: index + 1,
        name: generateRandomName(),
        total_earnings: generateRandomEarnings(),
      }));

      // Sort to ensure the top earner is first
      newLeaderboard.sort((a, b) => b.total_earnings - a.total_earnings);

      setLeaderboard(newLeaderboard); // ✅ Set leaderboard data
    };

    generateLeaderboard(); // Initial leaderboard generation

    const interval = setInterval(() => {
      generateLeaderboard(); // Update leaderboard daily
    }, 86400000); // 1 day in milliseconds

    return () => clearInterval(interval); // Cleanup interval when component unmounts
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
          <p className="balance">{user ? `$${user.earnings || 0}` : "Loading..."}</p> {/* Dynamic earnings */}
        </motion.div>

        <motion.div
          className="affiliate-box referrals"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Total Referrals</h2>
          <p className="referral-count">{user ? user.referral_count || 0 : "Loading..."}</p> {/* Dynamic referrals */}
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

      {/* ✅ Referral Code with Copy Button */}
      <div className="referral-section">
        <input type="text" value={referralLink} readOnly className="referral-input" />
        <button className="copy-btn" onClick={copyToClipboard}>
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>

      {/* ✅ Leaderboard */}
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
