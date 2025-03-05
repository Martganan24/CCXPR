const express = require("express");
const jwt = require("jsonwebtoken");

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

// Protected route
router.get("/", verifyToken, (req, res) => {
    res.json({ message: "Welcome to the protected route!", user: req.user });
});

module.exports = router;
