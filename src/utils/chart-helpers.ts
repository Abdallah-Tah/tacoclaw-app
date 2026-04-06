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
    .map((trade, index) => {
      cumulativePnL += trade.pnl;
      return {
        time: new Date(trade.timestamp).toLocaleDateString(),
        value: cumulativePnL,
        index
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
