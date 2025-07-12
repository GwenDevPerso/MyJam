import {Image} from 'expo-image';
import {ScrollView, StyleSheet, View} from 'react-native';

import {HelloWave} from '@/components/HelloWave';
import JamItem from '@/components/JamItem';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {jamListMock} from '@/constants/mocks';

export default function HomeScreen() {
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
        {/* <Map /> */}
      </View>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to My Jam !</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">
          Find your next jam session with My Jam !
        </ThemedText>
        <ScrollView style={styles.jamList} showsVerticalScrollIndicator={false}>
          {jamListMock.map((jam) => (
            <JamItem key={jam.id} jam={jam} />
          ))}
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
    gap: 8,
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
    maxHeight: 500,
  },
});
