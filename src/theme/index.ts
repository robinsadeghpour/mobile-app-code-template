import { Uniwind } from 'uniwind';

// The theme whose file src/global.css imports. A theme is Uniwind's own `light`
// and `dark` variants, so `system` keeps following the device with no extra
// registration; `yarn theme:generate --activate` rewrites both places together.
export const APP_THEME = 'mono' as const;
export type ThemePreference = 'system' | 'light' | 'dark';

export function setAppTheme(pref: ThemePreference): void {
  Uniwind.setTheme(pref);
}
