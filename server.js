const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" folder (Main Frontend)
app.use(express.static("public"));

// Serve favicon globally for all pages (Update to PNG)
app.use("/favicon.png", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "favicon.png"));
});

// Serve static files from the Trading Dashboard build folder
app.use("/dashboard", express.static(path.join(__dirname, "cecxai-trading", "build")));

// Fix React routing for Trading Dashboard
app.get("/dashboard/*", (req, res) => {
    res.sendFile(path.join(__dirname, "cecxai-trading", "build", "index.html"));
});

// Serve index.html (Main Frontend Page)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve login page
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Serve register page
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register.html"));
});

// Catch-all route to handle 404 errors (Redirect to index.html for SPA handling)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running at: http://localhost:${PORT}`);
    console.log(`🔗 Main Frontend: http://localhost:${PORT}/`);
    console.log(`🔗 Login Page: http://localhost:${PORT}/login`);
    console.log(`🔗 Register Page: http://localhost:${PORT}/register`);
    console.log(`🔗 Trading Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`🔗 Favicon Check: http://localhost:${PORT}/favicon.png`);
});
