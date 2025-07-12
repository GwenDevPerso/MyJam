import {StyleSheet, Text} from 'react-native';

import JamForm from '@/components/JamForm';
import {ThemedView} from '@/components/ThemedView';
import {router} from 'expo-router';

export default function AddScreen() {
    return (
        <ThemedView style={styles.container}>
            <Text style={styles.title}>Create New Jam Session</Text>
            <JamForm onSubmit={() => {router.navigate('/');}} />
        </ThemedView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'rgb(21, 23, 24)',

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
        textAlign: 'center',
    },

});
