import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

export const useEquityHistory = (timeframe: string = 'ALL') => {
  const { data: rawData, ...rest } = useQuery({
    queryKey: ['equityHistory'],
    queryFn: async () => {
      const { data } = await apiClient.get('/equity/history?timeframe=ALL');
      return data as { time: string; value: number }[];
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });

  const data = filterByTimeframe(rawData || [], timeframe);

  return { ...rest, data };
};

function filterByTimeframe(
  data: { time: string; value: number }[],
  timeframe: string
): { time: string; value: number }[] {
  if (!data || data.length === 0) return [];
  if (timeframe === 'ALL') return data;

  const now = new Date();
  let cutoff: Date;

  switch (timeframe) {
    case '1H':
      cutoff = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case '1D':
      cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '1W':
      cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '1M':
      cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      return data;
  }

  // Parse the time strings into Date objects for comparison
  // Format examples: "Apr 1", "04/01 00:06", "04/08 13:05"
  const currentYear = now.getFullYear();

  return data.filter((point) => {
    const parsed = parseTime(point.time, currentYear);
    return parsed >= cutoff;
  });
}

function parseTime(timeStr: string, year: number): Date {
  // Format: "MM/DD HH:MM"
  if (timeStr.includes('/')) {
    const [datePart, timePart] = timeStr.split(' ');
    const [month, day] = datePart.split('/').map(Number);
    const [hour, minute] = (timePart || '00:00').split(':').map(Number);
    return new Date(year, month - 1, day, hour || 0, minute || 0);
  }

  // Format: "Apr 1" (no time component - these are daily rollups)
  const d = new Date(`${timeStr} ${year}`);
  if (!isNaN(d.getTime())) return d;

  // Fallback: treat as recent
  return new Date(year, 0, 1);
}