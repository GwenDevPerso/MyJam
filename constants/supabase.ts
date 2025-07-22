import {Database} from '@/lib/database.types';
import {createClient} from '@supabase/supabase-js';
import {supabaseConfig} from './config';

// Simple web-first configuration
export const supabase = createClient<Database>(supabaseConfig.url, supabaseConfig.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 