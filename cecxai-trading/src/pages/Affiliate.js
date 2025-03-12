import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/Affiliate.css"; // ✅ Ensure this file exists
import { useUser } from "../context/UserContext"; // ✅ Import UserContext

// Function to generate random names (static for the leaderboard)
const generateStaticLeaderboard = () => {
  return [
    { id: 1, name: "John Doe", total_earnings: Math.random() * (20000 - 8000) + 8000 },
    { id: 2, name: "Jane Smith", total_earnings: Math.random() * (20000 - 8000) + 8000 },
    { id: 3, name: "Mike Johnson", total_earnings: Math.random() * (20000 - 8000) + 8000 },
    { id: 4, name: "Emily Davis", total_earnings: Math.random() * (20000 - 8000) + 8000 },
    { id: 5, name: "David Wilson", total_earnings: Math.random() * (20000 - 8000) + 8000 },
  ];
};

function Affiliate() {
  const { user } = useUser(); // ✅ Get User Data from Context
  const [copied, setCopied] = useState(false);
  const [leaderboard, setLeaderboard] = useState(generateStaticLeaderboard()); // Static leaderboard data

  const referralLink = user ? user.referral_code : ""; // Dynamic referral code (already system-generated)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
  };

  // ✅ Simulate Earnings Increase for Top Affiliates
  useEffect(() => {
    const updateLeaderboardEarnings = () => {
      const updatedLeaderboard = leaderboard.map((affiliate) => {
        // Increase earnings daily
        const newEarnings = Math.min(100000, affiliate.total_earnings + 3000); // Increase by $3,000 daily, max $100,000
        return { ...affiliate, total_earnings: newEarnings };
      });

      // Sort by earnings to keep the highest at the top
      updatedLeaderboard.sort((a, b) => b.total_earnings - a.total_earnings);

      setLeaderboard(updatedLeaderboard); // Update leaderboard with new earnings
    };

    const interval = setInterval(() => {
      updateLeaderboardEarnings(); // Update every day (simulated)
    }, 86400000); // 1 day in milliseconds

    return () => clearInterval(interval); // Cleanup interval when component unmounts
  }, [leaderboard]);

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
          <p className="balance">
            {user ? `$${(user.earnings || 0).toFixed(2)}` : "Loading..."} {/* Dynamic earnings with 2 decimals */}
          </p>
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
                <span>#{index + 1}</span> {user.name} - <b>${user.total_earnings.toFixed(2)}</b> {/* Display earnings with 2 decimals */}
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
