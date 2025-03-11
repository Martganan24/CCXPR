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

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

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

// 🆕 ✅ Register Route (Now assigns 'client' role)
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

    // Insert new user with default role 'client'
    const { data, error } = await supabase.from("users").insert([
      { email, password: hashedPassword, username, role: "client" } // 🆕 Added role
    ]);

    if (error) throw error;

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🆕 ✅ Login Route (Now works directly in `server.js`)
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const { data: user, error } = await supabase
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

    // Generate JWT Token
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
