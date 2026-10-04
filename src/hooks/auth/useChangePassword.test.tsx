import { createTestQueryClient } from '@/testing/createTestQueryClient';
import { type PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react-native';
import { useChangePassword } from './useChangePassword';
import { i18n } from '@/i18n';

const mockSignInWithPassword = jest.fn();
const mockUpdateUser = jest.fn();
const mockShowToast = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
      updateUser: (...args: unknown[]) => mockUpdateUser(...args),
    },
  },
}));

jest.mock('@/hooks/useSession', () => ({ useSession: () => ({ user: { email: 'user@example.com' } }) }));
jest.mock('@/hooks/useSimpleToast', () => ({ useSimpleToast: () => ({ showToast: mockShowToast }) }));

const changePasswordWith = async (currentPassword: string, newPassword: string) => {
  const queryClient = createTestQueryClient({ defaultOptions: { mutations: { retry: false } } });
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const { result } = await renderHook(() => useChangePassword(), { wrapper });

  await act(async () => {
    await result.current.changePassword({ currentPassword, newPassword });
  });
};

describe('useChangePassword', () => {
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('leaves the password alone and says so when the current one is wrong', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: new Error('Invalid login credentials') });

    await changePasswordWith('WrongPass1!', 'Str0ng!pass');

    expect(mockUpdateUser).not.toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith('error', i18n.t('auth.change_password_wrong_current'));
  });

  it('sets the new password once the current one checks out', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });
    mockUpdateUser.mockResolvedValue({ error: null });

    await changePasswordWith('Old!pass1', 'Str0ng!pass');

    expect(mockUpdateUser).toHaveBeenCalledWith({ password: 'Str0ng!pass' });
    expect(mockShowToast).toHaveBeenCalledWith('success', i18n.t('auth.change_password_success'));
  });
});
