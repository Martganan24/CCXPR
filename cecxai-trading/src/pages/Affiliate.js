import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/Affiliate.css"; // ✅ Ensure this file exists

function Affiliate() {
  const [referralLink] = useState("https://cecxai.com/ref=123456"); // Example referral link
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
  };

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
          <p className="balance">$1,234.56</p>
        </motion.div>

        <motion.div
          className="affiliate-box referrals"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Total Referrals</h2>
          <p className="referral-count">58</p>
        </motion.div>

        <motion.div
          className="affiliate-box commission"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Commission Rate</h2>
          <p className="commission-rate">10%</p>
        </motion.div>
      </div>

      {/* ✅ Referral Link with Copy Button */}
      <div className="referral-section">
        <input type="text" value={referralLink} readOnly className="referral-input" />
        <button className="copy-btn" onClick={copyToClipboard}>
          {copied ? "Copied!" : "Copy Link"}
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
          <li>
            <span>#1</span> User123 - <b>$5,678</b>
          </li>
          <li>
            <span>#2</span> CryptoKing - <b>$4,321</b>
          </li>
          <li>
            <span>#3</span> TradeMaster - <b>$3,210</b>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
}

export default Affiliate;
