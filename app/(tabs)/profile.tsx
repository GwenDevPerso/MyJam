import JamItem from '@/components/JamItem';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {IconSymbol} from '@/components/ui/IconSymbol';
import {useAuth} from '@/contexts/AuthContext';
import {JamSession} from '@/definitions/types';
import {jamSessionService} from '@/lib/services/jam.service';
import {router, useFocusEffect} from 'expo-router';
import {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';

export default function ProfileScreen() {
  const {profile} = useAuth();
  const [jamsParticipated, setJamsParticipated] = useState<JamSession[]>([]);
  const [jamsCreated, setJamsCreated] = useState<JamSession[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!profile?.id) return;

      jamSessionService.getJamsParticipated(profile.id).then((jams) => {
        setJamsParticipated(jams);
      });
      jamSessionService.getJamsCreated(profile.id).then((jams) => {
        setJamsCreated(jams);
      });
    }, [profile?.id])
  );

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
        <View style={styles.editButtonContainer}>
          <ThemedText type="title" style={styles.userName}>
            {profile?.firstName} {profile?.lastName}
          </ThemedText>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEdit}
          >
            <IconSymbol size={28} name="pencil" color="#4A90E2" />
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.userId}>ID: {profile?.id}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        <View style={styles.row}>
          {renderInfoCard("Âge", `${profile?.age} ans`)}
          {renderInfoCard("Ville", profile?.city || '')}
        </View>

        <ThemedText type="defaultSemiBold" style={styles.infoTitle}>Instruments</ThemedText>
        {renderInstrumentsList(profile?.instruments || [])}
        <ThemedText type="defaultSemiBold" style={styles.infoTitle}>Jams Participées</ThemedText>
        <ScrollView style={styles.jamList} contentContainerStyle={styles.jamListContent} showsVerticalScrollIndicator={false}>
          {jamsParticipated.map((jam) => (
            <JamItem key={jam.id} jam={jam} />
          ))}
          {jamsParticipated.length === 0 && <ThemedText>Aucune jam participée</ThemedText>}
        </ScrollView>
        <ThemedText type="defaultSemiBold" style={styles.infoTitle}>Jams Organisées</ThemedText>
        <ScrollView style={styles.jamList} contentContainerStyle={styles.jamListContent} showsVerticalScrollIndicator={false}>
          {jamsCreated.map((jam) => (
            <JamItem key={jam.id} jam={jam} />
          ))}
          {jamsCreated.length === 0 && <ThemedText>Aucune jam organisée</ThemedText>}
        </ScrollView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  //#region Header
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  profileIcon: {
    marginBottom: 16,
  },
  userName: {
    textAlign: 'center',
  },
  userId: {
    opacity: 0.7,
    fontSize: 14,
  },
  editButton: {
    marginLeft: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: 40,
    height: 40,
  },
  editButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  //#endregion
  //#region Content
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
  //#endregion
});
