import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import { Trade } from '../utils/chart-helpers';

export const useBotStats = (botId: string) => {
  return useQuery({
    queryKey: ['botStats', botId],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/report');
      // Filter the global report for the specific bot
      const botTrades = data.filter((t: any) => t.engine === botId) as Trade[];
      
      const totalPnL = botTrades.reduce((sum, t) => sum + t.pnl, 0);
      const winRate = botTrades.length > 0 
        ? (botTrades.filter(t => t.status === 'win').length / botTrades.length) * 100 
        : 0;

      return {
        trades: botTrades,
        totalPnL,
        winRate,
        totalTrades: botTrades.length
      };
    },
  });
};
