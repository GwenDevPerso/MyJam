/*
* This file contains the types for the JamSession for front end.
*/

import {Profile} from "./user.types";

// Updated JamSession type to match Supabase database schema
export type JamSession = {
    id: number;
    name: string;
    description: string;
    style: string;
    date: Date;
    city: string;
    location: string;
    latitude: number;
    longitude: number;
    participants: Profile[];
    createdBy: string; // UUID of the supabase user 
};

// Music styles enum for consistency
export enum MusicStyle {
    JAZZ = 'Jazz',
    ROCK = 'Rock',
    BLUES = 'Blues',
    FUNK = 'Funk',
    CLASSICAL = 'Classical',
    POP = 'Pop',
    REGGAE = 'Reggae',
    COUNTRY = 'Country',
    ELECTRONIC = 'Electronic',
    FOLK = 'Folk',
    OTHER = 'Other'
}

// Helper type for form data
export type JamSessionFormData = {
    name: string;
    description: string;
    style: MusicStyle;
    date: Date;
    city: string;
    location: string;
};


