import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { useUniwind } from 'uniwind';
import { setAppTheme, type ThemePreference } from '@/theme';

const STORAGE_KEY = 'app.color-mode';

interface ThemeContextValue {
  preference: ThemePreference;
  isDark: boolean;
  setPreference: (pref: ThemePreference) => void;
  toggleColorMode: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const { theme } = useUniwind();

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setPreferenceState(stored);
        setAppTheme(stored);
      }
    });
  }, []);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    setAppTheme(pref);
    void AsyncStorage.setItem(STORAGE_KEY, pref);
  }, []);

  const isDark = theme === 'dark';

  const toggleColorMode = useCallback(() => {
    setPreference(isDark ? 'light' : 'dark');
  }, [isDark, setPreference]);

  const value = useMemo(
    () => ({ preference, isDark, setPreference, toggleColorMode }),
    [preference, isDark, setPreference, toggleColorMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
