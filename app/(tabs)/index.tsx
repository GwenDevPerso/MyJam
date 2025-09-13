import {ScrollView, StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Surface,
  Text,
  Title,
  useTheme
} from 'react-native-paper';

import {HelloWave} from '@/components/HelloWave';
import JamItem from '@/components/JamItem';
import Map, {MarkerType} from '@/components/Map';
import {useAuth} from '@/contexts/AuthContext';
import {useLocation} from '@/contexts/LocationContext';
import {JamSession} from '@/definitions/types';
import {jamSessionService} from '@/lib/services/jam.service';
import {useFocusEffect} from '@react-navigation/native';
import {router} from 'expo-router';
import {useCallback, useState} from 'react';

export default function HomeScreen() {
  const [userJams, setUserJams] = useState<JamSession[]>([]);
  const [jamMarkers, setJamMarkers] = useState<MarkerType[]>([]);
  const [loading, setLoading] = useState(true);
  const {profile} = useAuth();
  const {location} = useLocation();
  const theme = useTheme();

  const getMarkerFromJams = useCallback((jams: JamSession[]) => {
    const newMarkers: MarkerType[] = jams.map(jam => ({
      id: jam.id,
      latitude: jam.latitude,
      longitude: jam.longitude,
      title: jam.name,
      description: jam.description,
      date: jam.date.toISOString(),
      location: jam.location,
    }));


    // Utiliser une fonction de callback pour éviter les doublons
    setJamMarkers(prevMarkers => {
      const existingIds = prevMarkers.map(marker => marker.id);
      const uniqueNewMarkers = newMarkers.filter(marker => !existingIds.includes(marker.id));
      return [...prevMarkers, ...uniqueNewMarkers];
    });
  }, []);


  const getJamsByLocation = useCallback(() => {

    if (!location?.coords) {
      console.log('No location available yet, skipping jam search');
      return;
    }

    const {latitude, longitude} = location.coords;

    jamSessionService.getNearbyJams(latitude, longitude).then((jams) => {
      getMarkerFromJams(jams);
    }).catch((error) => {
      console.error('Error fetching nearby jams:', error);
    });
  }, [location?.coords, getMarkerFromJams]);

  useFocusEffect(
    useCallback(() => {
      if (!profile?.id) return;

      setLoading(true);
      jamSessionService.getUserNextJams(profile.id).then((jams) => {
        setUserJams(jams);
        setLoading(false);
      }).catch((error) => {
        console.error('Error fetching user next jams:', error);
        setLoading(false);
      });

      // Seulement chercher les jams si on a la location
      if (location?.coords) {
        getJamsByLocation();
      }

    }, [profile?.id, location, getJamsByLocation])
  );




  return (
    <ScrollView style={{flex: 1}}>
      <Map onLocationChange={getJamsByLocation} markers={jamMarkers} />

      <View style={{flex: 1, padding: 20}}>
        <Surface style={{marginBottom: 16, borderRadius: 12}}>
          <View style={{position: 'absolute', top: 8, right: 8, backgroundColor: theme.colors.surfaceVariant, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4}}>
            <Text variant="bodySmall" style={{color: theme.colors.onSurfaceVariant}}>
              {jamMarkers.length} markers
            </Text>
          </View>
        </Surface>

        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16}}>
          <Title>Welcome to My Jam !</Title>
          <HelloWave />
        </View>

        <Card style={{marginBottom: 16, padding: 16}}>
          <Text variant="titleMedium" style={{marginBottom: 8}}>
            Find your next jam session with My Jam !
          </Text>
          <Button
            mode="contained"
            onPress={() => router.push('/all-jams')}
            style={{marginTop: 8}}
          >
            All Jams
          </Button>
        </Card>

        <Card style={{padding: 16}}>
          <Text variant="titleMedium" style={{marginBottom: 16}}>
            Your next jam sessions
          </Text>
          <ScrollView
            style={{maxHeight: 400}}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <View style={{alignItems: 'center', padding: 20}}>
                <ActivityIndicator size="large" />
                <Text variant="bodyMedium" style={{marginTop: 8}}>Loading...</Text>
              </View>
            ) : (
              userJams.length > 0 ? userJams.map((jam) => (
                <JamItem key={jam.id} jam={jam} />
              )) : (
                <View style={{alignItems: 'center', padding: 20}}>
                  <Text variant="bodyMedium" style={{color: theme.colors.onSurfaceVariant}}>
                    Vous n&apos;avez pas de jam session à venir
                  </Text>
                </View>
              )
            )}
          </ScrollView>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
