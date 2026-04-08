import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

export const useEquityHistory = (timeframe: string = 'ALL') => {
  return useQuery({
    queryKey: ['equityHistory', timeframe],
    queryFn: async () => {
      const { data } = await apiClient.get(`/equity/history?timeframe=${timeframe}`);
      return data;
    },
    refetchInterval: 60000, // Refetch every minute
  });
};
