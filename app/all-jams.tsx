import {ScrollView, StyleSheet, TextInput, View} from 'react-native';

import JamItem from '@/components/JamItem';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {JamSession} from '@/definitions/types';
import {jamSessionService} from '@/lib/services/jam.service';
import {Stack} from 'expo-router';
import {useEffect, useState} from 'react';

export default function AllJamScreen() {
    const [jams, setJams] = useState<JamSession[]>([]);
    const [filteredJams, setFilteredJams] = useState<JamSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        jamSessionService.getAllAvailableJams(new Date()).then((jams) => {
            setJams(jams);
            setFilteredJams(jams);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (searchQuery === '') {
            setFilteredJams(jams);
        } else {
            const filtered = jams.filter(jam =>
                jam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                jam.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                jam.style.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredJams(filtered);
        }
    }, [searchQuery, jams]);

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Toutes les Jams',
                    headerShown: true,
                    headerBackTitle: 'Retour',
                    headerBackVisible: true,
                }}
            />
            <View style={styles.container}>
                <ThemedView style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher par titre, ville ou style..."
                        placeholderTextColor="#666"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />

                </ThemedView>
                <ThemedText type="subtitle" style={styles.title}>
                    Trouve ta prochaine jam session avec My Jam !
                </ThemedText>
                <ScrollView
                    style={styles.jamList}
                    contentContainerStyle={styles.jamListContent}
                    showsVerticalScrollIndicator={false}
                >
                    {loading ? (
                        <ThemedText type="subtitle">Chargement...</ThemedText>
                    ) : filteredJams.length === 0 ? (
                        <ThemedText type="subtitle">Aucune jam trouvée</ThemedText>
                    ) : (
                        filteredJams.map((jam, index) => (
                            <JamItem key={jam.id} jam={jam} />
                        ))
                    )}
                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchContainer: {
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    searchInput: {
        padding: 12,
        fontSize: 16,
        color: '#fff',
        backgroundColor: 'transparent',
    },
    title: {
        marginBottom: 16,
    },
    jamList: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 16,
    },
    jamListContent: {
        gap: 16,
    },
});
