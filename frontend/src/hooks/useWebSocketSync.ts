'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { apiClient } from '@/api/client';

export function useWebSocketSync() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!isAuthenticated || !token) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    // Determine WebSocket URL from apiClient baseURL
    const baseURL = apiClient.defaults.baseURL!;
    let wsEndpoint;
    
    if (baseURL.startsWith('http')) {
      const wsURLStr = baseURL.replace(/^http/, 'ws').replace(/\/api\/?$/, '');
      wsEndpoint = `${wsURLStr}/api/ws/sync?token=${token}`;
    } else {
      // Relative URL under proxy (e.g. "/api")
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      wsEndpoint = `${protocol}//${host}/api/ws/sync?token=${token}`;
    }

    const connect = () => {
      // Prevent multiple connections
      if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
        return;
      }

      console.log('Connecting to real-time sync...');
      const ws = new WebSocket(wsEndpoint);

      ws.onopen = () => {
        console.log('Real-time sync connected.');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'invalidate_habits') {
            console.log('Syncing data from another device...');
            queryClient.invalidateQueries({ queryKey: ['habits'] });
            queryClient.invalidateQueries({ queryKey: ['todayProgress'] });
            queryClient.invalidateQueries({ queryKey: ['weeklyProgress'] });
            // Re-check auth store (fetches /me to get updated XP/levels)
            useAuthStore.getState().checkAuth();
          }
        } catch (e) {
          console.error('Error parsing sync message', e);
        }
      };

      ws.onclose = (e) => {
        console.log('Real-time sync disconnected.', e.reason || '');
        // Attempt reconnection after 5 seconds if still authenticated
        if (useAuthStore.getState().isAuthenticated) {
          setTimeout(connect, 5000);
        }
      };

      wsRef.current = ws;
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isAuthenticated, queryClient]);
}
