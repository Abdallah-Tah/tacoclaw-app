import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface DrawdownChartProps {
  data: { time: string; value: number }[];
}

export const DrawdownChart: React.FC<DrawdownChartProps> = ({ data }) => (
  <div className="w-full h-full min-h-[250px]">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,140,0,0.05)" vertical={false} />
        <ReferenceLine y={0} stroke="rgba(255,140,0,0.2)" strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
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
          tickFormatter={(val) => `${val}%`}
          domain={['auto', 0]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 9, 5, 0.9)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontSize: '12px'
          }}
          itemStyle={{ color: '#ef4444' }}
          formatter={(value: any) => [`${Number(value).toFixed(2)}%`, 'Drawdown']}
          cursor={{ stroke: 'rgba(239, 68, 68, 0.2)', strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#ef4444"
          fillOpacity={1}
          fill="url(#colorDrawdown)"
          strokeWidth={2}
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);