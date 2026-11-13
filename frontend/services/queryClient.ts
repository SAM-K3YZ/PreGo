import { QueryClient } from '@tanstack/react-query';

// Single app-wide instance, so sign-out and session expiry can clear cached
// health data from outside React.
export const queryClient = new QueryClient({
  defaultOptions: { mutations: { retry: false } },
});
