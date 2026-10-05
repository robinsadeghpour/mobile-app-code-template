import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { Uniwind } from 'uniwind';
import { THEME_PREFERENCES, type ThemePreference } from '@/theme';

const STORAGE_KEY = 'app.color-mode';

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  const apply = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    Uniwind.setTheme(next);
  }, []);

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      const saved = THEME_PREFERENCES.find((option) => option === stored);
      if (saved) apply(saved);
    });
  }, [apply]);

  const setPreference = useCallback(
    (next: ThemePreference) => {
      apply(next);
      void AsyncStorage.setItem(STORAGE_KEY, next);
    },
    [apply],
  );

  const value = useMemo(() => ({ preference, setPreference }), [preference, setPreference]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
