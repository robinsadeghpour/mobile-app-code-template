import { QueryClient, type QueryClientConfig } from '@tanstack/react-query';

export function createTestQueryClient(config: QueryClientConfig = {}) {
  return new QueryClient({
    ...config,
    defaultOptions: {
      ...config.defaultOptions,
      queries: { gcTime: Infinity, ...config.defaultOptions?.queries },
      mutations: { gcTime: Infinity, ...config.defaultOptions?.mutations },
    },
  });
}
