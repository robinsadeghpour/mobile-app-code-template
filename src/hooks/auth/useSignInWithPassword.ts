import { supabase } from '@/lib/supabase';
import { useAuthMutation } from '@/hooks/auth/useAuthMutation';

export const useSignInWithPassword = () => {
  const { run, isLoading } = useAuthMutation<{ email: string; password: string }>({
    mutationFn: async ({ email, password }) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    logLabel: 'Sign in error:',
    errorToastKey: 'auth.sign_in_failed',
  });

  return { isLoading, signInWithPassword: run };
};
