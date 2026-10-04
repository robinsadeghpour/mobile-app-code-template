import { supabase } from '@/lib/supabase';
import { useAuthMutation } from '@/hooks/auth/useAuthMutation';
import { useSession } from '@/hooks/useSession';

class WrongCurrentPasswordError extends Error {}

const verifyCurrentPassword = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new WrongCurrentPasswordError();
};

export const useChangePassword = () => {
  const { user } = useSession();

  const { run, isLoading } = useAuthMutation<{ currentPassword: string; newPassword: string }>({
    mutationFn: async ({ currentPassword, newPassword }) => {
      const email = user?.email;
      if (!email) throw new Error('No email on the signed-in account');

      await verifyCurrentPassword(email, currentPassword);

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    },
    logLabel: 'Change password error:',
    successToastKey: 'auth.change_password_success',
    errorToastKey: (error) =>
      error instanceof WrongCurrentPasswordError ? 'auth.change_password_wrong_current' : 'auth.change_password_failed',
  });

  return { isLoading, changePassword: run };
};
