import { notifyManager } from '@tanstack/react-query';


// AsyncStorage's native module does not exist under jest, and it is reached
// transitively: importing any screen that reads a stored flag pulls it in and
// the suite fails at import time. Its own in-memory mock stands in everywhere.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// react-query batches its notifications through a zero-delay timeout that fires
// after the test body has left act(), so every hook test would warn. Notifying
// synchronously keeps each update inside the act() that caused it.
notifyManager.setScheduler((notify) => notify());
