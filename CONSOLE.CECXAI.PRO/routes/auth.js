const express = require("express");
const cors = require("cors");  // ✅ Import cors
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");
const { processReferral } = require("./referral"); // Import the referral logic

const router = express.Router();

// ✅ Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};

// ✅ Enable CORS for frontend
router.use(cors({
  origin: "https://ceccxai-frontend-b334232d6e3e.herokuapp.com",  // ✅ Allow frontend domain
  methods: "GET,POST,PUT,DELETE", // ✅ Allow specific HTTP methods
  allowedHeaders: "Content-Type,Authorization"  // ✅ Allow these headers
}));

// ✅ Generate Unique Referral Code
const generateReferralCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
};

// 🆕 ✅ Fetch User Details by ID (For Dashboard)
router.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const { data: user, error } = await supabase
            .from("users")
            .select("id, email, username, balance, commission_balance, total_referrals, commission_rate, total_earnings, referral_code")
            .eq("id", userId)
            .single();

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

// 🆕 ✅ User Registration (With Default Values)
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, referral_code } = req.body;

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate referral code for the new user
        const referralCode = generateReferralCode();

        // Create new user with default values
        const { data, error } = await supabase.from("users").insert([ 
            { 
                email, 
                password: hashedPassword, 
                username, 
                balance: 0, 
                commission_balance: 0, 
                total_referrals: 0, 
                commission_rate: 3, 
                total_earnings: 0, 
                referral_code: referralCode 
            }
        ]);

        if (error) throw error;

        // Step 2: If referral code is provided, process the referral and update referrer's balance and referral count
        if (referral_code) {
            try {
                const result = await processReferral(referral_code, data[0].id); // Call referral logic
                if (result.success) {
                    return res.status(200).json({ message: "User registered successfully and referral processed!" });
                }
            } catch (error) {
                return res.status(400).json({ message: error.message });
            }
        }

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🆕 ✅ User Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data: user } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🆕 ✅ Get User Profile
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const { data: user } = await supabase
            .from("users")
            .select("id, email, username, balance, commission_balance, total_referrals, commission_rate, total_earnings, referral_code")
            .eq("id", req.user.userId)
            .single();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User profile fetched successfully", user });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🆕 ✅ Update User Profile
router.put("/update", verifyToken, async (req, res) => {
    try {
        const { username, email } = req.body;

        const { data, error } = await supabase
            .from("users")
            .update({ username, email })
            .eq("id", req.user.userId);

        if (error) throw error;

        res.json({ message: "Profile updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🆕 ✅ Change Password
router.put("/change-password", verifyToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const { data: user } = await supabase
            .from("users")
            .select("*")
            .eq("id", req.user.userId)
            .single();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const { updateError } = await supabase
            .from("users")
            .update({ password: hashedPassword })
            .eq("id", req.user.userId);

        if (updateError) throw updateError;

        res.json({ message: "Password changed successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🆕 ✅ Delete User Account
router.delete("/delete", verifyToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .delete()
            .eq("id", req.user.userId);

            if (error) {
                console.error("Supabase Insert Error:", error);
                return res.status(500).json({ message: "Database error", error });
            }
            
        res.json({ message: "User account deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;