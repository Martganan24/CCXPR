import { createClient } from '@supabase/supabase-js';

// Your Supabase URL and Key (add these to your .env file)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
