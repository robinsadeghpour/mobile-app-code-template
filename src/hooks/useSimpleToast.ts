import { useCallback } from 'react';
import { useToast } from 'heroui-native';

const VARIANT_FOR_ACTION = {
  success: 'success',
  error: 'danger',
} as const;

export const useSimpleToast = () => {
  const { toast } = useToast();

  // Memoized: useDeepLink's effect re-subscribes to Linking whenever this identity changes.
  const showToast = useCallback(
    (action: 'success' | 'error', title: string) => {
      toast.show({
        variant: VARIANT_FOR_ACTION[action],
        placement: 'bottom',
        label: title,
      });
    },
    [toast],
  );

  return { showToast };
};
