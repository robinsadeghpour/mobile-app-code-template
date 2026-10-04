import { supabase } from '@/lib/supabase';
import { useAuthMutation } from '@/hooks/auth/useAuthMutation';

export const useSetSession = () => {
  const { run, isLoading } = useAuthMutation<{ access_token: string; refresh_token: string }>({
    mutationFn: async (tokens) => {
      const { error } = await supabase.auth.setSession(tokens);
      if (error) throw error;
    },
    logLabel: 'Set session error:',
    errorToastKey: 'auth.set_session_failed',
  });

  return { isLoading, setSession: run };
};
