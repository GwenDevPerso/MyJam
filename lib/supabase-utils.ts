import {supabase} from '../constants/supabase';


/*
 * BEST PRACTICE: Profile Creation via Database Trigger
 * 
 * The recommended way to create user profiles is using a database trigger
 * that automatically creates a profile when a user signs up.
 * 
 * Add this SQL to your migration:
 * 
 * -- Create trigger function
 * CREATE OR REPLACE FUNCTION public.handle_new_user()
 * RETURNS trigger
 * LANGUAGE plpgsql
 * SECURITY DEFINER SET search_path = ''
 * AS $$
 * BEGIN
 *   INSERT INTO public.profiles (id, first_name, last_name, age, city, instruments)
 *   VALUES (
 *     NEW.id,
 *     NEW.raw_user_meta_data ->> 'first_name',
 *     NEW.raw_user_meta_data ->> 'last_name',
 *     (NEW.raw_user_meta_data ->> 'age')::int,
 *     NEW.raw_user_meta_data ->> 'city',
 *     CASE 
 *       WHEN NEW.raw_user_meta_data ->> 'instruments' IS NOT NULL 
 *       THEN (NEW.raw_user_meta_data ->> 'instruments')::jsonb::text[]
 *       ELSE NULL
 *     END
 *   );
 *   RETURN NEW;
 * END;
 * $$;
 * 
 * -- Create trigger
 * CREATE TRIGGER on_auth_user_created
 *   AFTER INSERT ON auth.users
 *   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
 * 
 * Then when signing up, pass user metadata:
 * await supabase.auth.signUp({
 *   email: 'user@example.com',
 *   password: 'password',
 *   options: {
 *     data: {
 *       first_name: 'John',
 *       last_name: 'Doe',
 *       age: 25,
 *       city: 'Paris',
 *       instruments: ['guitar', 'piano']
 *     }
 *   }
 * });
 */



// Authentication utilities
export const authService = {
  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Get current session
  async getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Sign up with profile data (triggers automatic profile creation)
  async signUp(email: string, password: string, profileData: {
    first_name: string;
    last_name: string;
    age: number;
    city: string;
    instruments?: string[];
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: profileData
      }
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};

// Jam participation operations
export const participationService = {
  // Join a jam session
  async joinJam(jamSessionId: number, userId: string) {
    const { data, error } = await supabase
      .from('jam_participants')
      .insert({
        jam_session_id: jamSessionId,
        user_id: userId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Leave a jam session
  async leaveJam(jamSessionId: number, userId: string) {
    const { error } = await supabase
      .from('jam_participants')
      .delete()
      .eq('jam_session_id', jamSessionId)
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  // Get participants for a jam session
  async getParticipants(jamSessionId: number) {
    const { data, error } = await supabase
      .from('jam_participants')
      .select(`
        *,
        profiles (
          id,
          first_name,
          last_name,
          age,
          city,
          instruments
        )
      `)
      .eq('jam_session_id', jamSessionId);
    
    if (error) throw error;
    return data;
  },

  // Get jams a user has joined
  async getUserJams(userId: string) {
    const { data, error } = await supabase
      .from('jam_participants')
      .select(`
        *,
        jam_sessions (
          id,
          name,
          description,
          style,
          date,
          city,
          location,
          participants
        )
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }
};


