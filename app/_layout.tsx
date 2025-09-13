import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {MD3DarkTheme, MD3LightTheme, PaperProvider, adaptNavigationTheme} from 'react-native-paper';
import 'react-native-reanimated';

import {AuthProvider} from '@/contexts/AuthContext';
import {LocationProvider} from '@/contexts/LocationContext';
import {useColorScheme} from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const {LightTheme, DarkTheme: PaperDarkTheme} = adaptNavigationTheme({
    reactNavigationLight: DefaultTheme,
    reactNavigationDark: DarkTheme,
  });

  const paperTheme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
  const navigationTheme = colorScheme === 'dark' ? PaperDarkTheme : LightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <AuthProvider>
        <LocationProvider>
          <ThemeProvider value={navigationTheme}>
            <Stack>
              <Stack.Screen name="index" options={{headerShown: false}} />
              <Stack.Screen name="register" options={{headerShown: false}} />
              <Stack.Screen name="login" options={{headerShown: false}} />
              <Stack.Screen name="(tabs)" options={{headerShown: false}} />
              <Stack.Screen name="edit-profile" options={{headerShown: false}} />
              <Stack.Screen name="all-jams" options={{headerShown: false}} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </LocationProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
