import {ScrollView, View} from 'react-native';
import {
    ActivityIndicator,
    Searchbar,
    Surface,
    Text,
    useTheme
} from 'react-native-paper';

import JamItem from '@/components/JamItem';
import {JamSession} from '@/definitions/types';
import {jamSessionService} from '@/lib/services/jam.service';
import {Stack} from 'expo-router';
import {useEffect, useState} from 'react';

export default function AllJamScreen() {
    const [jams, setJams] = useState<JamSession[]>([]);
    const [filteredJams, setFilteredJams] = useState<JamSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const theme = useTheme();

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
            <Surface style={{flex: 1, padding: 16}}>
                <Searchbar
                    placeholder="Rechercher par titre, ville ou style..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={{marginBottom: 16}}
                />

                <Text variant="titleMedium" style={{marginBottom: 16}}>
                    Trouve ta prochaine jam session avec My Jam !
                </Text>

                <ScrollView
                    style={{flex: 1}}
                    showsVerticalScrollIndicator={false}
                >
                    {loading ? (
                        <View style={{alignItems: 'center', padding: 40}}>
                            <ActivityIndicator size="large" />
                            <Text variant="bodyMedium" style={{marginTop: 16}}>Chargement...</Text>
                        </View>
                    ) : filteredJams.length === 0 ? (
                        <View style={{alignItems: 'center', padding: 40}}>
                            <Text variant="bodyMedium" style={{color: theme.colors.onSurfaceVariant}}>
                                Aucune jam trouvée
                            </Text>
                        </View>
                    ) : (
                        filteredJams.map((jam) => (
                            <JamItem key={jam.id} jam={jam} />
                        ))
                    )}
                </ScrollView>
            </Surface>
        </>
    );
}
