/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  // react-native-worklets' `.native` builds need a TurboModule jest lacks; the resolver loads its plain build.
  resolver: 'react-native-worklets/jest/resolver.js',
  setupFiles: ['<rootDir>/jest.setup.ts'],
  // Packages beyond jest-expo's defaults that publish untranspiled source.
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|native-base|standard-navigation|heroui-native|uniwind|react-native-marked|lucide-react-native))',
  ],
  moduleNameMapper: {
    '^lucide-react-native$': '<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js',
  },
  // Agent worktrees under .claude/ are full copies; without this jest collects their tests too.
  modulePathIgnorePatterns: ['<rootDir>/.claude/'],
  // src/app/ is also refused by `yarn check:routes`; this only keeps a stray test there from running.
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/.claude/', '<rootDir>/src/app/'],
};
