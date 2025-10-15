import JamItem from '@/components/JamItem';
import {useAuth} from '@/contexts/AuthContext';
import {JamSession} from '@/definitions/types';
import {jamSessionService} from '@/lib/services/jam.service';
import {router, useFocusEffect} from 'expo-router';
import {useCallback, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Chip,
  IconButton,
  Surface,
  Text,
  useTheme
} from 'react-native-paper';

export default function ProfileScreen() {
  const {profile, signOut} = useAuth();
  const [jamsParticipated, setJamsParticipated] = useState<JamSession[]>([]);
  const [jamsCreated, setJamsCreated] = useState<JamSession[]>([]);
  const theme = useTheme();

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

  const handleEdit = () => {
    router.push('/edit-profile');
  };

  return (
    <Surface style={{flex: 1, marginBottom: 50}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{padding: 20}}>
        {/* Header */}
        <Card style={{padding: 20, marginBottom: 16, alignItems: 'center'}}>
          <Avatar.Icon
            size={80}
            icon="account"
            style={{backgroundColor: theme.colors.primary, marginBottom: 16}}
          />
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <Text variant="titleMedium" style={{textAlign: 'center'}}>
              {profile?.firstName} {profile?.lastName}
            </Text>
            <IconButton
              icon="pencil"
              size={20}
              onPress={handleEdit}
              mode="contained-tonal"
            />
          </View>
          <Text variant="bodySmall" style={{color: theme.colors.onSurfaceVariant}}>
            ID: {profile?.id}
          </Text>
        </Card>

        {/* Info Cards */}
        <View style={{flexDirection: 'row', gap: 12, marginBottom: 16}}>
          <Card style={{flex: 1, padding: 16}}>
            <Text variant="titleSmall" style={{marginBottom: 4}}>Âge</Text>
            <Text variant="bodyLarge" style={{fontWeight: '600'}}>
              {profile?.age} ans
            </Text>
          </Card>
          <Card style={{flex: 1, padding: 16}}>
            <Text variant="titleSmall" style={{marginBottom: 4}}>Ville</Text>
            <Text variant="bodyLarge" style={{fontWeight: '600'}}>
              {profile?.city || ''}
            </Text>
          </Card>
        </View>

        {/* Instruments */}
        <Card style={{padding: 16, marginBottom: 16}}>
          <Text variant="titleMedium" style={{marginBottom: 12}}>Instruments</Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
            {profile?.instruments?.map((instrument, index) => (
              <Chip key={index} mode="flat">
                {instrument}
              </Chip>
            )) || <Text variant="bodyMedium">Aucun instrument</Text>}
          </View>
        </Card>

        {/* Jams Participées */}
        <Card style={{padding: 16, marginBottom: 16}}>
          <Text variant="titleMedium" style={{marginBottom: 12}}>Jams Participées</Text>
          <ScrollView style={{maxHeight: 300}} showsVerticalScrollIndicator={false}>
            {jamsParticipated.length > 0 ?
              jamsParticipated.map((jam) => (
                <JamItem key={jam.id} jam={jam} />
              )) : (
                <Text variant="bodyMedium" style={{color: theme.colors.onSurfaceVariant, textAlign: 'center', padding: 20}}>
                  Aucune jam participée
                </Text>
              )
            }
          </ScrollView>
        </Card>

        {/* Jams Organisées */}
        <Card style={{padding: 16, marginBottom: 16}}>
          <Text variant="titleMedium" style={{marginBottom: 12}}>Jams Organisées</Text>
          <ScrollView style={{maxHeight: 300}} showsVerticalScrollIndicator={false}>
            {jamsCreated.length > 0 ?
              jamsCreated.map((jam) => (
                <JamItem key={jam.id} jam={jam} />
              )) : (
                <Text variant="bodyMedium" style={{color: theme.colors.onSurfaceVariant, textAlign: 'center', padding: 20}}>
                  Aucune jam organisée
                </Text>
              )
            }
          </ScrollView>
        </Card>

        {/* Sign Out Button */}
        <Button
          mode="outlined"
          onPress={signOut}
          style={{marginTop: 20, marginBottom: 40}}
          textColor={theme.colors.error}
        >
          Déconnexion
        </Button>
      </ScrollView>
    </Surface>
  );
}
