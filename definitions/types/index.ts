// Export all Jam Session related types
export type {
    JamSession, JamSessionFormData
} from './Jam.types';

export {MusicStyle} from './Jam.types';

// Export all User Profile related types
export type {
    AuthUser, CreateUserProfile, Participant, UpdateUserProfile, UserProfileFormData, UserWithJamSessions
} from './user.types';

export {Instrument} from './user.types';

// Export Supabase database types
export type {Json} from '../../lib/database.types';

// Export Supabase utility types
export type {
    JamSessionInsert,
    JamSessionUpdate, ProfileInsert,
    ProfileUpdate
} from '../../lib/database.types';

// Common utility types
export type DatabaseResponse<T> = {
    data: T | null;
    error: Error | null;
};

export type PaginatedResponse<T> = {
    data: T[];
    count: number | null;
    error: Error | null;
};

// API Response types
export type ApiResponse<T = any> = {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
};

// Form validation types
export type ValidationError = {
    field: string;
    message: string;
};

export type FormState<T> = {
    data: T;
    errors: ValidationError[];
    isValid: boolean;
    isSubmitting: boolean;
};

