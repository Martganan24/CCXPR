import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "Yhttps://ipdkpskicsvesobhodaz.supabase.co"; // 🔥 Replace with your Supabase URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwZGtwc2tpY3N2ZXNvYmhvZGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NzE5NjgsImV4cCI6MjA1NzE0Nzk2OH0.LJhXO0GjPYOLRcEk2t2lsmJMewtYwIFc9AxyzbGmT_g"; // 🔥 Replace with your Anon Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
