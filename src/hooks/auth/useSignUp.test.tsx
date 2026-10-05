import { createTestQueryClient } from '@/testing/createTestQueryClient';
import type { PropsWithChildren } from 'react';
import { act, renderHook } from '@testing-library/react-native';
import { QueryClientProvider } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { useSignUp } from './useSignUp';

jest.mock('@/lib/supabase', () => ({
  supabase: { auth: { signUp: jest.fn() } },
  EMAIL_CONFIRMATION_PATH: '/auth/confirmed',
}));
jest.mock('expo-linking', () => ({ createURL: (path: string) => `myapp://${path}` }));
jest.mock('@/hooks/useSimpleToast', () => ({ useSimpleToast: () => ({ showToast: jest.fn() }) }));

type SignUpResponse = Awaited<ReturnType<typeof supabase.auth.signUp>>;

const signUpMock = jest.mocked(supabase.auth.signUp);
const queryClient = createTestQueryClient({ defaultOptions: { mutations: { retry: false } } });

function Wrapper({ children }: PropsWithChildren) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

async function signUpOnce() {
  const { result } = await renderHook(() => useSignUp(), { wrapper: Wrapper });
  const onSuccess = jest.fn();
  await act(async () => {
    await result.current.signUp({ email: 'new@example.com', password: 'Str0ng!pass' }, { onSuccess });
  });
  return onSuccess;
}

describe('useSignUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reports that confirmation is needed when sign up returns no session', async () => {
    signUpMock.mockResolvedValue({
      data: { user: { id: 'u1' }, session: null },
      error: null,
    } as unknown as SignUpResponse);

    const onSuccess = await signUpOnce();

    expect(onSuccess.mock.calls[0][0]).toEqual({ needsEmailConfirmation: true });
  });

  it('points the confirmation email at a link that reopens the app', async () => {
    signUpMock.mockResolvedValue({
      data: { user: { id: 'u1' }, session: null },
      error: null,
    } as unknown as SignUpResponse);

    await signUpOnce();

    expect(signUpMock).toHaveBeenCalledWith(
      expect.objectContaining({
        options: { emailRedirectTo: 'myapp:///auth/confirmed' },
      }),
    );
  });

  it('reports that no confirmation is needed when sign up returns a session', async () => {
    signUpMock.mockResolvedValue({
      data: { user: { id: 'u1' }, session: { access_token: 'token' } },
      error: null,
    } as unknown as SignUpResponse);

    const onSuccess = await signUpOnce();

    expect(onSuccess.mock.calls[0][0]).toEqual({ needsEmailConfirmation: false });
  });
});
