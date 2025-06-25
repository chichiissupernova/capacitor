
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error && typeof error === 'object' && 'status' in error) {
          const status = error.status as number;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 1; // Reduced retry attempts for faster loading
      },
      staleTime: 2 * 60 * 1000, // Reduced stale time
      gcTime: 5 * 60 * 1000, // Reduced garbage collection time
    },
  },
});
