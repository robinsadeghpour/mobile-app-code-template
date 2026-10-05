import { createTestQueryClient } from '@/testing/createTestQueryClient';
import { UiProvider } from '@/testing/UiProvider';
import type { PropsWithChildren } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { SignUpForm } from './SignUpForm';

jest.mock('@/lib/supabase', () => ({
  supabase: { auth: { signUp: jest.fn() } },
  EMAIL_CONFIRMATION_PATH: '/auth/confirmed',
}));
jest.mock('expo-linking', () => ({ createURL: (path: string) => `myapp://${path}` }));
jest.mock('@/hooks/useSimpleToast', () => ({ useSimpleToast: () => ({ showToast: jest.fn() }) }));
jest.mock('expo-router', () => ({ router: { replace: jest.fn() } }));

// The fixtures below carry only the two fields the hook reads, so they are cast
// to Supabase's full response shape at this test boundary.
type SignUpResponse = Awaited<ReturnType<typeof supabase.auth.signUp>>;

const signUpMock = jest.mocked(supabase.auth.signUp);
const replaceMock = jest.mocked(router.replace);
const queryClient = createTestQueryClient({ defaultOptions: { mutations: { retry: false } } });

function Wrapper({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <UiProvider>{children}</UiProvider>
    </QueryClientProvider>
  );
}

// Every fireEvent has to be awaited: an unawaited one leaves an act() scope open
// and every later render in this file comes back empty.
async function submitValidSignUp() {
  const view = await render(<SignUpForm />, { wrapper: Wrapper });
  await fireEvent.changeText(view.getByTestId('auth-email-input'), 'new@example.com');
  await fireEvent.changeText(view.getByTestId('auth-password-input'), 'Str0ng!pass');
  await fireEvent.changeText(view.getByTestId('auth-confirmPassword-input'), 'Str0ng!pass');
  await fireEvent.press(view.getByTestId('auth-submit'));
  await waitFor(() => expect(signUpMock).toHaveBeenCalledTimes(1));
  return view;
}

describe('SignUpForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('routes to the check-email screen when sign up returns no session', async () => {
    signUpMock.mockResolvedValue({
      data: { user: { id: 'u1' }, session: null },
      error: null,
    } as unknown as SignUpResponse);

    await submitValidSignUp();

    await waitFor(() =>
      expect(replaceMock).toHaveBeenCalledWith({
        pathname: '/(public)/check-email',
        params: { email: 'new@example.com' },
      }),
    );
  });

  it('leaves navigation to the session guard when sign up returns a session', async () => {
    signUpMock.mockResolvedValue({
      data: { user: { id: 'u1' }, session: { access_token: 'token' } },
      error: null,
    } as unknown as SignUpResponse);

    const view = await submitValidSignUp();

    await waitFor(() => expect(view.getByTestId('auth-email-input').props.value).toBe(''));
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
