// Supabase Configuration
// Replace these with your actual Supabase project credentials
// You can find these in your Supabase Dashboard > Settings > API

export const supabaseConfig = {
  url: 'https://zlkjeljkheynhghbdgij.supabase.co', // Replace with your Supabase project URL
  anonKey: process.env.SUPABASE_ANON_KEY ?? '', // Anon key (safe for client)
};

// Add other app configuration here as needed
export const appConfig = {
  name: 'MyJam',
  version: '1.0.0',
}; 