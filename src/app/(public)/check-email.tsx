import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { ScreenLayout } from '@/components/ScreenLayout';
import { useResendConfirmation } from '@/hooks/auth/useResendConfirmation';
import { i18n } from '@/i18n';

export default function CheckEmailScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { resendConfirmation, isLoading } = useResendConfirmation();

  return (
    <ScreenLayout>
      <View className="items-center gap-6">
        <View className="gap-1.5">
          <Text className="text-foreground text-center font-serif text-[26px]">{i18n.t('auth.check_email_title')}</Text>
          <Text className="tablet:text-[17px] text-muted text-center text-[15px]">
            {email ? i18n.t('auth.check_email_subtitle', { email }) : i18n.t('auth.check_email_subtitle_no_address')}
          </Text>
        </View>
        <AppButton
          testID="auth-check-email-back"
          label={i18n.t('auth.check_email_back_button')}
          onPress={() => router.replace('/(public)/sign-in')}
        />
        {email ? (
          <Pressable
            testID="auth-check-email-resend"
            accessibilityRole="button"
            onPress={() => void resendConfirmation({ email })}
            disabled={isLoading}
            hitSlop={8}
          >
            <Text className="text-muted text-[15px] underline">{i18n.t('auth.check_email_resend_link')}</Text>
          </Pressable>
        ) : null}
      </View>
    </ScreenLayout>
  );
}
