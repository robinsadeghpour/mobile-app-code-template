import { notifyManager } from '@tanstack/react-query';

// AsyncStorage's native module does not exist under jest; its own in-memory mock stands in.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// No stylesheet is compiled under jest, so every theme colour would resolve to 'invalid'
// and each icon drawn with one would log a warning.
jest.mock('uniwind', () => ({
  ...jest.requireActual('uniwind'),
  useCSSVariable: (name: string | string[]) => (Array.isArray(name) ? name.map(() => '#000') : '#000'),
}));

// react-query batches notifications through a zero-delay timeout that fires after the test body
// has left act(). Notifying synchronously keeps each update inside the act() that caused it.
notifyManager.setScheduler((notify) => notify());
