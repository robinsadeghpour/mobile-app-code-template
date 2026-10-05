import { useCallback } from 'react';
import { type MutateOptions, useMutation } from '@tanstack/react-query';
import { useSimpleToast } from '@/hooks/useSimpleToast';
import { logError } from '@/lib/logger';
import { i18n } from '@/i18n';

type AuthMutationConfig<TVariables, TResult> = {
  mutationFn: (variables: TVariables) => Promise<TResult>;
  logLabel: string;
  successToastKey?: string;
  errorToastKey?: string | ((error: Error) => string);
  afterSuccess?: (result: TResult) => void | Promise<void>;
};

export const useAuthMutation = <TVariables = void, TResult = void>({
  mutationFn,
  logLabel,
  successToastKey,
  errorToastKey,
  afterSuccess,
}: AuthMutationConfig<TVariables, TResult>) => {
  const { showToast } = useSimpleToast();

  const { mutateAsync, isPending } = useMutation({
    mutationFn,
    onSuccess: async (result) => {
      if (successToastKey) showToast('success', i18n.t(successToastKey));
      await afterSuccess?.(result);
    },
    onError: (error) => {
      logError(logLabel, error);
      const key = typeof errorToastKey === 'function' ? errorToastKey(error) : errorToastKey;
      if (key) showToast('error', i18n.t(key));
    },
  });

  // Never rejects: onError above is the handling, so callers need no try/catch.
  const run = useCallback(
    async (variables: TVariables, callbacks?: MutateOptions<TResult, Error, TVariables>) => {
      await mutateAsync(variables, callbacks).catch(() => {});
    },
    [mutateAsync],
  );

  return { run, isLoading: isPending };
};
