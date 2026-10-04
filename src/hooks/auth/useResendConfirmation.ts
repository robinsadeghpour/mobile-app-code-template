import { supabase } from '@/lib/supabase';
import { useAuthMutation } from '@/hooks/auth/useAuthMutation';

export const useResendConfirmation = () => {
  const { run, isLoading } = useAuthMutation<{ email: string }>({
    mutationFn: async ({ email }) => {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) throw error;
    },
    logLabel: 'Resend confirmation error:',
    successToastKey: 'auth.resend_confirmation_success',
    errorToastKey: 'auth.resend_confirmation_failed',
  });

  return { isLoading, resendConfirmation: run };
};
