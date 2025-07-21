import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {IconSymbol} from '@/components/ui/IconSymbol';
import {useAuth} from '@/contexts/AuthContext';
import {JamSession} from '@/definitions/types';
import {jamSessionService} from '@/lib/services/jam.service';
import {Stack, router, useLocalSearchParams} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

export default function JamDetailScreen() {
    const {profile} = useAuth();
    const {id} = useLocalSearchParams<{id: string;}>();
    const [jamSession, setJamSession] = useState<JamSession | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        jamSessionService.getByIdWithParticipants(parseInt(id || '1')).then((jam) => {
            setJamSession(jam);
            setLoading(false);
        });
    }, [profile, id]);

    if (loading) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ThemedText type="subtitle">Loading...</ThemedText>
            </ThemedView>
        );
    }

    // Fallback if jam not found
    if (!jamSession) {
        return (
            <>
                <Stack.Screen options={{title: 'Session introuvable'}} />
                <ThemedView style={styles.container}>
                    <View style={styles.errorContainer}>
                        <ThemedText type="title" style={styles.errorTitle}>
                            Session introuvable
                        </ThemedText>
                        <ThemedText style={styles.errorText}>
                            La session de jam que vous recherchez n&apos;existe pas.
                        </ThemedText>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <ThemedText style={styles.backButtonText}>Retour</ThemedText>
                        </TouchableOpacity>
                    </View>
                </ThemedView>
            </>
        );
    }



    const handleJoinJam = async () => {
        if (!profile) {
            Alert.alert('Erreur', 'Vous devez être connecté pour rejoindre une session');
            return;
        }

        await jamSessionService.joinJam(jamSession.id, profile.id);

        router.back();
    };

    const handleLeaveJam = async () => {
        if (!profile) {
            Alert.alert('Erreur', 'Vous devez être connecté pour quitter une session');
            return;
        }

        await jamSessionService.leaveJam(jamSession.id, profile.id);

        router.back();

        Alert.alert('Succès', 'Vous avez quitté la session !');
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
        Alert.alert('Supprimer la session', 'Voulez-vous vraiment supprimer cette session ?', [
            {text: 'Annuler', style: 'cancel'},
            {
                text: 'Supprimer', style: 'destructive', onPress: async () => {
                    await jamSessionService.delete(jamSession.id);
                    router.back();
                }
            },
        ]);
    };

    const editJam = async () => {
        console.log('editJam');
        // router.push(`/edit-jam/${jamSession.id}`);
    };

    return (
        <>
            <Stack.Screen options={{title: 'Détail de la session'}} />
            <ScrollView style={styles.container}>
                <ThemedView style={styles.content}>
                    {/* Header Section */}
                    <View style={styles.header}>
                        {profile?.id === jamSession.createdBy && (
                            <View style={styles.creatorButtonContainer}>
                                <TouchableOpacity style={styles.headerButton} onPress={deleteJam}>
                                    <IconSymbol size={20} name="trash" color="#4A90E2" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.headerButton} onPress={editJam}>
                                    <IconSymbol size={20} name="pencil" color="#4A90E2" />
                                </TouchableOpacity>
                            </View>
                        )}
                        <View style={styles.styleTag}>
                            <ThemedText style={styles.styleTagText}>{jamSession.style}</ThemedText>
                        </View>
                        <ThemedText type="title" style={styles.jamName}>
                            {jamSession.name}
                        </ThemedText>


                    </View>

                    {/* Date & Time */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <IconSymbol size={20} name="email" color="#4A90E2" />
                            <View style={styles.infoContent}>
                                <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
                                    Date & Heure
                                </ThemedText>
                                <ThemedText style={styles.infoValue}>
                                    {formatDate(new Date(jamSession.date))}
                                </ThemedText>
                                <ThemedText style={styles.infoValue}>
                                    {formatTime(new Date(jamSession.date))}
                                </ThemedText>
                            </View>
                        </View>
                    </View>

                    {/* Location */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <IconSymbol size={20} name="house.fill" color="#4A90E2" />
                            <View style={styles.infoContent}>
                                <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
                                    Lieu
                                </ThemedText>
                                <ThemedText style={styles.infoValue}>
                                    {jamSession.location}
                                </ThemedText>
                                <ThemedText style={styles.infoValue}>
                                    {jamSession.city}
                                </ThemedText>
                            </View>
                        </View>
                    </View>

                    {/* Participants */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <IconSymbol size={20} name="person.fill" color="#4A90E2" />
                            <View style={styles.infoContent}>
                                <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
                                    Participants
                                </ThemedText>
                                <ThemedText style={styles.infoValue}>
                                    {jamSession.participants.length ?? 0} musiciens attendus
                                </ThemedText>
                                <ScrollView style={styles.participantsList} >
                                    {jamSession.participants.map((participant, index) => (
                                        <View style={styles.participantItem} key={index}>
                                            <ThemedText style={styles.participantName}>{participant.firstName} {participant.lastName}, {participant.age}</ThemedText>
                                            <ThemedText style={styles.participantInstruments}>{participant.instruments?.join(', ')}</ThemedText>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.descriptionCard}>
                        <ThemedText type="defaultSemiBold" style={styles.descriptionTitle}>
                            Description
                        </ThemedText>
                        <ThemedText style={styles.descriptionText}>
                            {jamSession.description}
                        </ThemedText>
                    </View>

                    {/* Host Info */}
                    <View style={styles.hostCard}>
                        <ThemedText type="defaultSemiBold" style={styles.hostTitle}>
                            Organisateur
                        </ThemedText>
                        <View style={styles.hostInfo}>
                            <IconSymbol size={40} name="person.fill" color="#4A90E2" style={styles.hostAvatar} />
                            <View style={styles.hostDetails}>
                                <ThemedText type="defaultSemiBold" style={styles.hostName}>
                                    {profile?.firstName} {profile?.lastName}
                                </ThemedText>
                                <ThemedText style={styles.hostRole}>
                                    Organisateur.trice • {profile?.instruments?.join(', ')}
                                </ThemedText>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.buttonGroup}>
                        {jamSession.participants.some(p => p.id === profile?.id) ? (
                            <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveJam}>
                                <ThemedText style={styles.actionButtonText}>
                                    Quitter la session
                                </ThemedText>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.joinButton} onPress={handleJoinJam}>
                                <ThemedText style={styles.actionButtonText}>
                                    Rejoindre la session
                                </ThemedText>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={styles.shareButton}>
                            <IconSymbol size={20} name="paperplane.fill" color="#4A90E2" />
                            <ThemedText style={styles.shareButtonText}>Partager</ThemedText>
                        </TouchableOpacity>
                    </View>
                </ThemedView>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(21, 23, 24)',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        padding: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorTitle: {
        color: '#fff',
        marginBottom: 16,
        textAlign: 'center',
    },
    errorText: {
        color: '#ccc',
        marginBottom: 24,
        textAlign: 'center',
    },
    backButton: {
        backgroundColor: '#4A90E2',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    //#region Header
    header: {
        marginBottom: 24,
        alignItems: 'center',
    },
    headerButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    creatorButtonContainer: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'flex-end',
        width: '100%',
        marginBottom: 16,
    },
    styleTag: {
        backgroundColor: '#4A90E2',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 16,
    },
    styleTagText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    jamName: {
        textAlign: 'center',
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    //#endregion


    infoCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    infoContent: {
        marginLeft: 12,
        flex: 1,
    },
    infoTitle: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        color: '#ccc',
        marginBottom: 2,
    },
    descriptionCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    descriptionTitle: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 14,
        color: '#ccc',
        lineHeight: 20,
    },
    hostCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    hostTitle: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 12,
    },
    hostInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hostAvatar: {
        marginRight: 12,
    },
    hostDetails: {
        flex: 1,
    },
    hostName: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 4,
    },
    hostRole: {
        fontSize: 14,
        color: '#ccc',
    },
    //#region Buttons
    buttonGroup: {
        flexDirection: 'row',
        gap: 12,
    },
    joinButton: {
        flex: 1,
        backgroundColor: '#4A90E2',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 16,
        gap: 8,
    },
    shareButtonText: {
        color: '#4A90E2',
        fontSize: 16,
        fontWeight: '600',
    },
    leaveButton: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    //#endregion
    participantsList: {
        gap: 8,
        flex: 1,
        maxHeight: 150,
    },
    participantItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 8,
        borderRadius: 8,
        width: '100%',
        marginBottom: 8,
    },
    participantName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    participantInstruments: {
        color: '#ccc',
        fontSize: 12,
    },

}); 