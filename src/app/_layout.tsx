import '../global.css';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaListener, SafeAreaProvider } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';
import { HeroUINativeProvider } from 'heroui-native';
import {
  useFonts,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from '@expo-google-fonts/geist';
import { InstrumentSerif_400Regular } from '@expo-google-fonts/instrument-serif';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { SessionProvider } from '@/provider/SessionProvider';
import { ThemeProvider } from '@/provider/ThemeProvider';
import { useDeepLink } from '@/hooks/useDeepLink';
import { useSession } from '@/hooks/useSession';
import '../i18n';

export { ErrorBoundary } from 'expo-router';

void SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  // Below the QueryClient and session providers on purpose: this hook needs both.
  // It is what turns the links in confirmation and password-reset mail into a
  // session, so without it those two flows appear to do nothing.
  useDeepLink();
  const { session, initialized } = useSession();
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    InstrumentSerif_400Regular,
  });

  // Held until both are ready, so the first frame is the app rather than
  // unstyled text on a white screen.
  useEffect(() => {
    if (initialized && fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [initialized, fontsLoaded]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(public)" />
      </Stack.Protected>
      <Stack.Screen name="update-password" />
      <Stack.Screen name="auth/confirmed" />
    </Stack>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaListener onChange={({ insets }) => Uniwind.updateInsets(insets)}>
          <SessionProvider>
            <QueryClientProvider client={queryClient}>
              <KeyboardProvider>
                <ThemeProvider>
                  <HeroUINativeProvider>
                    <RootNavigator />
                  </HeroUINativeProvider>
                </ThemeProvider>
              </KeyboardProvider>
            </QueryClientProvider>
          </SessionProvider>
        </SafeAreaListener>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
