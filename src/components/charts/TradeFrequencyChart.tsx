import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TradeFrequencyChartProps {
  data: { name: string; wins: number; losses: number }[];
}

export const TradeFrequencyChart: React.FC<TradeFrequencyChartProps> = ({ data }) => (
  <div className="w-full h-full min-h-[250px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,140,0,0.05)" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="rgba(255,255,255,0.2)"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          stroke="rgba(255,255,255,0.2)"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 9, 5, 0.9)',
            borderColor: 'rgba(255, 140, 0, 0.2)',
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontSize: '12px'
          }}
          cursor={{ fill: 'rgba(255, 140, 0, 0.05)' }}
        />
        <Bar dataKey="wins" fill="#22c55e" radius={[4, 4, 0, 0]} animationDuration={1500} />
        <Bar dataKey="losses" fill="#ef4444" radius={[4, 4, 0, 0]} animationDuration={1500} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);