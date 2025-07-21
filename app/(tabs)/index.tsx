import {Image} from 'expo-image';
import {Button, ScrollView, StyleSheet, View} from 'react-native';

import {HelloWave} from '@/components/HelloWave';
import JamItem from '@/components/JamItem';
import Map, {MarkerType} from '@/components/Map';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
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

      getJamsByLocation();

    }, [profile?.id])
  );

  const getMarkerFromJams = (jams: JamSession[]) => {
    jams.forEach((jam) => {
      setJamMarkers([...jamMarkers, {
        id: jam.id,
        latitude: jam.latitude,
        longitude: jam.longitude,
        title: jam.name,
        description: jam.description,
      }]);
    });
  };

  const getJamsByLocation = () => {
    jamSessionService.getNearbyJams(location?.coords.latitude || 0, location?.coords.longitude || 0).then((jams) => {
      console.log('jams', jams);
      getMarkerFromJams(jams);
    });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{light: '#A1CEDC', dark: '#1D3D47'}}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <View>
        <Map onLocationChange={getJamsByLocation} markers={jamMarkers} />
      </View>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to My Jam !</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">
          Find your next jam session with My Jam !
        </ThemedText>
        <Button title="All Jam" onPress={() => router.push('/all-jams')} />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">
          Your next jam sessions
        </ThemedText>
        <ScrollView
          style={styles.jamList}
          contentContainerStyle={styles.jamListContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <ThemedText type="subtitle">Loading...</ThemedText>
          ) : (
            userJams.length > 0 ? userJams.map((jam) => (
              <JamItem key={jam.id} jam={jam} />
            )) : <ThemedText type="subtitle">Vous n&apos;avez pas de jam session à venir</ThemedText>
          )}
        </ScrollView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  jamList: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
    maxHeight: 500,
  },
  jamListContent: {
    gap: 16,
  },
});
