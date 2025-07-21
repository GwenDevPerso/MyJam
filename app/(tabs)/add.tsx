import {StyleSheet, Text} from 'react-native';

import JamForm, {JamFormInputs} from '@/components/JamForm';
import {ThemedView} from '@/components/ThemedView';
import {JamSessionInsert} from '@/lib/database.types';
import {jamSessionService} from '@/lib/services/jam.service';
import {router} from 'expo-router';

export default function AddScreen() {

    const createJam = (jamData: JamFormInputs) => {
        // TODO: get latitude and longitude from location ad city
        const jamInput: JamSessionInsert = {
            name: jamData.name,
            date: jamData.date.toISOString(),
            city: jamData.city,
            location: jamData.location,
            description: jamData.description,
            style: jamData.style,
            latitude: 0,
            longitude: 0,
        };
        jamSessionService.create(jamInput);
        router.navigate('/');
    };

    return (
        <ThemedView style={styles.container}>
            <Text style={styles.title}>Create New Jam Session</Text>
            <JamForm onSubmit={(jam: JamFormInputs) => createJam(jam)} />
        </ThemedView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'rgb(21, 23, 24)',
        paddingVertical: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
        textAlign: 'center',
    },

});
