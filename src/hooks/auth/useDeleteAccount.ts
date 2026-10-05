import { callEdgeFunction, EdgeFunctionError } from '@/lib/edgeFunction';
import { useAuthMutation } from '@/hooks/auth/useAuthMutation';
import { useSignOut } from '@/hooks/auth/useSignOut';

export const useDeleteAccount = () => {
  const { signOut } = useSignOut();

  const { run, isLoading } = useAuthMutation({
    mutationFn: () => callEdgeFunction('delete-account'),
    logLabel: 'Delete account error:',
    successToastKey: 'auth.delete_account_success',
    errorToastKey: (error) =>
      error instanceof EdgeFunctionError && error.code === 'storage_cleanup_failed'
        ? 'profile.delete_account_error_storage'
        : 'auth.delete_account_failed',
    afterSuccess: () => signOut(),
  });

  return { isLoading, deleteAccount: run };
};
