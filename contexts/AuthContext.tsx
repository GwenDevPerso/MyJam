import {Profile} from '@/definitions/types/user.types';
import {Session, User} from '@supabase/supabase-js';
import {router} from 'expo-router';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {supabase} from '../constants/supabase';
import {profileService} from '../lib/services/profile.service';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, userData: {
        firstName: string;
        lastName: string;
        age: number;
        city: string;
        instruments: string[]; // Make instruments optional
    }) => Promise<void>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async () => {
        if (user) {
            try {
                const userProfile: Profile | null = await profileService.getById(user.id);
                setProfile(userProfile);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setProfile(null);
            }
        } else {
            setProfile(null);
        }
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Refresh profile when user changes
    useEffect(() => {
        refreshProfile();
    }, [user]);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            const {error} = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            router.push('/(tabs)');
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, userData: {firstName: string; lastName: string; age: number; city: string; instruments: string[];}) => {
        setLoading(true);
        try {
            // Use the authService.signUp method which passes metadata correctly
            const {error} = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: userData.firstName,
                        last_name: userData.lastName,
                        age: userData.age,
                        city: userData.city,
                        instruments: userData.instruments
                    }
                }
            });

            if (error) throw error;

            router.push('/(tabs)');

            // No need to manually create profile - the trigger handles it!
            // The profile will be automatically created by the database trigger

        } catch (error) {
            console.error('Error signing up:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            const {error} = await supabase.auth.signOut();
            if (error) throw error;
            setProfile(null);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value: AuthContextType = {
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 