import * as Linking from 'expo-linking';
import { act, renderHook } from '@testing-library/react-native';
import { i18n } from '@/i18n';
import { EMAIL_CONFIRMATION_PATH } from '@/lib/supabase';
import { useDeepLink } from './useDeepLink';

const mockReplace = jest.fn();
const mockSetSession = jest.fn(({ onSuccess }: { onSuccess?: () => void }) => onSuccess?.());
const mockShowToast = jest.fn();
const mockLogError = jest.fn();

// Mirrors expo-linking's own parse: a WHATWG URL, path without its leading slash.
jest.mock('expo-linking', () => ({
  parse: jest.fn((url: string) => {
    const parsed = new URL(url);
    return {
      hostname: parsed.hostname || null,
      path: parsed.pathname ? parsed.pathname.replace(/^\//, '') : null,
      queryParams: Object.fromEntries(parsed.searchParams),
      scheme: parsed.protocol.slice(0, -1),
    };
  }),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  getInitialURL: jest.fn(),
  createURL: jest.fn((path: string) => `myapp://${path}`),
}));

jest.mock('@/lib/secure-storage', () => ({
  secureStorageAdapter: { getItem: async () => null, setItem: async () => {}, removeItem: async () => {} },
}));
jest.mock('@/lib/supabase', () => {
  process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://project.supabase.co';
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';
  return jest.requireActual('@/lib/supabase');
});

jest.mock('expo-router', () => ({ useRouter: () => ({ replace: mockReplace }) }));
jest.mock('@/hooks/auth/useSetSession', () => ({
  useSetSession: () => ({ setSession: mockSetSession }),
}));
jest.mock('@/hooks/useSimpleToast', () => ({
  useSimpleToast: () => ({ showToast: mockShowToast }),
}));
jest.mock('@/lib/logger', () => ({ logError: (...args: unknown[]) => mockLogError(...args) }));

// Without act, a second mount in this file never commits and the hook's effect silently never runs.
const openLink = async (url: string) => {
  jest.mocked(Linking.getInitialURL).mockResolvedValue(url);
  let view!: ReturnType<typeof renderHook<void, unknown>>;
  await act(async () => {
    view = renderHook(() => useDeepLink());
  });
  return view;
};

describe('useDeepLink', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('signs the user in and opens the update-password screen for a recovery link', async () => {
    await openLink('myapp://update-password#access_token=a&refresh_token=r&type=recovery');

    expect(mockSetSession).toHaveBeenCalledWith(expect.objectContaining({ access_token: 'a', refresh_token: 'r' }));
    expect(mockReplace).toHaveBeenCalledWith('/update-password');
  });

  it('still recognises a recovery link by its path when the link carries no type', async () => {
    await openLink('myapp:///update-password#access_token=a&refresh_token=r');

    expect(mockReplace).toHaveBeenCalledWith('/update-password');
  });

  it('signs the user in and opens the app for an email confirmation link', async () => {
    await openLink(`myapp://${EMAIL_CONFIRMATION_PATH}#access_token=a&refresh_token=r&type=signup`);

    expect(mockSetSession).toHaveBeenCalledWith(expect.objectContaining({ access_token: 'a', refresh_token: 'r' }));
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('recognises a confirmation link by its path when the link carries no type', async () => {
    await openLink(`myapp://${EMAIL_CONFIRMATION_PATH}#access_token=a&refresh_token=r`);

    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('sends the user back to sign-in with a translated toast when the link has expired', async () => {
    await openLink(
      `myapp://${EMAIL_CONFIRMATION_PATH}#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired`,
    );

    expect(mockSetSession).not.toHaveBeenCalled();
    expect(mockLogError).toHaveBeenCalledWith('Auth deep link error:', 'Email link is invalid or has expired');
    expect(mockShowToast).toHaveBeenCalledWith('error', i18n.t('auth.email_link_invalid'));
    expect(mockReplace).toHaveBeenCalledWith('/(public)/sign-in');
  });

  it('acts on the launch URL once however often the hook re-renders', async () => {
    const { rerender } = await openLink(
      `myapp://${EMAIL_CONFIRMATION_PATH}#error=access_denied&error_code=otp_expired`,
    );
    await act(async () => rerender(undefined));
    await act(async () => rerender(undefined));

    expect(Linking.addEventListener).toHaveBeenCalledTimes(3);
    expect(mockShowToast).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledTimes(1);
  });

  it('ignores a link that carries no auth tokens', async () => {
    await openLink('myapp://some/other/place');

    expect(mockSetSession).not.toHaveBeenCalled();
    expect(mockShowToast).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
