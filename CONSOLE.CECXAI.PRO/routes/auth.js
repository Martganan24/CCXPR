const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Supabase user model

const router = express.Router();

// Middleware to verify JWT
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

// 🆕 User Registration (Supabase)
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const { error } = await User.createUser(username, email, hashedPassword);
        if (error) throw error;

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🆕 User Login (Supabase)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ message: "Login successful", token });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🆕 Get User Profile (Supabase)
router.get("/profile", verifyToken, async (req, res) => {
    try {
        // Find user by ID (from token)
        const user = await User.findUserById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Exclude password
        delete user.password;

        res.json({ message: "User profile fetched successfully", user });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🆕 Update User Profile (Supabase)
router.put("/update", verifyToken, async (req, res) => {
    try {
        const { username, email } = req.body;

        const { error } = await User.updateUser(req.user.userId, { username, email });
        if (error) throw error;

        res.json({ message: "Profile updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🆕 Change Password (Supabase)
router.put("/change-password", verifyToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Find user
        const user = await User.findUserById(req.user.userId);
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
        const { error } = await User.updateUser(req.user.userId, { password: hashedPassword });
        if (error) throw error;

        res.json({ message: "Password changed successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🆕 Delete User Account (Supabase)
router.delete("/delete", verifyToken, async (req, res) => {
    try {
        const { error } = await User.deleteUser(req.user.userId);
        if (error) throw error;

        res.json({ message: "User account deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
