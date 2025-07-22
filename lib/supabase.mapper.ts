import {JamSession} from "@/definitions/types";
import {Profile} from "@/definitions/types/user.types";
import {RawJamSession, RawProfile} from "./database.types";

const rawProfileToProfile = (rawProfile: RawProfile): Profile => {
    return {
        id: rawProfile.id,
        firstName: rawProfile.first_name,
        lastName: rawProfile.last_name,
        age: rawProfile.age,
        city: rawProfile.city,
        instruments: rawProfile.instruments || [],
        jamsParticipated: [],
        jamsCreated: [],
    }
}

const rawJamSessionToJamSession = (rawJamSession: RawJamSession): JamSession => {
    return {
        id: rawJamSession.id,
        name: rawJamSession.name,
        description: rawJamSession.description,
        style: rawJamSession.style,
        date: new Date(rawJamSession.date),
        city: rawJamSession.city,
        location: rawJamSession.location,
        participants: [],
        createdBy: rawJamSession.created_by,
        latitude: rawJamSession.latitude,
        longitude: rawJamSession.longitude,
    }
}

export const supabaseMapper = {
    rawProfileToProfile,
    rawJamSessionToJamSession,
}