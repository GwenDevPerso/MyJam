import {useAuth} from '@/contexts/AuthContext';
import {Instrument} from '@/definitions/types/user.types';
import {ProfileUpdate} from '@/lib/database.types';
import {profileService} from '@/lib/services/profile.service';
import {router, Stack} from 'expo-router';
import React, {useState} from 'react';
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {Alert, ScrollView, View} from 'react-native';
import {
    Button,
    Card,
    Chip,
    HelperText,
    TextInput as PaperTextInput,
    Surface,
    Text,
    useTheme
} from 'react-native-paper';

type ProfileInputs = {
    firstName: string;
    lastName: string;
    age: number;
    city: string;
    instruments: string[];
};

export default function EditProfileScreen() {
    const {profile, refreshProfile} = useAuth();
    const theme = useTheme();
    const [selectedInstruments, setSelectedInstruments] = useState<string[]>(profile?.instruments || []);
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<ProfileInputs>({
        defaultValues: {
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            age: profile?.age || 0,
            city: profile?.city || '',
            instruments: profile?.instruments || [],
        }
    });

    const toggleInstrument = (instrument: string) => {
        setSelectedInstruments(prev => {
            if (prev.includes(instrument)) {
                return prev.filter(i => i !== instrument);
            } else {
                return [...prev, instrument];
            }
        });
    };

    const onSubmit: SubmitHandler<ProfileInputs> = async (data: ProfileInputs) => {
        if (!profile) {
            Alert.alert('Erreur', 'Profil non trouvé');
            return;
        }

        setLoading(true);
        try {
            const updates: ProfileUpdate = {
                id: profile.id,
                first_name: data.firstName,
                last_name: data.lastName,
                age: data.age,
                city: data.city,
                instruments: selectedInstruments,
            };

            await profileService.updateProfile(profile.id, updates);
            await refreshProfile();

            Alert.alert(
                'Succès',
                'Profil mis à jour avec succès',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert(
                'Erreur',
                'Impossible de mettre à jour le profil. Veuillez réessayer.',
                [{text: 'OK'}]
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    const instrumentsArray = Object.values(Instrument);

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
            <Surface style={{flex: 1, }}>
                <ScrollView
                    style={{flex: 1}}
                    contentContainerStyle={{padding: 20}}
                    showsVerticalScrollIndicator={false}
                >
                    <Card style={{padding: 20}}>
                        {/* Prénom */}
                        <View style={{marginBottom: 16}}>
                            <Controller
                                control={control}
                                rules={{
                                    required: 'Prénom requis',
                                    minLength: {value: 2, message: 'Le prénom doit contenir au moins 2 caractères'}
                                }}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <PaperTextInput
                                        mode="outlined"
                                        label="Prénom *"
                                        placeholder="Entrez votre prénom"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        error={!!errors.firstName}
                                        left={<PaperTextInput.Icon icon="account-outline" />}
                                    />
                                )}
                                name="firstName"
                            />
                            <HelperText type="error" visible={!!errors.firstName}>
                                {errors.firstName?.message}
                            </HelperText>
                        </View>

                        {/* Nom */}
                        <View style={{marginBottom: 16}}>
                            <Controller
                                control={control}
                                rules={{
                                    required: 'Nom requis',
                                    minLength: {value: 2, message: 'Le nom doit contenir au moins 2 caractères'}
                                }}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <PaperTextInput
                                        mode="outlined"
                                        label="Nom *"
                                        placeholder="Entrez votre nom"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        error={!!errors.lastName}
                                        left={<PaperTextInput.Icon icon="account-outline" />}
                                    />
                                )}
                                name="lastName"
                            />
                            <HelperText type="error" visible={!!errors.lastName}>
                                {errors.lastName?.message}
                            </HelperText>
                        </View>

                        {/* Âge et Ville */}
                        <View style={{flexDirection: 'row', gap: 12, marginBottom: 16}}>
                            <View style={{flex: 1}}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: 'Âge requis',
                                        min: {value: 13, message: 'Âge minimum 13 ans'},
                                        max: {value: 120, message: 'Âge maximum 120 ans'}
                                    }}
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <PaperTextInput
                                            mode="outlined"
                                            label="Âge *"
                                            placeholder="25"
                                            value={value?.toString() || ''}
                                            onChangeText={(text) => onChange(parseInt(text) || 0)}
                                            onBlur={onBlur}
                                            keyboardType="numeric"
                                            maxLength={3}
                                            error={!!errors.age}
                                            left={<PaperTextInput.Icon icon="calendar-outline" />}
                                        />
                                    )}
                                    name="age"
                                />
                                <HelperText type="error" visible={!!errors.age}>
                                    {errors.age?.message}
                                </HelperText>
                            </View>

                            <View style={{flex: 1}}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: 'Ville requise',
                                        minLength: {value: 2, message: 'La ville doit contenir au moins 2 caractères'}
                                    }}
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <PaperTextInput
                                            mode="outlined"
                                            label="Ville *"
                                            placeholder="Votre ville"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            autoCapitalize="words"
                                            error={!!errors.city}
                                            left={<PaperTextInput.Icon icon="map-marker-outline" />}
                                        />
                                    )}
                                    name="city"
                                />
                                <HelperText type="error" visible={!!errors.city}>
                                    {errors.city?.message}
                                </HelperText>
                            </View>
                        </View>

                        {/* Instruments */}
                        <View style={{marginBottom: 24}}>
                            <Text variant="bodyMedium" style={{marginBottom: 8, fontWeight: '600'}}>
                                Instruments (Optionnel)
                            </Text>
                            <Text variant="bodySmall" style={{color: theme.colors.onSurfaceVariant, marginBottom: 12}}>
                                Sélectionnez les instruments que vous jouez
                            </Text>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
                                {instrumentsArray.map((instrument) => (
                                    <Chip
                                        key={instrument}
                                        selected={selectedInstruments.includes(instrument)}
                                        onPress={() => toggleInstrument(instrument)}
                                        mode={selectedInstruments.includes(instrument) ? 'flat' : 'outlined'}
                                    >
                                        {instrument}
                                    </Chip>
                                ))}
                            </View>
                        </View>

                        {/* Boutons */}
                        <View style={{flexDirection: 'row', gap: 12, marginTop: 20}}>
                            <Button
                                mode="outlined"
                                onPress={handleCancel}
                                style={{flex: 1}}
                                disabled={loading}
                            >
                                Annuler
                            </Button>
                            <Button
                                mode="contained"
                                onPress={handleSubmit(onSubmit)}
                                loading={loading}
                                disabled={loading}
                                style={{flex: 1}}
                                contentStyle={{paddingVertical: 8}}
                            >
                                Sauvegarder
                            </Button>
                        </View>
                    </Card>
                </ScrollView>
            </Surface>
        </>
    );
}