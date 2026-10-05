import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { ScreenLayout } from '@/components/ScreenLayout';
import { ScreenTitle } from '@/components/ScreenTitle';
import { FormInput } from '@/components/auth/FormInput';
import { useResetPassword } from '@/hooks/auth/useResetPassword';
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/lib/schema/auth';
import { i18n } from '@/i18n';

export default function ForgotPasswordScreen() {
  const { control, handleSubmit, reset } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema()),
    defaultValues: { email: '' },
  });
  const { resetPassword, isLoading } = useResetPassword();
  const submit = handleSubmit((values) => resetPassword(values, { onSuccess: () => reset() }));

  return (
    <ScreenLayout>
      <View className="gap-6">
        <ScreenTitle
          title={i18n.t('auth.forgot_password_title')}
          subtitle={i18n.t('auth.forgot_password_subtitle')}
          onBack={() => router.back()}
          backTestID="auth-forgot-password-back"
        />
        <FormInput
          control={control}
          name="email"
          type="email"
          testIDPrefix="auth-forgot-password-email"
          label={i18n.t('auth.email_label')}
          placeholder={i18n.t('auth.email_placeholder')}
          returnKeyType="done"
          onSubmitEditing={submit}
        />
        <AppButton
          testID="auth-forgot-password-submit"
          label={i18n.t('auth.send_link_button')}
          isLoading={isLoading}
          onPress={submit}
        />
      </View>
    </ScreenLayout>
  );
}
