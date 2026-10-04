import { type User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAuthMutation } from '@/hooks/auth/useAuthMutation';
import { useSession } from '@/hooks/useSession';

export const useUpdateUserProfile = () => {
  const { refreshUser } = useSession();

  const { run, isLoading } = useAuthMutation<{ data: Partial<User['user_metadata']> }>({
    mutationFn: async ({ data }) => {
      const { error } = await supabase.auth.updateUser({ data });
      if (error) throw error;
    },
    logLabel: 'Error updating user profile:',
    successToastKey: 'auth.update_profile_success',
    errorToastKey: 'auth.update_profile_failed',
    afterSuccess: () => refreshUser(),
  });

  return { isLoading, updateUserProfile: run };
};
