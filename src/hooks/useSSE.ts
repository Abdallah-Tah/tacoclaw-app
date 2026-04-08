import { useEffect } from 'react';
import { useDashboardStore } from '../store/useDashboardStore';

export const useSSE = () => {
  const addEvent = useDashboardStore((state) => state.addEvent);

  useEffect(() => {
    const eventSource = new EventSource('/api/events/stream');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        addEvent(data);
      } catch (e) {
        console.error('Error parsing SSE data:', e);
      }
    };

    eventSource.onerror = () => {
      // Auto-reconnect is handled by the browser
    };

    return () => {
      eventSource.close();
    };
  }, [addEvent]);
};