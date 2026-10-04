import * as Linking from 'expo-linking';
import { EMAIL_CONFIRMATION_PATH, supabase } from '@/lib/supabase';
import { useAuthMutation } from '@/hooks/auth/useAuthMutation';

type SignUpResult = { needsEmailConfirmation: boolean };

export const useSignUp = () => {
  const { run, isLoading } = useAuthMutation<{ email: string; password: string }, SignUpResult>({
    mutationFn: async ({ email, password }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: Linking.createURL(EMAIL_CONFIRMATION_PATH) },
      });
      if (error) throw error;
      return { needsEmailConfirmation: data.session === null };
    },
    logLabel: 'Sign up error:',
    successToastKey: 'auth.sign_up_success',
    errorToastKey: 'auth.sign_up_failed',
  });

  return { isLoading, signUp: run };
};
