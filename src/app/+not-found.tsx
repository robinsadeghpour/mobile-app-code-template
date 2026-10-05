import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { ScreenLayout } from '@/components/ScreenLayout';
import { i18n } from '@/i18n';

export default function NotFoundScreen() {
  return (
    <ScreenLayout>
      <View className="items-center gap-4">
        <Text className="text-foreground font-serif text-[32px]">404</Text>
        <Text className="text-muted text-center text-[15px]">{i18n.t('common.not_found_body')}</Text>
        <AppButton label={i18n.t('common.not_found_cta')} onPress={() => router.replace('/')} />
      </View>
    </ScreenLayout>
  );
}
