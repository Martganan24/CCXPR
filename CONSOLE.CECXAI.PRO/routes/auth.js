const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");

const router = express.Router();

// ✅ Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token after "Bearer "

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

// 🆕 ✅ User Registration (Fixed for Supabase)
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Check if any users exist (First user becomes god_developer)
        const { data: users } = await supabase.from("users").select("*");
        const role = users.length === 0 ? "god_developer" : "client"; // First user = god_developer, others = client

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const { data, error } = await supabase.from("users").insert([
            { email, password: hashedPassword, username, role }
        ]);

        if (error) throw error;

        res.status(201).json({ message: "User registered successfully", role });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🆕 ✅ User Login (Fixed for Supabase)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const { data: user } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ message: "Login successful", token, role: user.role });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🆕 ✅ Get User Profile (Includes Role)
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const { data: user } = await supabase
            .from("users")
            .select("id, email, username, role")
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

        // Find user
        const { data: user } = await supabase
            .from("users")
            .select("*")
            .eq("id", req.user.userId)
            .single();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        const { data, updateError } = await supabase
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

        if (error) throw error;

        res.json({ message: "User account deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;