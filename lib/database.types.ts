// Database types for Supabase
export type Json = string | number | boolean | null | {[key: string]: Json | undefined} | Json[];

export type RawProfile = {
  id: string;
  age: number;
  city: string;
  created_at: string | null;
  first_name: string;
  instruments: string[] | null;
  last_name: string;
  updated_at: string | null;
};

export type ProfileInsert = {
  first_name: string;
  last_name: string;
  age: number;
  city: string;
  instruments: string[];
};

export type ProfileUpdate = {
  id: string;
  first_name?: string;
  last_name?: string;
  age?: number;
  city?: string;
  instruments?: string[];
};

export type RawJamSession = {
  id: number;
  city: string;
  created_at: string | null;
  created_by: string;
  date: string;
  description: string;
  location: string;
  name: string;
  style: string;
  updated_at: string | null;
};

export type JamSessionInsert = {
  city: string;
  date: string;
  description: string;
  location: string;
  name: string;
  style: string;
  latitude: number;
  longitude: number;
};

export type JamSessionUpdate = {
  id: number;
  name?: string;
  description?: string;
  style?: string;
  date?: string;
  city?: string;
  location?: string;
};

export type RawJamParticipant = {
  id: number;
  jam_session_id: number;
  joined_at: string | null;
  user_id: string;
};

export type JamParticipantInsert = {
  jam_session_id: number;
  joined_at: string | null;
  user_id: string;
};
export type JamParticipantUpdate = {
  id?: number;
  jam_session_id?: number;
  joined_at?: string | null;
  user_id?: string;
};

export type RawParticipant = {
  id: number;
  user_id: string;
  jam_session_id: number;
  joined_at: string | null;
};

// Relationships: [
//   {
//       foreignKeyName: 'jam_participants_jam_session_id_fkey';
//       columns: ['jam_session_id'];
//       isOneToOne: false;
//       referencedRelation: 'jam_sessions';
//       referencedColumns: ['id'];
//   },
// ];

