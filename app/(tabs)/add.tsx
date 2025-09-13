import {Alert} from 'react-native';
import {Surface, Title} from 'react-native-paper';

import JamForm, {JamFormInputs} from '@/components/forms/JamForm';
import {JamSessionInsert} from '@/lib/database.types';
import {LocationHelper} from '@/lib/helpers/location.helper';
import {jamSessionService} from '@/lib/services/jam.service';
import {router} from 'expo-router';

export default function AddScreen() {

    const createJam = async (jamData: JamFormInputs) => {
        try {
            const coordinates = await LocationHelper.getCoordinatesFromAddress(jamData.location);
            const address = await LocationHelper.getAddressFromCoordinates(coordinates.latitude, coordinates.longitude);

            const jamInput: JamSessionInsert = {
                name: jamData.name,
                date: jamData.date.toISOString(),
                city: address.city || 'Unknown',
                location: jamData.location,
                description: jamData.description,
                style: jamData.style,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
            };

            console.log('jamInput', jamInput);

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
            <Title style={{textAlign: 'center', marginBottom: 20, paddingHorizontal: 20}}>
                Create New Jam Session
            </Title>
            <JamForm onSubmit={(jam: JamFormInputs) => createJam(jam)} />
        </Surface>
    );
}
