import { router } from 'expo-router';
import { Alert, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { ScreenLayout } from '@/components/ScreenLayout';
import { ScreenTitle } from '@/components/ScreenTitle';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { useSession } from '@/hooks/useSession';
import { useSignOut } from '@/hooks/auth/useSignOut';
import { useDeleteAccount } from '@/hooks/auth/useDeleteAccount';
import { i18n } from '@/i18n';

export default function Profile() {
  const { user } = useSession();
  const { signOut, isLoading: isSigningOut } = useSignOut();
  const { deleteAccount, isLoading: isDeleting } = useDeleteAccount();

  const confirmDelete = () =>
    Alert.alert(i18n.t('profile.delete_account'), i18n.t('profile.delete_account_confirm'), [
      { text: i18n.t('common.cancel'), style: 'cancel' },
      { text: i18n.t('profile.delete_account'), style: 'destructive', onPress: () => void deleteAccount() },
    ]);

  return (
    <ScreenLayout>
      <View className="gap-6">
        <ScreenTitle title={i18n.t('profile.title')} subtitle={user?.email} />
        <ThemeSwitch />
        <View className="gap-3">
          <AppButton
            variant="secondary"
            label={i18n.t('profile.change_password')}
            onPress={() => router.push('/(app)/change-password')}
          />
          <AppButton
            variant="secondary"
            label={i18n.t('auth.sign_out')}
            isLoading={isSigningOut}
            onPress={() => void signOut()}
          />
          {/* Both stores reject an app whose accounts cannot be deleted from inside it. */}
          <AppButton
            variant="danger"
            label={i18n.t('profile.delete_account')}
            isLoading={isDeleting}
            onPress={confirmDelete}
          />
        </View>
      </View>
    </ScreenLayout>
  );
}
