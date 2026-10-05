import { router } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { ScreenLayout } from '@/components/ScreenLayout';
import { i18n } from '@/i18n';

export default function Welcome() {
  return (
    <ScreenLayout
      footer={
        <View className="items-center gap-4">
          <AppButton
            testID="auth-welcome-sign-up"
            label={i18n.t('auth.sign_up_button')}
            onPress={() => router.push('/sign-up')}
          />
          <Text
            testID="auth-welcome-sign-in"
            accessibilityRole="link"
            className="tablet:text-[17px] text-muted text-[15px] underline"
            onPress={() => router.push('/sign-in')}
          >
            {i18n.t('auth.sign_in_link')}
          </Text>
          <Text className="text-muted text-center text-[13px]">{i18n.t('auth.welcome_legal')}</Text>
        </View>
      }
    >
      <View className="items-center gap-3">
        <Image source={require('../../assets/images/logo.png')} className="mb-4 h-16 w-16" resizeMode="contain" />
        <Text className="text-foreground text-center font-serif text-[32px]">{i18n.t('auth.welcome_headline')}</Text>
        <Text className="tablet:text-[17px] text-muted text-center text-[15px]">{i18n.t('auth.welcome_subtitle')}</Text>
      </View>
    </ScreenLayout>
  );
}
