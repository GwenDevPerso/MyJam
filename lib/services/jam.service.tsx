import {supabase} from "@/constants/supabase";
import {JamSession} from "@/definitions/types";
import {Alert} from "react-native";
import {JamSessionInsert, JamSessionUpdate, RawJamSession, RawParticipant, RawProfile} from "../database.types";
import {supabaseMapper} from "../supabase.mapper";
// Type aliases for easier usage

// Jam Session operations
export const jamSessionService = {
    // Get all jam sessions
    async getAllAvailableJams(date?: Date) {
        const {data, error} = await supabase
            .from('jam_sessions')
            .select('*')
            .gte('date', date?.toISOString() ?? new Date().toISOString())
            .order('date', {ascending: true});

        if (error) throw error;
        return data.map((rawJamSession: RawJamSession) => supabaseMapper.rawJamSessionToJamSession(rawJamSession));
    },

    // Get jams participated by user
    async getJamsParticipated(userId: string): Promise<JamSession[]> {
        const {data, error} = await supabase
            .from('jam_sessions')
            .select(`
                *,
                jam_participants!inner (
                    id,
                    user_id,
                    joined_at
                )
            `)
            .eq('jam_participants.user_id', userId)
            .order('date', {ascending: true});

        if (error) throw error;
        return data.map((rawJamSession: RawJamSession) => supabaseMapper.rawJamSessionToJamSession(rawJamSession));
    },

    async getJamsCreated(userId: string): Promise<JamSession[]> {
        const {data, error} = await supabase
            .from('jam_sessions')
            .select('*')
            .eq('created_by', userId)
            .order('date', {ascending: true});

        if (error) throw error;
        return data.map((rawJamSession: RawJamSession) => supabaseMapper.rawJamSessionToJamSession(rawJamSession));
    },

    async getUserNextJams(userId: string): Promise<JamSession[]> {
        const {data, error} = await supabase
            .from('jam_sessions')
            .select(`
                *,
                jam_participants!inner (
                    id,
                    user_id,
                    joined_at
                )
            `)
            .gt('date', new Date().toISOString())
            .eq('jam_participants.user_id', userId)
            .order('date', {ascending: true});

        if (error) throw error;
        return data.map((rawJamSession: RawJamSession) => supabaseMapper.rawJamSessionToJamSession(rawJamSession));
    },

    // Get jam session by ID
    async getById(id: number) {
        const {data, error} = await supabase
            .from('jam_sessions')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return supabaseMapper.rawJamSessionToJamSession(data);
    },

    // Get jam session with participants
    async getByIdWithParticipants(id: number): Promise<JamSession> {
        const {data, error} = await supabase
            .from('jam_sessions')
            .select(`
            *,
            jam_participants (
                id,
                user_id,
                joined_at
            )
        `)
            .eq('id', id)
            .single();

        if (error) throw error;

        const jamSession = supabaseMapper.rawJamSessionToJamSession(data);
        const rawParticipants: RawParticipant[] = data.jam_participants;

        // If we have participants, get their profiles
        if (rawParticipants && rawParticipants.length > 0) {
            const userIds = rawParticipants.map((p: RawParticipant) => p.user_id);

            const {data: profiles, error: profilesError} = await supabase
                .from('profiles')
                .select('id, first_name, last_name, age, city, instruments, created_at, updated_at')
                .in('id', userIds);

            if (profilesError) throw profilesError;

            return {
                ...jamSession,
                participants: profiles.map((profile: RawProfile) => supabaseMapper.rawProfileToProfile(profile))
            };
        }

        return jamSession;
    },


    async joinJam(jamSessionId: number, profileId: string) {
        const {error} = await supabase
            .from('jam_participants')
            .insert({
                jam_session_id: jamSessionId,
                user_id: profileId,
            });

        if (error) {
            if (error.code === '23505') {
                Alert.alert('Erreur', 'Vous êtes déjà dans cette session');
            }
            throw error;
        }
    },

    async leaveJam(jamSessionId: number, profileId: string) {
        const {error} = await supabase
            .from('jam_participants')
            .delete()
            .eq('jam_session_id', jamSessionId)
            .eq('user_id', profileId);

        if (error) throw error;
    },


    // Create new jam session
    async create(jamSession: JamSessionInsert) {
        const {data, error} = await supabase
            .from('jam_sessions')
            .insert(jamSession)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update jam session
    async update(id: number, updates: JamSessionUpdate) {
        const {data, error} = await supabase
            .from('jam_sessions')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete jam session
    async delete(id: number) {
        const {error} = await supabase
            .from('jam_sessions')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Get jam sessions by city
    async getByCity(city: string) {
        const {data, error} = await supabase
            .from('jam_sessions')
            .select('*')
            .eq('city', city)
            .order('date', {ascending: true});

        if (error) throw error;
        return data;
    },

    // Get jam sessions by style
    async getByStyle(style: string) {
        const {data, error} = await supabase
            .from('jam_sessions')
            .select('*')
            .eq('style', style)
            .order('date', {ascending: true});

        if (error) throw error;
        return data;
    },

    async getNearbyJams(latitude: number, longitude: number, radiusKm: number = 10) {
        const {data, error} = await supabase
            .from('jam_sessions')
            .select('*')
            .gte('latitude', latitude - radiusKm)
            .lte('latitude', latitude + radiusKm)
            .gte('longitude', longitude - radiusKm)
            .lte('longitude', longitude + radiusKm)
            .order('date', {ascending: true});

        if (error) throw error;
        return data.map((rawJamSession: RawJamSession) =>
            supabaseMapper.rawJamSessionToJamSession(rawJamSession)
        );
    }
};
