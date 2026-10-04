import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { PasswordForm } from '@/components/auth/PasswordForm';
import { useChangePassword } from '@/hooks/auth/useChangePassword';
import { type PasswordFormValues } from '@/lib/schema/passwordForm';
import { i18n } from '@/i18n';

export default function ChangePasswordScreen() {
  const { changePassword, isLoading } = useChangePassword();
  const router = useRouter();

  const onSubmit = async ({ currentPassword, newPassword }: PasswordFormValues) => {
    await changePassword({ currentPassword, newPassword, onSuccess: () => router.back() });
  };

  return (
    <View className="bg-background pt-safe pb-safe flex-1">
      <ScrollView className="flex-1" contentContainerClassName="px-6 pt-6" keyboardShouldPersistTaps="handled">
        <PasswordForm
          testIDPrefix="auth-change-password"
          title={i18n.t('auth.change_password_title')}
          subtitle={i18n.t('auth.change_password_subtitle')}
          submitLabel={i18n.t('auth.change_password_button')}
          withCurrentPassword
          isSubmitting={isLoading}
          onBack={() => router.back()}
          onSubmit={onSubmit}
        />
      </ScrollView>
    </View>
  );
}
