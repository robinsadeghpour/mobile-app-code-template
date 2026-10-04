import { router } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { Button } from 'heroui-native';
import { GuestLayout } from '@/components/GuestLayout';
import { ContentContainer } from '@/components/ContentContainer';
import { i18n } from '@/i18n';

export default function Welcome() {
  return (
    <GuestLayout>
      <View className="flex-1 items-center justify-center">
        <ContentContainer>
          <View className="items-center gap-3">
            <Image source={require('../../assets/images/logo.png')} className="mb-4 h-16 w-16" resizeMode="contain" />
            <Text className="text-foreground text-center font-serif text-[32px]">
              {i18n.t('auth.welcome_headline')}
            </Text>
            <Text className="tablet:text-[17px] text-muted text-center text-[15px]">
              {i18n.t('auth.welcome_subtitle')}
            </Text>
          </View>
        </ContentContainer>
      </View>

      <ContentContainer>
        <View className="gap-3 pb-4">
          <Button testID="auth-welcome-sign-up" onPress={() => router.push('/sign-up')}>
            <Button.Label>{i18n.t('auth.sign_up_button')}</Button.Label>
          </Button>
          <View className="mt-1 flex-row items-center justify-center gap-3">
            <Text
              testID="auth-welcome-sign-in"
              className="tablet:text-[17px] text-muted text-[15px] underline"
              onPress={() => router.push('/sign-in')}
            >
              {i18n.t('auth.sign_in_link')}
            </Text>
          </View>
          <Text className="text-muted mt-2 text-center text-[13px]">{i18n.t('auth.welcome_legal')}</Text>
        </View>
      </ContentContainer>
    </GuestLayout>
  );
}
