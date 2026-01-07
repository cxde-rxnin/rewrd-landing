import { useEffect, useCallback, useState } from 'react';
import { wsService } from '@/services/websocket';

export function useWebSocket(accessToken?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    // Connect to WebSocket
    wsService.connect(accessToken);

    // Set up message handler
    const unsubscribeMessage = wsService.onMessage((data) => {
      setLastMessage(data);
    });

    // Set up connection status handlers
    const checkConnection = setInterval(() => {
      setIsConnected(wsService.isConnected());
    }, 1000);

    return () => {
      unsubscribeMessage();
      clearInterval(checkConnection);
      wsService.disconnect();
    };
  }, [accessToken]);

  const sendMessage = useCallback((data: any) => {
    wsService.send(data);
  }, []);

  const subscribe = useCallback((handler: (data: any) => void) => {
    return wsService.onMessage(handler);
  }, []);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    subscribe,
  };
}