"use client"

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

export function BalanceChart({ data }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.50 0.20 250)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.50 0.20 250)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.25 0.02 260)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'oklch(0.65 0.01 260)', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'oklch(0.65 0.01 260)', fontSize: 12 }}
            tickFormatter={(value) => `₹${value / 1000}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'oklch(0.18 0.01 260)', 
              borderColor: 'oklch(0.25 0.02 260)',
              borderRadius: '8px',
              color: 'oklch(0.985 0 0)'
            }}
            itemStyle={{ color: 'oklch(0.50 0.20 250)' }}
            formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Balance']}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="oklch(0.50 0.20 250)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            activeDot={{ r: 6, fill: "oklch(0.50 0.20 250)", stroke: "oklch(0.18 0.01 260)", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
