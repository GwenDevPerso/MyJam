import JamItem from '@/components/JamItem';
import {useAuth} from '@/contexts/AuthContext';
import {JamSession, Profile} from '@/definitions/types';
import {jamSessionService} from '@/lib/services/jam.service';
import {profileService} from '@/lib/services/profile.service';
import {Stack, useLocalSearchParams} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {
    ActivityIndicator,
    Avatar,
    Card,
    Chip,
    IconButton,
    Surface,
    Text,
    useTheme
} from 'react-native-paper';

export default function ParticipantProfileScreen() {
    const {profile: currentUserProfile} = useAuth();
    const {id} = useLocalSearchParams<{id: string;}>();
    const [participantProfile, setParticipantProfile] = useState<Profile | null>(null);
    const [jamsParticipated, setJamsParticipated] = useState<JamSession[]>([]);
    const [jamsCreated, setJamsCreated] = useState<JamSession[]>([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        if (!id) return;

        const loadParticipantProfile = async () => {
            try {
                const profile = await profileService.getById(id);
                setParticipantProfile(profile);

                if (profile) {
                    // Load jams participated and created
                    const [participated, created] = await Promise.all([
                        jamSessionService.getJamsParticipated(profile.id),
                        jamSessionService.getJamsCreated(profile.id)
                    ]);

                    setJamsParticipated(participated);
                    setJamsCreated(created);
                }
            } catch (error) {
                console.error('Error loading participant profile:', error);
            } finally {
                setLoading(false);
            }
        };

        loadParticipantProfile();
    }, [id]);

    if (loading) {
        return (
            <Surface style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
                <ActivityIndicator size="large" />
                <Text variant="bodyLarge" style={{marginTop: 16}}>Chargement...</Text>
            </Surface>
        );
    }

    if (!participantProfile) {
        return (
            <>
                <Stack.Screen options={{title: 'Profil introuvable'}} />
                <Surface style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
                    <Text variant="titleMedium" style={{marginBottom: 16, textAlign: 'center'}}>
                        Profil introuvable
                    </Text>
                    <Text variant="bodyLarge" style={{color: theme.colors.onSurfaceVariant, textAlign: 'center'}}>
                        Le profil de ce participant n&apos;existe pas.
                    </Text>
                </Surface>
            </>
        );
    }

    const handleAddFriend = () => {
        console.log('Add friend');
    };


    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Détail du profil',
                    headerShown: true,
                    headerBackTitle: 'Retour',
                    headerBackVisible: true,
                }}
            />
            <Surface style={{flex: 1, marginBottom: 50}}>
                <Text variant="titleMedium" style={{textAlign: 'center', marginBottom: 16}}>
                    {participantProfile.firstName} {participantProfile.lastName}
                </Text>
                <ScrollView style={{flex: 1}} contentContainerStyle={{padding: 20}}>
                    {/* Header */}
                    <Card style={{padding: 20, marginBottom: 16, alignItems: 'center'}}>
                        <Avatar.Icon
                            size={80}
                            icon="account"
                            style={{backgroundColor: theme.colors.primary, marginBottom: 16}}
                        />
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8, }}>
                            <Text variant="titleMedium" style={{textAlign: 'center'}}>
                                {participantProfile.firstName} {participantProfile.lastName}
                            </Text>
                            <IconButton
                                icon="plus"
                                size={20}
                                onPress={handleAddFriend}
                                mode="contained-tonal"
                            />
                        </View>
                        <Text variant="bodySmall" style={{color: theme.colors.onSurfaceVariant}}>
                            ID: {participantProfile.id}
                        </Text>
                    </Card>

                    {/* Info Cards */}
                    <View style={{flexDirection: 'row', gap: 12, marginBottom: 16}}>
                        <Card style={{flex: 1, padding: 16}}>
                            <Text variant="titleSmall" style={{marginBottom: 4}}>Âge</Text>
                            <Text variant="bodyLarge" style={{fontWeight: '600'}}>
                                {participantProfile.age} ans
                            </Text>
                        </Card>
                        <Card style={{flex: 1, padding: 16}}>
                            <Text variant="titleSmall" style={{marginBottom: 4}}>Ville</Text>
                            <Text variant="bodyLarge" style={{fontWeight: '600'}}>
                                {participantProfile.city || 'Non spécifié'}
                            </Text>
                        </Card>
                    </View>

                    {/* Instruments */}
                    <Card style={{padding: 16, marginBottom: 16}}>
                        <Text variant="titleMedium" style={{marginBottom: 12}}>Instruments</Text>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
                            {participantProfile.instruments?.length > 0 ? (
                                participantProfile.instruments.map((instrument, index) => (
                                    <Chip key={index} mode="flat">
                                        {instrument}
                                    </Chip>
                                ))
                            ) : (
                                <Text variant="bodyMedium" style={{color: theme.colors.onSurfaceVariant}}>
                                    Aucun instrument spécifié
                                </Text>
                            )}
                        </View>
                    </Card>

                    {/* Jams Participated */}
                    <Card style={{padding: 16, marginBottom: 16}}>
                        <Text variant="titleMedium" style={{marginBottom: 12}}>
                            Jams Participées ({jamsParticipated.length})
                        </Text>
                        <ScrollView style={{maxHeight: 300}} showsVerticalScrollIndicator={false}>
                            {jamsParticipated.length > 0 ? (
                                jamsParticipated.map((jam) => (
                                    <JamItem key={jam.id} jam={jam} />
                                ))
                            ) : (
                                <Text variant="bodyMedium" style={{color: theme.colors.onSurfaceVariant, textAlign: 'center', padding: 20}}>
                                    Aucune jam participée
                                </Text>
                            )}
                        </ScrollView>
                    </Card>

                    {/* Jams Created */}
                    <Card style={{padding: 16, marginBottom: 16}}>
                        <Text variant="titleMedium" style={{marginBottom: 12}}>
                            Jams Organisées ({jamsCreated.length})
                        </Text>
                        <ScrollView style={{maxHeight: 300}} showsVerticalScrollIndicator={false}>
                            {jamsCreated.length > 0 ? (
                                jamsCreated.map((jam) => (
                                    <JamItem key={jam.id} jam={jam} />
                                ))
                            ) : (
                                <Text variant="bodyMedium" style={{color: theme.colors.onSurfaceVariant, textAlign: 'center', padding: 20}}>
                                    Aucune jam organisée
                                </Text>
                            )}
                        </ScrollView>
                    </Card>
                </ScrollView>
            </Surface>
        </>
    );
}