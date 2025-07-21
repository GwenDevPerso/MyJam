import {Profile} from "@/definitions/types/user.types";
import {ProfileUpdate} from "@/lib/database.types";
import {supabase} from "../../constants/supabase";
import {supabaseMapper} from "../supabase.mapper";

// Profile operations
export const profileService = {
    // Get profile by user ID
    async getById(userId: string): Promise<Profile | null> {
        const {data, error} = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return supabaseMapper.rawProfileToProfile(data);
    },

    // Get profile with jam sessions participated
    //Not used yet
    async getByIdWithJamSessions(userId: string) {
        const {data, error} = await supabase
            .from('profiles')
            .select(`
          *,
          jam_participants (
            id,
            jam_session_id,
            joined_at,
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
          )
        `)
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },


    // Update profile
    async updateProfile(userId: string, updates: ProfileUpdate) {
        const {data, error} = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
