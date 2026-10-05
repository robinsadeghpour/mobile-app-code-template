import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthMutation } from '@/hooks/auth/useAuthMutation';

export const useSignOut = () => {
  const queryClient = useQueryClient();

  const { run, isLoading } = useAuthMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    logLabel: 'Sign out error:',
    errorToastKey: 'auth.sign_out_failed',
    afterSuccess: () => queryClient.clear(),
  });

  return { isLoading, signOut: run };
};
