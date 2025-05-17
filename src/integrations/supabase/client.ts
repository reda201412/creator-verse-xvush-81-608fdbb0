import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL and Anon Key environment variables must be set.");
  // Depending on your app's needs, you might want to throw an error here
  // throw new Error("Supabase credentials not configured.");
}

// Create a single Supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl as string, // Cast to string, assuming the check above ensures they are set
  supabaseAnonKey as string
);

// Optional: Export types if needed elsewhere
// export type Database = Database; // If you have a generated types file
