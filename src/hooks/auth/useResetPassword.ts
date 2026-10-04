import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';
import { useAuthMutation } from '@/hooks/auth/useAuthMutation';

export const useResetPassword = () => {
  const { run, isLoading } = useAuthMutation<{ email: string }>({
    mutationFn: async ({ email }) => {
      const redirectTo = Linking.createURL('/update-password');
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
    },
    logLabel: 'Reset password error:',
    successToastKey: 'auth.reset_password_success',
    errorToastKey: 'auth.reset_password_failed',
  });

  return { isLoading, resetPassword: run };
};
