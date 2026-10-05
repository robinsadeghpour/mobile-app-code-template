import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Spinner } from 'heroui-native';
import { router } from 'expo-router';
import { ScreenLayout } from '@/components/ScreenLayout';
import { i18n } from '@/i18n';

const SESSION_TIMEOUT_MS = 5000;

// A landing route for the confirmation link while useDeepLink turns its tokens into a session;
// without it the link resolves to +not-found.
export default function EmailConfirmedScreen() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/'), SESSION_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenLayout>
      <View className="items-center gap-4">
        <Spinner />
        <Text testID="auth-confirmed-message" className="text-muted text-center text-[15px]">
          {i18n.t('auth.confirming_email')}
        </Text>
      </View>
    </ScreenLayout>
  );
}
