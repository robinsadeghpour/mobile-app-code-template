import { Text, View } from 'react-native';
import { ScreenLayout } from '@/components/ScreenLayout';
import { useSession } from '@/hooks/useSession';
import { i18n } from '@/i18n';

export default function Home() {
  const { user } = useSession();

  return (
    <ScreenLayout>
      <View className="gap-3">
        <Text className="text-foreground font-serif text-[32px]">{i18n.t('home.title')}</Text>
        <Text className="text-muted text-[15px]">{user?.email}</Text>
        <Text className="text-muted text-[15px]">{i18n.t('home.placeholder')}</Text>
      </View>
    </ScreenLayout>
  );
}
