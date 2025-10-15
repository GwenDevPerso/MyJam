import {Alert} from 'react-native';
import {Surface, Text} from 'react-native-paper';

import JamForm, {JamFormInputs} from '@/components/forms/JamForm';
import {JamSessionInsert} from '@/lib/database.types';
import {jamSessionService} from '@/lib/services/jam.service';
import {router} from 'expo-router';

export default function AddScreen() {

    const createJam = async (jamData: JamFormInputs) => {
        try {
            if (!jamData.latitude || !jamData.longitude) {
                throw new Error('Latitude and longitude are required');
            }

            const jamInput: JamSessionInsert = {
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


            await jamSessionService.create(jamInput);
            router.navigate('/');
        } catch (error) {
            console.error('Error creating jam session:', error);
            Alert.alert(
                'Error',
                'Unable to get location coordinates. Please check the city and location fields and try again.',
                [{text: 'OK'}]
            );
        }
    };

    return (
        <Surface style={{flex: 1, paddingTop: 60}}>
            <Text variant="titleMedium" style={{textAlign: 'center', marginBottom: 20, paddingHorizontal: 20}}>
                Create New Jam Session
            </Text>
            <JamForm onSubmit={(jam: JamFormInputs) => createJam(jam)} />
        </Surface>
    );
}
