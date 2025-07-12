import {UserProfile} from '@/definitions/types';
import {jamListMock} from "./jam.mock";

// Données mock pour l'exemple
export const profileMock: UserProfile = {
    id: "USR-2024-001",
    firstName: "Marie",
    lastName: "Dubois",
    age: 28,
    city: "Paris",
    instruments: ["Guitare", "Piano", "Basse", "Chant"],
    jamsParticipated: jamListMock
  };