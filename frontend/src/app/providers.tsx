'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode, useEffect } from 'react';
import { initTheme } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';

export function Providers({ children }: { children: ReactNode }) {
  const { checkAuth } = useAuthStore();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  // Restore dark/light theme and check auth on first render
  useEffect(() => {
    initTheme();
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}