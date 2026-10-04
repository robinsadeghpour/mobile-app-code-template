import { AppState } from 'react-native';
import { type Session, type User } from '@supabase/supabase-js';
import React, { createContext, type PropsWithChildren, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { logError } from '@/lib/logger';

type SessionContextProps = {
  user: User | null;
  session: Session | null;
  initialized: boolean;
  refreshUser: () => Promise<void>;
};

export const SessionContext = createContext<SessionContextProps>({
  user: null,
  session: null,
  initialized: false,
  refreshUser: async () => {},
});

/**
 * Who is signed in, for the whole app.
 *
 * Two things make this more than a `useState` around `getSession`. It listens
 * for auth changes rather than reading once, so a token refreshed in the
 * background or a sign-out on another tab arrives here. And it starts and stops
 * Supabase's auto refresh with the app's own foreground state, because a timer
 * left running while the app is backgrounded is a refresh that fires at the one
 * moment the network is least likely to be there.
 *
 * It renders nothing until the first auth event has landed. Without that, every
 * screen flashes its signed-out state for a frame before the session arrives.
 */
export const SessionProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  const refreshUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    // Callers refresh after writing to the profile, so a silent failure here is
    // a save that looks applied while every screen keeps rendering the old user.
    if (error) {
      logError('Failed to refresh the signed-in user', error);
      return;
    }
    if (user) {
      setUser(user);
    }
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session ? session.user : null);
      setInitialized(true);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    void supabase.auth.startAutoRefresh();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void supabase.auth.startAutoRefresh();
      } else if (state === 'background' || state === 'inactive') {
        void supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      subscription.remove();
      void supabase.auth.stopAutoRefresh();
    };
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    <SessionContext.Provider value={{ user, session, initialized, refreshUser }}>
      {children}
    </SessionContext.Provider>
  );
};
