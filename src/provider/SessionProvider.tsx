import { AppState } from 'react-native';
import { type Session, type User } from '@supabase/supabase-js';
import { createContext, type PropsWithChildren, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { logError } from '@/lib/logger';

type SessionContextProps = {
  user: User | null;
  session: Session | null;
  refreshUser: () => Promise<void>;
};

export const SessionContext = createContext<SessionContextProps>({
  user: null,
  session: null,
  refreshUser: async () => {},
});

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  const refreshUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      logError('Failed to refresh the signed-in user', error);
      return;
    }
    setUser(data.user);
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setInitialized(true);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  // A refresh timer left running in the background fires when the network is least likely to be there.
  useEffect(() => {
    void supabase.auth.startAutoRefresh();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void supabase.auth.startAutoRefresh();
      else if (state === 'background' || state === 'inactive') void supabase.auth.stopAutoRefresh();
    });

    return () => {
      subscription.remove();
      void supabase.auth.stopAutoRefresh();
    };
  }, []);

  // Rendering before the first auth event would flash every screen's signed-out state.
  if (!initialized) return null;

  return <SessionContext.Provider value={{ user, session, refreshUser }}>{children}</SessionContext.Provider>;
};
