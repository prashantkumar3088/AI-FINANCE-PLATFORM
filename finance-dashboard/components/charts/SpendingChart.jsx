"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, YAxis } from "recharts"

export function SpendingChart({ data }) {
  const standardColor = "oklch(0.25 0.05 250)"
  const highlightColor = "oklch(0.50 0.20 250)"
  const overBudgetColor = "oklch(0.60 0.20 20)"

  return (
    <div className="h-[240px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'oklch(0.65 0.01 260)', fontSize: 10 }}
            dy={10}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ 
              backgroundColor: 'oklch(0.18 0.01 260)', 
              borderColor: 'oklch(0.25 0.02 260)',
              borderRadius: '8px',
              color: 'oklch(0.985 0 0)'
            }}
            formatter={(value, name) => [
              `$${value}`, 
              name === 'value' ? 'Spent' : 'Budget'
            ]}
          />
          <Bar 
            dataKey="value" 
            radius={[6, 6, 6, 6]} 
            barSize={40}
          >
            {data.map((entry, index) => {
              let color = index === 5 ? highlightColor : standardColor;
              if (entry.value > entry.budget) {
                color = overBudgetColor;
              }
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
