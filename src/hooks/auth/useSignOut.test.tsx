import { createTestQueryClient } from '@/testing/createTestQueryClient';
import { type PropsWithChildren } from 'react';
import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react-native';
import { useSignOut } from './useSignOut';

const mockSignOut = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: { auth: { signOut: () => mockSignOut() } },
}));
jest.mock('@/hooks/useSimpleToast', () => ({ useSimpleToast: () => ({ showToast: jest.fn() }) }));

const signOutWith = async (queryClient: QueryClient) => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const { result } = await renderHook(() => useSignOut(), { wrapper });

  await act(async () => {
    await result.current.signOut();
  });
};

describe('useSignOut', () => {
  let queryClient: QueryClient;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = createTestQueryClient();
    queryClient.setQueryData(['threads'], [{ id: 'thread-1' }]);
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    queryClient.clear();
    errorSpy.mockRestore();
  });

  it('clears the cache so a second account on this device starts empty', async () => {
    mockSignOut.mockResolvedValue({ error: null });

    await signOutWith(queryClient);

    expect(mockSignOut).toHaveBeenCalled();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
  });

  it('keeps the cache when sign-out fails, because the user is still signed in', async () => {
    mockSignOut.mockResolvedValue({ error: new Error('network down') });

    await signOutWith(queryClient);

    expect(queryClient.getQueryData(['threads'])).toEqual([{ id: 'thread-1' }]);
  });
});
