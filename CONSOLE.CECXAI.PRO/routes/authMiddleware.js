const jwt = require("jsonwebtoken");

// ✅ Middleware to verify JWT
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

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

// ✅ Middleware to check if user is a "god_developer"
const godDeveloperMiddleware = (req, res, next) => {
    if (req.user.role !== "god_developer") {
        return res.status(403).json({ message: "Access denied. You are not authorized." });
    }
    next();
};

module.exports = { authMiddleware, godDeveloperMiddleware };