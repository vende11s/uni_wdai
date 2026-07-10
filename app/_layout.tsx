import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { PokemonProvider } from '@/context/PokemonContext';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Importujemy z expo-font i konkretnych paczek Google Fonts
import { useFonts } from 'expo-font';
import {
  Nunito_900Black
} from '@expo-google-fonts/nunito';
import {
  Inter_400Regular,
  Inter_700Bold,
  Inter_900Black,
} from '@expo-google-fonts/inter';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Nunito-900': Nunito_900Black,

    'Inter-400': Inter_400Regular,
    'Inter-700': Inter_700Bold,
    'Inter-900': Inter_900Black,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PokemonProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="dark" />
      </PokemonProvider>
    </GestureHandlerRootView>
  );
}
