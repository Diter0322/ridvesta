import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,          // 30 seconds
      gcTime: 5 * 60 * 1000,         // 5 minutes (was cacheTime in v4)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default queryClient;
