import { supabase } from '@/lib/supabase';
import { useAuthMutation } from '@/hooks/auth/useAuthMutation';
import { useSignOut } from '@/hooks/auth/useSignOut';

export const useUpdatePassword = () => {
  const { signOut } = useSignOut();

  const { run, isLoading } = useAuthMutation<{ newPassword: string }>({
    mutationFn: async ({ newPassword }) => {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    },
    logLabel: 'Error updating password:',
    successToastKey: 'auth.update_password_success',
    errorToastKey: 'auth.update_password_failed',
    afterSuccess: () => signOut(),
  });

  return { isLoading, updatePassword: run };
};
