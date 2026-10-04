import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Spinner } from 'heroui-native';
import { router } from 'expo-router';
import { i18n } from '@/i18n';

const SESSION_TIMEOUT_MS = 5000;

// Gives Expo Router a route to resolve before useDeepLink reads the tokens; without it the link lands on +not-found.
export default function EmailConfirmedScreen() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/'), SESSION_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="bg-background pt-safe flex-1">
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Spinner />
        <Text testID="auth-confirmed-message" className="text-muted text-center text-[15px]">
          {i18n.t('auth.confirming_email')}
        </Text>
      </View>
    </View>
  );
}
