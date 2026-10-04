import { useMutation } from '@tanstack/react-query';
import { useSimpleToast } from '@/hooks/useSimpleToast';
import { logError } from '@/lib/logger';
import { i18n } from '@/i18n';

export type AuthMutationCallbacks<TResult = void> = {
  onSuccess?: (result: TResult) => void;
  onError?: (error: Error) => void;
};

type AuthMutationConfig<TVariables extends object, TResult> = {
  mutationFn: (variables: TVariables) => Promise<TResult>;
  logLabel: string;
  successToastKey?: string;
  errorToastKey?: string | ((error: Error) => string);
  // unknown, not void, so afterSuccess can return another hook's run() promise.
  afterSuccess?: (result: TResult) => unknown;
};

// Reversed on purpose: only a TVariables of exactly `object` makes the argument optional.
type RunArgs<TVariables extends object, TResult> = object extends TVariables
  ? [options?: AuthMutationCallbacks<TResult>]
  : [options: TVariables & AuthMutationCallbacks<TResult>];

export const useAuthMutation = <TVariables extends object = object, TResult = void>({
  mutationFn,
  logLabel,
  successToastKey,
  errorToastKey,
  afterSuccess,
}: AuthMutationConfig<TVariables, TResult>) => {
  const { showToast } = useSimpleToast();

  const mutation = useMutation({
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

  // Never rejects; the boolean tells a caller whether to clean up.
  const run = async (...[options]: RunArgs<TVariables, TResult>): Promise<boolean> => {
    const { onSuccess, onError, ...variables } = options ?? ({} as TVariables & AuthMutationCallbacks<TResult>);
    try {
      // TS cannot narrow the rest destructure back to TVariables; only the two callback keys were removed.
      const result = await mutation.mutateAsync(variables as unknown as TVariables);
      onSuccess?.(result);
      return true;
    } catch (error) {
      onError?.(error as Error);
      return false;
    }
  };

  return { run, isLoading: mutation.isPending };
};
