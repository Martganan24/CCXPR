const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

class User {
    // 🆕 Find user by email (Includes Role)
    static async findUserByEmail(email) {
        const { data, error } = await supabase
            .from("users")
            .select("id, email, username, role") // ✅ Fetching role
            .eq("email", email)
            .single();
        if (error) return null;
        return data;
    }

    // 🆕 Find user by ID (Includes Role)
    static async findUserById(id) {
        const { data, error } = await supabase
            .from("users")
            .select("id, email, username, role") // ✅ Fetching role
            .eq("id", id)
            .single();
        if (error) return null;
        return data;
    }

    // 🆕 Create a new user (Includes Default Role: client)
    static async createUser(username, email, password) {
        const { data, error } = await supabase
            .from("users")
            .insert([{ username, email, password, role: "client" }]) // ✅ Default role: client
            .select(); // ✅ Ensure it returns the inserted user

        return { data, error };
    }

    // 🆕 Update user details (Allow updating role)
    static async updateUser(id, updates) {
        const { error } = await supabase
            .from("users")
            .update(updates)
            .eq("id", id);
        return { error };
    }

    // 🆕 Delete user
    static async deleteUser(id) {
        const { error } = await supabase
            .from("users")
            .delete()
            .eq("id", id);
        return { error };
    }
}

module.exports = User;