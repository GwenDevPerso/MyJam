import {useAuth} from '@/contexts/AuthContext';
import {JamSession} from '@/definitions/types';
import {jamSessionService} from '@/lib/services/jam.service';
import {Link, Stack, router, useLocalSearchParams} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, View} from 'react-native';
import {
    ActivityIndicator,
    Avatar,
    Button,
    Card,
    Chip,
    Divider,
    IconButton,
    Surface,
    Text,
    Title,
    useTheme
} from 'react-native-paper';

export default function JamDetailScreen() {
    const {profile} = useAuth();
    const {id} = useLocalSearchParams<{id: string;}>();
    const [jamSession, setJamSession] = useState<JamSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        jamSessionService.getByIdWithParticipants(parseInt(id || '1')).then((jam) => {
            setJamSession(jam);
            setLoading(false);
        }).catch((error) => {
            console.error('Error loading jam session:', error);
            setLoading(false);
        });
    }, [profile, id]);

    if (loading) {
        return (
            <Surface style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
                <ActivityIndicator size="large" />
                <Text variant="bodyLarge" style={{marginTop: 16}}>Chargement...</Text>
            </Surface>
        );
    }

    // Fallback if jam not found
    if (!jamSession) {
        return (
            <>
                <Stack.Screen options={{title: 'Session introuvable'}} />
                <Surface style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
                    <Title style={{marginBottom: 16, textAlign: 'center'}}>
                        Session introuvable
                    </Title>
                    <Text variant="bodyLarge" style={{color: theme.colors.onSurfaceVariant, marginBottom: 24, textAlign: 'center'}}>
                        La session de jam que vous recherchez n&apos;existe pas.
                    </Text>
                    <Button mode="contained" onPress={() => router.back()}>
                        Retour
                    </Button>
                </Surface>
            </>
        );
    }

    const handleJoinJam = async () => {
        if (!profile) {
            Alert.alert('Erreur', 'Vous devez être connecté pour rejoindre une session');
            return;
        }

        setActionLoading(true);
        try {
            await jamSessionService.joinJam(jamSession.id, profile.id);
            Alert.alert('Succès', 'Vous avez rejoint la session !', [
                {text: 'OK', onPress: () => router.back()}
            ]);
        } catch (error) {
            console.error('Error joining jam:', error);
            Alert.alert('Erreur', 'Impossible de rejoindre la session');
        } finally {
            setActionLoading(false);
        }
    };

    const handleLeaveJam = async () => {
        if (!profile) {
            Alert.alert('Erreur', 'Vous devez être connecté pour quitter une session');
            return;
        }

        Alert.alert(
            'Quitter la session',
            'Êtes-vous sûr de vouloir quitter cette session ?',
            [
                {text: 'Annuler', style: 'cancel'},
                {
                    text: 'Quitter',
                    style: 'destructive',
                    onPress: async () => {
                        setActionLoading(true);
                        try {
                            await jamSessionService.leaveJam(jamSession.id, profile.id);
                            Alert.alert('Succès', 'Vous avez quitté la session !', [
                                {text: 'OK', onPress: () => router.back()}
                            ]);
                        } catch (error) {
                            console.error('Error leaving jam:', error);
                            Alert.alert('Erreur', 'Impossible de quitter la session');
                        } finally {
                            setActionLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const deleteJam = async () => {
        Alert.alert(
            'Supprimer la session',
            'Voulez-vous vraiment supprimer cette session ? Cette action est irréversible.',
            [
                {text: 'Annuler', style: 'cancel'},
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await jamSessionService.delete(jamSession.id);
                            Alert.alert('Succès', 'Session supprimée avec succès', [
                                {text: 'OK', onPress: () => router.push('/')}
                            ]);

                        } catch (error) {
                            console.error('Error deleting jam:', error);
                            Alert.alert('Erreur', 'Impossible de supprimer la session');
                        }
                    }
                }
            ]
        );
    };

    const editJam = () => {
        router.push(`/edit/${jamSession.id}`);
    };

    const isUserParticipant = jamSession.participants.some(p => p.id === profile?.id);
    const isCreator = profile?.id === jamSession.createdBy;

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Détail de la session',
                    headerShown: true,
                    headerBackTitle: 'Retour',
                    headerBackVisible: true,
                }}
            />
            <Surface style={{flex: 1}}>
                <ScrollView style={{flex: 1}} contentContainerStyle={{padding: 16}}>
                    {/* Header Card */}
                    <Card style={{marginBottom: 16}}>
                        <Card.Content style={{alignItems: 'center', padding: 20}}>
                            {isCreator && (
                                <View style={{flexDirection: 'row', gap: 8, alignSelf: 'flex-end', marginBottom: 16}}>
                                    <IconButton
                                        icon="delete"
                                        mode="contained-tonal"
                                        onPress={deleteJam}
                                        iconColor={theme.colors.error}
                                    />
                                    <IconButton
                                        icon="pencil"
                                        mode="contained-tonal"
                                        onPress={editJam}
                                    />
                                </View>
                            )}

                            <Chip
                                mode="flat"
                                style={{marginBottom: 16, backgroundColor: theme.colors.primaryContainer}}
                                textStyle={{color: theme.colors.onPrimaryContainer}}
                            >
                                {jamSession.style}
                            </Chip>

                            <Text variant="titleMedium" style={{textAlign: 'center', fontSize: 24, marginBottom: 8}}>
                                {jamSession.name}
                            </Text>
                        </Card.Content>
                    </Card>

                    {/* Date & Time Card */}
                    <Card style={{marginBottom: 16}}>
                        <Card.Content>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                                <IconButton icon="calendar" size={20} style={{margin: 0}} />
                                <Text variant="titleMedium" style={{marginLeft: 8}}>
                                    Date & Heure
                                </Text>
                            </View>
                            <Text variant="bodyLarge" style={{marginLeft: 32}}>
                                {formatDate(new Date(jamSession.date))}
                            </Text>
                            <Text variant="bodyMedium" style={{marginLeft: 32, color: theme.colors.onSurfaceVariant}}>
                                {formatTime(new Date(jamSession.date))}
                            </Text>
                        </Card.Content>
                    </Card>

                    {/* Location Card */}
                    <Card style={{marginBottom: 16}}>
                        <Card.Content>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                                <IconButton icon="map-marker" size={20} style={{margin: 0}} />
                                <Text variant="titleMedium" style={{marginLeft: 8}}>
                                    Lieu
                                </Text>
                            </View>
                            <Text variant="bodyLarge" style={{marginLeft: 32}}>
                                {jamSession.location}
                            </Text>
                            <Text variant="bodyMedium" style={{marginLeft: 32, color: theme.colors.onSurfaceVariant}}>
                                {jamSession.city}
                            </Text>
                        </Card.Content>
                    </Card>

                    {/* Participants Card */}
                    <Card style={{marginBottom: 16}}>
                        <Card.Content>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
                                <IconButton icon="account-group" size={20} style={{margin: 0}} />
                                <Text variant="titleMedium" style={{marginLeft: 8}}>
                                    Participants ({jamSession.participants.length})
                                </Text>
                            </View>

                            {jamSession.participants.length > 0 ? (
                                <ScrollView style={{maxHeight: 200}} showsVerticalScrollIndicator={false}>
                                    {jamSession.participants.map((participant, index) => (
                                        <Link key={index} href={`/participant/${participant.id}`}>
                                            <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 8, marginLeft: 32}}>
                                                <Avatar.Icon
                                                    size={40}
                                                    icon="account"
                                                    style={{backgroundColor: theme.colors.primaryContainer}}
                                                />
                                                <View style={{marginLeft: 12, flex: 1}}>
                                                    <Text variant="bodyMedium" style={{fontWeight: '600'}}>
                                                        {participant.firstName} {participant.lastName}, {participant.age} ans
                                                    </Text>
                                                    <Text variant="bodySmall" style={{color: theme.colors.onSurfaceVariant}}>
                                                        {participant.instruments?.join(', ') || 'Aucun instrument spécifié'}
                                                    </Text>
                                                </View>
                                                {participant.id === jamSession.createdBy && (
                                                    <Chip mode="outlined" compact>
                                                        Organisateur
                                                    </Chip>
                                                )}
                                            </View>
                                            {index < jamSession.participants.length - 1 && <Divider style={{marginLeft: 32}} />}
                                        </Link>
                                    ))}
                                </ScrollView>
                            ) : (
                                <Text variant="bodyMedium" style={{marginLeft: 32, color: theme.colors.onSurfaceVariant}}>
                                    Aucun participant pour le moment
                                </Text>
                            )}
                        </Card.Content>
                    </Card>

                    {/* Description Card */}
                    <Card style={{marginBottom: 16}}>
                        <Card.Content>
                            <Text variant="titleMedium" style={{marginBottom: 12}}>
                                Description
                            </Text>
                            <Text variant="bodyMedium" style={{lineHeight: 20}}>
                                {jamSession.description}
                            </Text>
                        </Card.Content>
                    </Card>

                    {/* Action Buttons */}
                    <View style={{flexDirection: 'row', gap: 12, marginBottom: 20}}>
                        {isUserParticipant ? (
                            <Button
                                mode="outlined"
                                onPress={handleLeaveJam}
                                loading={actionLoading}
                                disabled={actionLoading}
                                style={{flex: 1}}
                                contentStyle={{paddingVertical: 8}}
                                textColor={theme.colors.error}
                            >
                                Quitter la session
                            </Button>
                        ) : (
                            <Button
                                mode="contained"
                                onPress={handleJoinJam}
                                loading={actionLoading}
                                disabled={actionLoading}
                                style={{flex: 1}}
                                contentStyle={{paddingVertical: 8}}
                            >
                                Rejoindre la session
                            </Button>
                        )}

                        <IconButton
                            icon="share"
                            mode="outlined"
                            onPress={() => {
                                // TODO: Implement share functionality
                                Alert.alert('Partage', 'Fonctionnalité de partage à venir');
                            }}
                        />
                    </View>
                </ScrollView>
            </Surface>
        </>
    );
}