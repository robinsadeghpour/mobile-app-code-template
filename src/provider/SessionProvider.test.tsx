import React from 'react';
import { Text } from 'react-native';
import { render, screen, waitFor, act } from '@testing-library/react-native';
import { SessionProvider, SessionContext } from '@/provider/SessionProvider';

const mockStartAutoRefresh = jest.fn();
const mockStopAutoRefresh = jest.fn();
const mockUnsubscribe = jest.fn();
let mockEmit: ((event: string, session: unknown) => void) | null = null;

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      onAuthStateChange: (cb: (event: string, session: unknown) => void) => {
        mockEmit = cb;
        return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
      },
      startAutoRefresh: (...args: unknown[]) => mockStartAutoRefresh(...args),
      stopAutoRefresh: (...args: unknown[]) => mockStopAutoRefresh(...args),
      getUser: jest.fn(),
    },
  },
}));

const Probe = () => (
  <SessionContext.Consumer>
    {({ user }) => <Text>{user ? `signed in ${user.id}` : 'signed out'}</Text>}
  </SessionContext.Consumer>
);

const tree = (
  <SessionProvider>
    <Probe />
  </SessionProvider>
);

const session = (id: string) => ({ user: { id, email: `${id}@example.com` } });

const emit = async (event: string, value: unknown) => {
  await act(async () => {
    mockEmit?.(event, value);
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  mockEmit = null;
});

describe('SessionProvider', () => {
  it('renders nothing until the first auth state arrives', async () => {
    await render(tree);

    // Rendering children before the session is known makes every screen flash
    // its signed-out state for a frame.
    expect(screen.queryByText(/signed/)).toBeNull();
  });

  it('exposes the user once an auth state arrives', async () => {
    await render(tree);
    await emit('INITIAL_SESSION', session('abc'));

    await waitFor(() => expect(screen.getByText('signed in abc')).toBeTruthy());
  });

  it('clears the user on sign out', async () => {
    await render(tree);
    await emit('INITIAL_SESSION', session('abc'));
    await waitFor(() => expect(screen.getByText('signed in abc')).toBeTruthy());

    await emit('SIGNED_OUT', null);

    await waitFor(() => expect(screen.getByText('signed out')).toBeTruthy());
  });

  it('starts the token refresh and stops it on unmount', async () => {
    const view = await render(tree);
    await emit('INITIAL_SESSION', session('abc'));

    await waitFor(() => expect(mockStartAutoRefresh).toHaveBeenCalled());

    await view.unmount();

    // A refresh timer left running while nothing is mounted fires at the one
    // moment the network is least likely to be there.
    expect(mockStopAutoRefresh).toHaveBeenCalled();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
