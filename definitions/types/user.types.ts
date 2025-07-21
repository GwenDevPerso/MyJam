import {JamSession} from "./Jam.types";

// Updated UserProfile type to match Supabase database schema
export type Profile = {
    id: string; // UUID from auth.users
    firstName: string;
    lastName: string;
    age: number;
    city: string;
    instruments: string[];
    jamsParticipated: JamSession[];
    jamsCreated: JamSession[];
};


// Type for creating/updating a user profile
export type CreateUserProfile = {
    id: string;
    first_name: string;
    last_name: string;
    age: number;
    city: string;
    instruments?: string[];
};

// Type for updating user profile (all fields optional except id)
export type UpdateUserProfile = {
    first_name?: string;
    last_name?: string;
    age: number;
    city: string;
    instruments?: string[];
};

// Type for user profile form data
export type UserProfileFormData = {
    first_name: string;
    last_name: string;
    age: number;
    city: string;
    instruments: string[];
};

// Common instruments enum for consistency
export enum Instrument {
    GUITAR = 'Guitar',
    BASS = 'Bass',
    DRUMS = 'Drums',
    PIANO = 'Piano',
    KEYBOARD = 'Keyboard',
    SAXOPHONE = 'Saxophone',
    TRUMPET = 'Trumpet',
    VIOLIN = 'Violin',
    VOCALS = 'Vocals',
    HARMONICA = 'Harmonica',
    FLUTE = 'Flute',
    CLARINET = 'Clarinet',
    CELLO = 'Cello',
    BANJO = 'Banjo',
    MANDOLIN = 'Mandolin',
    ACCORDION = 'Accordion',
    OTHER = 'Other'
}

// Helper type for authentication
export type AuthUser = {
    id: string;
    email?: string;
    user_metadata?: {
        first_name?: string;
        last_name?: string;
    };
};

// Type for user with their jam sessions
export type UserWithJamSessions = Profile & {
    jam_sessions_created?: {
        id: number;
        name: string;
        date: Date;
        city: string;
        participants: number;
    }[];
    jam_sessions_joined?: {
        id: number;
        jam_session_id: number;
        joined_at: Date;
        jam_sessions?: {
            id: number;
            name: string;
            date: Date;
            city: string;
            location: string;
        };
    }[];
};