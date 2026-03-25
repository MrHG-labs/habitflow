'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode, useEffect } from 'react';
import { initTheme } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';
import { Toaster } from 'sonner';

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
      <Toaster 
        position="top-right" 
        richColors 
        expand={false} 
        duration={4000} 
        visibleToasts={3}
        closeButton
      />
      {children}
    </QueryClientProvider>
  );
}