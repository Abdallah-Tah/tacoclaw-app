import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EquityChartProps {
  data: { time: string; value: number }[];
  color?: string;
}

export const EquityChart: React.FC<EquityChartProps> = ({ data, color = '#FF8C00' }) => (
  <div className="w-full h-full min-h-[250px]">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,140,0,0.05)" vertical={false} />
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
          tickFormatter={(val) => `$${val}`}
          domain={['auto', 'auto']}
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
          itemStyle={{ color: color }}
          cursor={{ stroke: 'rgba(255,140,0,0.2)', strokeWidth: 1 }}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          fillOpacity={1} 
          fill="url(#colorEquity)" 
          strokeWidth={2}
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
