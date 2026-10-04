import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Button } from 'heroui-native';
import { GuestLayout } from '@/components/GuestLayout';
import { ContentContainer, useIsTablet } from '@/components/ContentContainer';
import { useResendConfirmation } from '@/hooks/auth/useResendConfirmation';
import { i18n } from '@/i18n';

export default function CheckEmailScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { resendConfirmation, isLoading } = useResendConfirmation();
  const isTablet = useIsTablet();

  return (
    <GuestLayout>
      <View className="flex-1 justify-center">
        <ContentContainer>
          <View className="items-center gap-6">
            <View className="gap-1.5">
              <Text className="text-foreground text-center font-serif text-[26px]">
                {i18n.t('auth.check_email_title')}
              </Text>
              <Text className="tablet:text-[17px] text-muted text-center text-[15px]">
                {email
                  ? i18n.t('auth.check_email_subtitle', { email })
                  : i18n.t('auth.check_email_subtitle_no_address')}
              </Text>
            </View>
            <Button
              testID="auth-check-email-back"
              variant="primary"
              size={isTablet ? 'lg' : 'md'}
              className="w-full rounded-full"
              onPress={() => router.replace('/(public)/sign-in')}
            >
              <Button.Label>{i18n.t('auth.check_email_back_button')}</Button.Label>
            </Button>
            {email ? (
              <Pressable
                testID="auth-check-email-resend"
                onPress={() => void resendConfirmation({ email })}
                disabled={isLoading}
                hitSlop={8}
              >
                <Text className="text-muted text-[15px] underline">{i18n.t('auth.check_email_resend_link')}</Text>
              </Pressable>
            ) : null}
          </View>
        </ContentContainer>
      </View>
    </GuestLayout>
  );
}
