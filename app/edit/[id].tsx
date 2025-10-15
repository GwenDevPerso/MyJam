import {Alert} from 'react-native';
import {Surface, Text} from 'react-native-paper';

import JamForm, {JamFormInputs} from '@/components/forms/JamForm';
import {JamSession} from '@/definitions/types';
import {JamSessionUpdate} from '@/lib/database.types';
import {jamSessionService} from '@/lib/services/jam.service';
import {router, Stack, useFocusEffect, useLocalSearchParams} from 'expo-router';
import {useCallback, useState} from 'react';

export default function EditScreen() {
    const {id} = useLocalSearchParams();
    const [jam, setJam] = useState<Partial<JamSession> | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const editJam = async (jamData: JamFormInputs) => {
        setLoading(true);
        try {
            const jamInput: JamSessionUpdate = {
                id: Number(id),
                name: jamData.name,
                date: jamData.date.toISOString(),
                city: jamData.city,
                location: jamData.location,
                description: jamData.description,
                style: jamData.style,
                latitude: jamData.latitude,
                longitude: jamData.longitude,
            };

            console.log('JAM INPUT', jamInput);

            await jamSessionService.update(Number(id), jamInput);

            Alert.alert(
                'Succès',
                'Session de jam mise à jour avec succès',
                [
                    {
                        text: 'OK',
                        onPress: () => router.navigate('/')
                    }
                ]
            );
        } catch (error) {
            console.error('Error updating jam session:', error);
            Alert.alert(
                'Erreur',
                'Impossible de mettre à jour la session. Veuillez vérifier les coordonnées et réessayer.',
                [{text: 'OK'}]
            );
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (id) {
                jamSessionService.getById(Number(id)).then((jam) => {
                    setJam(jam);
                    console.log('jam loaded for edit:', jam);
                }).catch((error) => {
                    console.error('Error loading jam for edit:', error);
                    Alert.alert(
                        'Erreur',
                        'Impossible de charger la session de jam',
                        [
                            {
                                text: 'OK',
                                onPress: () => router.back()
                            }
                        ]
                    );
                });
            }
        }, [id])
    );

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Modifier la session',
                    headerShown: true,
                    headerBackTitle: 'Retour',
                    headerBackVisible: true,
                }}
            />
            <Surface style={{flex: 1, paddingTop: 20}}>
                <Text variant="titleLarge" style={{textAlign: 'center', marginBottom: 20, paddingHorizontal: 20}}>
                    Modifier la session de jam
                </Text>
                <JamForm
                    initialData={jam}
                    onSubmit={(jam: JamFormInputs) => editJam(jam)}
                    isLoading={loading}
                />
            </Surface>
        </>
    );
}