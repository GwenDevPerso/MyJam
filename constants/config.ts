// Supabase Configuration
// Replace these with your actual Supabase project credentials
// You can find these in your Supabase Dashboard > Settings > API

export const supabaseConfig = {
  url: 'https://zlkjeljkheynhghbdgij.supabase.co', // Replace with your Supabase project URL
  anonKey: process.env.SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsa2plbGpraGV5bmhnaGJkZ2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMTU5MTUsImV4cCI6MjA2Nzg5MTkxNX0.U26kEPgV4wzXQy477Qn-KUt1KoqKylpWhgee4VXBzDs', // Anon key (safe for client)
};

// Mapbox Configuration
// Get your access token from Mapbox: https://account.mapbox.com/access-tokens/
// 1. Sign up for a free Mapbox account at https://www.mapbox.com/
// 2. Go to your account settings and create a new access token
// 3. Set the MAPBOX_ACCESS_TOKEN environment variable or replace the value below
// 4. Make sure your token has the necessary scopes (geocoding, maps)
export const mapboxConfig = {
  accessToken: process.env.MAPBOX_ACCESS_TOKEN ?? 'pk.eyJ1IjoiZ3dlbmFlbGJpaGFuIiwiYSI6ImNtZGV3ZnVmdzA2eXYybHE1NHdwdHY0dXcifQ.L5369Cx7fBrf0VAcCsPxgA', // Replace with your Mapbox access token
};

// Add other app configuration here as needed
export const appConfig = {
  name: 'MyJam',
  version: '1.0.0',
}; 