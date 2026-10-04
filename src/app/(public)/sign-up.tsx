import { Link as ExpoLink } from 'expo-router';
import { Text, View } from 'react-native';
import { GuestLayout } from '@/components/GuestLayout';
import { ContentContainer } from '@/components/ContentContainer';
import { SignUpForm } from '@/components/sign-up/SignUpForm';
import { i18n } from '@/i18n';

export default function SignUp() {

  return (
    <GuestLayout>
      <View className="flex-1 justify-center">
        <ContentContainer>
          <View className="gap-6">
            <Text className="font-sans-semibold text-foreground text-[22px]">{i18n.t('auth.sign_up_title')}</Text>
            <SignUpForm />
          </View>
        </ContentContainer>
      </View>
      <ContentContainer>
        <Text className="tablet:text-[17px] text-muted pb-4 text-center text-[15px]">
          {i18n.t('auth.have_account_prompt')}{' '}
          <ExpoLink href="/sign-in">
            <Text className="text-foreground underline">{i18n.t('auth.sign_in_link')}</Text>
          </ExpoLink>
        </Text>
      </ContentContainer>
    </GuestLayout>
  );
}
