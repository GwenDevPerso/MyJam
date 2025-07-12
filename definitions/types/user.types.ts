import {JamSession} from "./Jam.types";

// Types pour les données du profil
export type UserProfile = {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    city: string;
    instruments: string[];
    jamsParticipated: JamSession[];
};