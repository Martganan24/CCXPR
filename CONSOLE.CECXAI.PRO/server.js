const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js"); // Import Supabase client

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

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
