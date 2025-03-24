const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js"); // Import Supabase client
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Routes
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const chatRoutes = require("./routes/chat"); // ✅ Added Chat Route

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/chat", chatRoutes); // ✅ Registered Chat Route

// ✅ Fix for "Cannot GET /"
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ✅ Test Supabase Connection
app.get("/api/test-supabase", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*").limit(1);

  if (error) {
    return res.status(500).json({ success: false, message: "Supabase connection failed", error });
  }

  res.json({ success: true, message: "Supabase is connected!", data });
});

// 🆕 ✅ Forgot Password Route
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { fullName, email } = req.body;  // Accept both full name and email

    // Check if user with the provided full name and email exists
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", fullName)  // Match full name
      .eq("email", email)        // Match email
      .single();

    if (error || !user) {
      return res.status(400).json({ message: "Full name and email do not match any user." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password12345", salt);

    // Update password in the database
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", user.id);

    if (updateError) {
      return res.status(500).json({ message: "Error resetting password." });
    }

    res.json({ message: "Password reset successfully." });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🆕 ✅ Register Route (Now assigns no role, defaults to normal user)
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Check if user already exists
    const { data: existingUser, error: userError } = await supabase
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

    // Insert new user without setting role (defaults to normal user)
    const { data, error } = await supabase.from("users").insert([
      { email, password: hashedPassword, username } // No role set
    ]);

    if (error) throw error;

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🆕 ✅ Login Route (No change needed)
app.post("/api/auth/login", async (req, res) => {
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

    // Generate JWT Token with user details
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
