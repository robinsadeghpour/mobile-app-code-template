import * as SecureStore from 'expo-secure-store';

// SecureStore caps a value at 2048 bytes, so a value is split: the base key holds the count, chunk i lives at `key.i`.
const CHUNK_SIZE = 1800;

const chunkKey = (key: string, index: number) => `${key}.${index}`;

const getChunkCount = async (key: string): Promise<number> => {
  const count = await SecureStore.getItemAsync(key);
  const parsed = count ? Number.parseInt(count, 10) : Number.NaN;
  return Number.isNaN(parsed) ? 0 : parsed;
};

const removeChunks = async (key: string, from: number, to: number) => {
  const deletions: Promise<void>[] = [];
  for (let i = from; i < to; i++) {
    deletions.push(SecureStore.deleteItemAsync(chunkKey(key, i)));
  }
  await Promise.all(deletions);
};

const setItem = async (key: string, value: string): Promise<void> => {
  const previousCount = await getChunkCount(key);

  const chunks: string[] = [];
  for (let i = 0; i < value.length; i += CHUNK_SIZE) {
    chunks.push(value.slice(i, i + CHUNK_SIZE));
  }

  await Promise.all(chunks.map((chunk, index) => SecureStore.setItemAsync(chunkKey(key, index), chunk)));
  await SecureStore.setItemAsync(key, String(chunks.length));

  if (previousCount > chunks.length) {
    await removeChunks(key, chunks.length, previousCount);
  }
};

const getItem = async (key: string): Promise<string | null> => {
  const count = await getChunkCount(key);

  if (count === 0) {
    return null;
  }

  const chunks = await Promise.all(
    Array.from({ length: count }, (_, index) => SecureStore.getItemAsync(chunkKey(key, index))),
  );

  if (chunks.some((chunk) => chunk === null)) {
    return null;
  }

  return chunks.join('');
};

const removeItem = async (key: string): Promise<void> => {
  const count = await getChunkCount(key);
  await removeChunks(key, 0, count);
  await SecureStore.deleteItemAsync(key);
};

export const secureStorageAdapter = {
  getItem,
  setItem,
  removeItem,
};
