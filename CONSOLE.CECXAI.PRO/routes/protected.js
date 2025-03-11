const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

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

// ✅ Middleware to check if user is god_developer
const verifyGodDeveloper = (req, res, next) => {
    if (req.user.role !== "god_developer") {
        return res.status(403).json({ message: "Access denied. Only god_developer can perform this action." });
    }
    next();
};

// ✅ General Protected Route (For all authenticated users)
router.get("/", verifyToken, (req, res) => {
    res.json({ message: "Welcome to the protected route!", user: req.user });
});

// ✅ God Developer Only Route
router.get("/admin-panel", verifyToken, verifyGodDeveloper, (req, res) => {
    res.json({ message: "Welcome to the God Developer Panel!", user: req.user });
});

module.exports = router;