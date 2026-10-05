import { createTestQueryClient } from '@/testing/createTestQueryClient';
import type { PropsWithChildren } from 'react';
import { act, renderHook } from '@testing-library/react-native';
import { QueryClientProvider } from '@tanstack/react-query';

import { useAuthMutation } from './useAuthMutation';
import { logError } from '@/lib/logger';
import { i18n } from '@/i18n';

const mockShowToast = jest.fn();

jest.mock('@/hooks/useSimpleToast', () => ({ useSimpleToast: () => ({ showToast: mockShowToast }) }));
jest.mock('@/lib/logger', () => ({ logError: jest.fn() }));

const logErrorMock = jest.mocked(logError);
const queryClient = createTestQueryClient({ defaultOptions: { mutations: { retry: false } } });

function Wrapper({ children }: PropsWithChildren) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useAuthMutation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('toasts the success key and hands the result to the caller', async () => {
    const { result } = await renderHook(
      () =>
        useAuthMutation<{ email: string }, string>({
          mutationFn: ({ email }) => Promise.resolve(email),
          logLabel: 'test:',
          successToastKey: 'auth.sign_up_success',
        }),
      { wrapper: Wrapper },
    );
    const onSuccess = jest.fn();

    await act(async () => {
      await result.current.run({ email: 'new@example.com' }, { onSuccess });
    });

    expect(mockShowToast).toHaveBeenCalledWith('success', i18n.t('auth.sign_up_success'));
    expect(onSuccess.mock.calls[0][0]).toBe('new@example.com');
  });

  it('keeps run stable across renders so effects can depend on it', async () => {
    const { result, rerender } = await renderHook(
      () => useAuthMutation({ mutationFn: () => Promise.resolve(), logLabel: 'test:' }),
      { wrapper: Wrapper },
    );
    const firstRun = result.current.run;

    await act(async () => rerender(undefined));

    expect(result.current.run).toBe(firstRun);
  });

  it('logs the failure, toasts the error key and hands the error to the caller without rejecting', async () => {
    const failure = new Error('supabase said no');
    const { result } = await renderHook(
      () =>
        useAuthMutation({
          mutationFn: () => Promise.reject(failure),
          logLabel: 'test:',
          errorToastKey: 'auth.sign_up_failed',
        }),
      { wrapper: Wrapper },
    );
    const onError = jest.fn();

    await act(async () => {
      await result.current.run(undefined, { onError });
    });

    expect(logErrorMock).toHaveBeenCalledWith('test:', failure);
    expect(mockShowToast).toHaveBeenCalledWith('error', i18n.t('auth.sign_up_failed'));
    expect(onError.mock.calls[0][0]).toBe(failure);
  });
});
