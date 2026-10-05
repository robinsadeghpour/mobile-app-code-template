import { router } from 'expo-router';
import { ScreenLayout } from '@/components/ScreenLayout';
import { PasswordForm } from '@/components/auth/PasswordForm';
import { useUpdatePassword } from '@/hooks/auth/useUpdatePassword';
import { i18n } from '@/i18n';

const goToSignIn = () => router.replace('/(public)/sign-in');

export default function UpdatePasswordScreen() {
  const { updatePassword, isLoading } = useUpdatePassword();

  return (
    <ScreenLayout>
      <PasswordForm
        testIDPrefix="auth-update-password"
        title={i18n.t('auth.update_password_title')}
        subtitle={i18n.t('auth.update_password_subtitle')}
        submitLabel={i18n.t('auth.update_password_button')}
        isSubmitting={isLoading}
        onBack={() => (router.canGoBack() ? router.back() : goToSignIn())}
        onSubmit={({ newPassword }) => updatePassword({ newPassword }, { onSuccess: goToSignIn })}
      />
    </ScreenLayout>
  );
}
