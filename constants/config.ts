// Supabase Configuration
// Replace these with your actual Supabase project credentials
// You can find these in your Supabase Dashboard > Settings > API

export const supabaseConfig = {
  url: 'https://zlkjeljkheynhghbdgij.supabase.co', // Replace with your Supabase project URL
  anonKey: process.env.SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsa2plbGpraGV5bmhnaGJkZ2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMTU5MTUsImV4cCI6MjA2Nzg5MTkxNX0.U26kEPgV4wzXQy477Qn-KUt1KoqKylpWhgee4VXBzDs', // Anon key (safe for client)
};

// OpenStreetMap Configuration
// Using OpenStreetMap Nominatim API for geocoding - free and open source!
// No API key required, but please be respectful with request frequency
// Documentation: https://nominatim.org/release-docs/develop/api/Search/
export const osmConfig = {
  // Base URL for Nominatim API
  nominatimUrl: 'https://nominatim.openstreetmap.org',
  // User agent required by Nominatim (identifies your app)
  userAgent: 'MyJam/1.0.0',
  // Default country codes for search filtering (optional)
  defaultCountryCodes: ['fr', 'es'], // France et Espagne
};

// Add other app configuration here as needed
export const appConfig = {
  name: 'MyJam',
  version: '1.0.0',
}; 