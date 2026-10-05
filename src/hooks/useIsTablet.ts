import { useWindowDimensions } from 'react-native';

// Must equal --breakpoint-tablet in src/global.css; useIsTablet.test.ts fails when they drift.
export const TABLET_BREAKPOINT = 700;

export const useIsTablet = () => useWindowDimensions().width >= TABLET_BREAKPOINT;
