import { router } from 'expo-router';
import { Alert, Text, View } from 'react-native';
import { Button } from 'heroui-native';
import { ContentContainer } from '@/components/ContentContainer';
import { useSession } from '@/hooks/useSession';
import { useSignOut } from '@/hooks/auth/useSignOut';
import { useDeleteAccount } from '@/hooks/auth/useDeleteAccount';
import { i18n } from '@/i18n';

/**
 * Account screen.
 *
 * Deleting the account is here because both stores require it to be reachable
 * from inside the app, and a link to a support address does not satisfy that.
 * It is the requirement most starters leave out.
 */
export default function Profile() {
  const { user } = useSession();
  const { signOut, isLoading: isSigningOut } = useSignOut();
  const { deleteAccount, isLoading: isDeleting } = useDeleteAccount();

  const confirmDelete = () =>
    Alert.alert(i18n.t('profile.delete_account'), i18n.t('profile.delete_account_confirm'), [
      { text: i18n.t('common.cancel'), style: 'cancel' },
      {
        text: i18n.t('profile.delete_account'),
        style: 'destructive',
        onPress: () => void deleteAccount(undefined),
      },
    ]);

  return (
    <View className="flex-1 justify-center">
      <ContentContainer>
        <View className="gap-6">
          <View className="gap-1">
            <Text className="text-foreground font-sans-semibold text-[22px]">
              {i18n.t('profile.title')}
            </Text>
            <Text className="text-muted text-[15px]">{user?.email}</Text>
          </View>

          <View className="gap-3">
            <Button variant="secondary" onPress={() => router.push('/(app)/change-password')}>
              <Button.Label>{i18n.t('profile.change_password')}</Button.Label>
            </Button>
            <Button variant="secondary" onPress={() => void signOut(undefined)} isDisabled={isSigningOut}>
              <Button.Label>{i18n.t('auth.sign_out')}</Button.Label>
            </Button>
            <Button variant="danger" onPress={confirmDelete} isDisabled={isDeleting}>
              <Button.Label>{i18n.t('profile.delete_account')}</Button.Label>
            </Button>
          </View>
        </View>
      </ContentContainer>
    </View>
  );
}
