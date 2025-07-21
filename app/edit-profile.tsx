import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {useAuth} from '@/contexts/AuthContext';
import {ProfileUpdate} from '@/lib/database.types';
import {profileService} from '@/lib/services/profile.service';
import {router, Stack} from 'expo-router';
import React from 'react';
import {Controller, SubmitHandler, useForm} from "react-hook-form";

import {
    Alert,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

type ProfileInputs = {
    firstName: string;
    lastName: string;
    age: number;
    city: string;
    instruments: string;
};

export default function EditProfileScreen() {
    const {profile, refreshProfile} = useAuth();
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<ProfileInputs>({
        defaultValues: {
            firstName: profile?.firstName,
            lastName: profile?.lastName,
            age: profile?.age,
            city: profile?.city,
            instruments: profile?.instruments?.join(','),
        }
    });

    const onSubmit: SubmitHandler<ProfileInputs> = async (data: ProfileInputs) => {

        if (!profile) {
            Alert.alert('Erreur', 'Profil non trouvé');
            return;
        }

        const updates: ProfileUpdate = {
            id: profile.id,
            first_name: data.firstName,
            last_name: data.lastName,
            age: data.age,
            city: data.city,
            instruments: data.instruments.split(',').map(i => i.trim().toLocaleLowerCase()),
        };
        await profileService.updateProfile(profile.id, updates);
        await refreshProfile(); // Refresh the profile in the context
        router.back();
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Modifier le profil',
                    headerShown: true,
                    headerBackTitle: 'Retour',
                    headerBackVisible: true,
                }}
            />
            <ThemedView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.inputGroup}>
                        <ThemedText type="defaultSemiBold" style={styles.label}>
                            Prénom *
                        </ThemedText>
                        <Controller
                            control={control}
                            rules={{required: true}}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Entrez votre prénom"
                                    placeholderTextColor="#666"
                                />
                            )}
                            name="firstName"
                        />
                        {errors.firstName && <ThemedText style={styles.errorText}>Ce champ est requis</ThemedText>}
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText type="defaultSemiBold" style={styles.label}>
                            Nom *
                        </ThemedText>
                        <Controller
                            control={control}
                            rules={{required: true}}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Entrez votre nom"
                                    placeholderTextColor="#666"
                                />
                            )}
                            name="lastName"
                        />
                        {errors.lastName && <ThemedText style={styles.errorText}>Ce champ est requis</ThemedText>}
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText type="defaultSemiBold" style={styles.label}>
                            Âge *
                        </ThemedText>
                        <Controller
                            control={control}
                            rules={{required: true}}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value.toString()}
                                    placeholder="Entrez votre âge"
                                    placeholderTextColor="#666"
                                    keyboardType="numeric"
                                />
                            )}
                            name="age"
                        />
                        {errors.age && <ThemedText style={styles.errorText}>Ce champ est requis</ThemedText>}
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText type="defaultSemiBold" style={styles.label}>
                            Ville *
                        </ThemedText>
                        <Controller
                            control={control}
                            rules={{required: true}}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Entrez votre ville"
                                    placeholderTextColor="#666"
                                />
                            )}
                            name="city"
                        />
                        {errors.city && <ThemedText style={styles.errorText}>Ce champ est requis</ThemedText>}
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText type="defaultSemiBold" style={styles.label}>
                            Instruments
                        </ThemedText>
                        <ThemedText style={styles.helper}>
                            Séparez les instruments par des virgules
                        </ThemedText>
                        <Controller
                            control={control}
                            rules={{required: false}}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Ex: Guitare, Piano, Basse"
                                    placeholderTextColor="#666"
                                    multiline
                                    numberOfLines={3}
                                />
                            )}
                            name="instruments"
                        />
                    </View>

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                            <ThemedText style={styles.cancelButtonText}>Annuler</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveButtonLarge} onPress={handleSubmit(onSubmit)}>
                            <ThemedText style={styles.saveButtonText}>Sauvegarder</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgb(21, 23, 24)',
    },
    content: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
    },
    saveButton: {
        padding: 8,
    },

    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#fff',
    },
    helper: {
        fontSize: 12,
        opacity: 0.7,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: '#fff',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 12,
        marginTop: 4,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 32,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#666',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#666',
    },
    saveButtonLarge: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: '#4A90E2',
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    saveButtonHeaderText: {
        fontSize: 16,
        color: '#4A90E2',
        fontWeight: '600',
    },
    placeholder: {
        width: 40,
    },
}); 