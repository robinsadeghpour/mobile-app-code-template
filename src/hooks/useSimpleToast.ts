import { useCallback } from 'react';
import { useToast } from 'heroui-native';

const VARIANT_FOR_ACTION = { success: 'success', error: 'danger' } as const;

export const useSimpleToast = () => {
  const { toast } = useToast();

  // Stable so effects that depend on it, like useDeepLink's Linking subscription, do not re-run every render.
  const showToast = useCallback(
    (action: keyof typeof VARIANT_FOR_ACTION, label: string) => {
      toast.show({ variant: VARIANT_FOR_ACTION[action], placement: 'bottom', label });
    },
    [toast],
  );

  return { showToast };
};
