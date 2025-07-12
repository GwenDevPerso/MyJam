import JamItem from '@/components/JamItem';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {IconSymbol} from '@/components/ui/IconSymbol';
import {profileMock} from '@/constants/mocks';
import {router} from 'expo-router';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';

export default function ProfileScreen() {
  const renderInfoCard = (title: string, content: string | number) => (
    <ThemedView style={styles.infoCard}>
      <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
        {title}
      </ThemedText>
      <ThemedText style={styles.infoContent}>{content}</ThemedText>
    </ThemedView>
  );

  const renderInstrumentsList = (instruments: string[]) => (
    <ThemedView style={styles.instrumentCard}>
      <View style={styles.instrumentsContainer}>
        {instruments.map((instrument, index) => (
          <ThemedView key={index} style={styles.instrumentTag}>
            <ThemedText style={styles.instrumentText}>{instrument}</ThemedText>
          </ThemedView>
        ))}
      </View>
    </ThemedView>
  );

  const handleEdit = () => {
    console.log('Modifier');
    router.push('/edit-profile');
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <IconSymbol
          size={80}
          color="#4A90E2"
          name="person.fill"
          style={styles.profileIcon}
        />
        <ThemedText type="title" style={styles.userName}>
          {profileMock.firstName} {profileMock.lastName}
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEdit}
          >
            <IconSymbol size={28} name="edit" color="#4A90E2" />
          </TouchableOpacity>
        </ThemedText>
        <ThemedText style={styles.userId}>ID: {profileMock.id}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        <View style={styles.row}>
          {renderInfoCard("Âge", `${profileMock.age} ans`)}
          {renderInfoCard("Ville", profileMock.city)}
        </View>

        <ThemedText type="defaultSemiBold" style={styles.infoTitle}>Instruments</ThemedText>
        {renderInstrumentsList(profileMock.instruments)}
        <ThemedText type="defaultSemiBold" style={styles.infoTitle}>Jams Participées</ThemedText>
        <ScrollView style={styles.jamList} showsVerticalScrollIndicator={false}>
          {profileMock.jamsParticipated.map((jam) => (
            <JamItem key={jam.id} jam={jam} />
          ))}
        </ScrollView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  profileIcon: {
    marginBottom: 16,
  },
  userName: {
    marginBottom: 8,
    textAlign: 'center',
  },
  userId: {
    opacity: 0.7,
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  infoTitle: {
    marginBottom: 8,
    fontSize: 16,
  },
  infoContent: {
    fontSize: 18,
    fontWeight: '600',
  },
  instrumentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  instrumentCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  instrumentTag: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  instrumentText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
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
  editButton: {
    marginLeft: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    padding: 6
  }
});
