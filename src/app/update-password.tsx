import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { GuestLayout } from '@/components/GuestLayout';
import { PasswordForm } from '@/components/auth/PasswordForm';
import { useUpdatePassword } from '@/hooks/auth/useUpdatePassword';
import { type PasswordFormValues } from '@/lib/schema/passwordForm';
import { i18n } from '@/i18n';

export default function UpdatePasswordScreen() {
  const { updatePassword, isLoading } = useUpdatePassword();
  const router = useRouter();

  const onSubmit = async ({ newPassword }: PasswordFormValues) => {
    await updatePassword({
      newPassword,
      onSuccess: () => router.replace('/(public)/sign-in'),
    });
  };

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/(public)/sign-in'));

  return (
    <GuestLayout>
      <View className="flex-1 justify-center">
        <PasswordForm
          testIDPrefix="auth-update-password"
          title={i18n.t('auth.update_password_title')}
          subtitle={i18n.t('auth.update_password_subtitle')}
          submitLabel={i18n.t('auth.update_password_button')}
          isSubmitting={isLoading}
          onBack={goBack}
          onSubmit={onSubmit}
        />
      </View>
    </GuestLayout>
  );
}
