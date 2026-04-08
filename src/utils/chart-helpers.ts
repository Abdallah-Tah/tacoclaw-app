export interface Trade {
  engine: string;
  pnl: number;
  timestamp: string;
  status: 'win' | 'loss';
}

export const calculateEquityCurve = (trades: Trade[]) => {
  let cumulativePnL = 0;
  return trades
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((trade) => {
      cumulativePnL += trade.pnl;
      return {
        time: new Date(trade.timestamp).toLocaleDateString(),
        value: cumulativePnL,
      };
    });
};

export const calculateWinLossDist = (trades: Trade[]) => {
  const wins = trades.filter(t => t.status === 'win').length;
  const losses = trades.filter(t => t.status === 'loss').length;

  return [
    { name: 'Wins', value: wins, color: '#22c55e' },
    { name: 'Losses', value: losses, color: '#ef4444' },
  ];
};

export const calculateDrawdown = (trades: Trade[]) => {
  let cumulativePnL = 0;
  let peak = 0;

  return trades
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((trade) => {
      cumulativePnL += trade.pnl;
      if (cumulativePnL > peak) peak = cumulativePnL;
      const drawdownPct = peak > 0 ? ((cumulativePnL - peak) / peak) * 100 : 0;
      return {
        time: new Date(trade.timestamp).toLocaleDateString(),
        value: Math.min(0, drawdownPct),
      };
    });
};

export const calculateTradeFrequency = (trades: Trade[]) => {
  const buckets: Record<string, { wins: number; losses: number }> = {};

  trades.forEach((trade) => {
    const date = new Date(trade.timestamp);
    const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!buckets[key]) buckets[key] = { wins: 0, losses: 0 };
    if (trade.status === 'win') buckets[key].wins++;
    else buckets[key].losses++;
  });

  return Object.entries(buckets)
    .slice(-14) // Last 14 days
    .map(([name, counts]) => ({ name, ...counts }));
};