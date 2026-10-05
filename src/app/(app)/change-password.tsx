import { router } from 'expo-router';
import { ScreenLayout } from '@/components/ScreenLayout';
import { PasswordForm } from '@/components/auth/PasswordForm';
import { useChangePassword } from '@/hooks/auth/useChangePassword';
import { i18n } from '@/i18n';

export default function ChangePasswordScreen() {
  const { changePassword, isLoading } = useChangePassword();

  return (
    <ScreenLayout>
      <PasswordForm
        testIDPrefix="auth-change-password"
        title={i18n.t('auth.change_password_title')}
        subtitle={i18n.t('auth.change_password_subtitle')}
        submitLabel={i18n.t('auth.change_password_button')}
        withCurrentPassword
        isSubmitting={isLoading}
        onBack={() => router.back()}
        onSubmit={({ currentPassword, newPassword }) =>
          changePassword({ currentPassword, newPassword }, { onSuccess: () => router.back() })
        }
      />
    </ScreenLayout>
  );
}
