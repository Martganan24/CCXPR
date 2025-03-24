const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

// ✅ Supabase Client Setup
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ✅ Send a Chat Message (User -> Admin)
router.post("/send", async (req, res) => {
    const { id, message, message_type, attachment_url } = req.body; // ✅ Use id

    if (!id || !message) {
        return res.status(400).json({ message: "User ID and message are required." });
    }

    const { data, error } = await supabase
        .from("user_chat")
        .insert([{ id, message, message_type, attachment_url }])
        .select(); // ✅ Fetch inserted data

    if (error) {
        return res.status(500).json({ message: "Error sending message.", error });
    }

    res.json({ message: "Message sent successfully!", data });
});

// ✅ Get Chat Messages (User's Chat History)
router.get("/history/:id", async (req, res) => {  
    const { id } = req.params; // ✅ Use id

    const { data, error } = await supabase
        .from("user_chat")
        .select("*")
        .eq("id", id)  // ✅ Use id
        .order("created_at", { ascending: true });

    if (error) {
        return res.status(500).json({ message: "Error fetching chat history.", error });
    }

    res.json({ message: "Chat history fetched successfully!", data });
});

// ✅ Get All Chats (For Admin)
router.get("/all", async (req, res) => {
    const { data, error } = await supabase
        .from("user_chat")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) {
        return res.status(500).json({ message: "Error fetching all chats.", error });
    }

    res.json({ message: "All chats fetched successfully!", data });
});

module.exports = router;
