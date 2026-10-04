import { Stack, Link } from 'expo-router';
import { View, Text } from 'react-native';
import { Button } from 'heroui-native';
import { i18n } from '@/i18n';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: i18n.t('common.not_found_header') }} />
      <View className="bg-background pt-safe flex-1">
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Text className="text-foreground font-serif text-[32px]">404</Text>
          <Text className="text-muted text-center text-[15px]">{i18n.t('common.not_found_body')}</Text>
          <Link href="/" asChild>
            <Button variant="primary" className="rounded-full">
              <Button.Label>{i18n.t('common.not_found_cta')}</Button.Label>
            </Button>
          </Link>
        </View>
      </View>
    </>
  );
}
