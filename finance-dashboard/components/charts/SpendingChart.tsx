"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, YAxis } from "recharts"

interface SpendingChartProps {
  data: Array<{ name: string; value: number; budget: number }>
}

export function SpendingChart({ data }: SpendingChartProps) {
  // Use a softer blue for standard bars and bright blue for the highest/active
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
            formatter={(value: any, name: any) => [
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
              // Highlight Saturday (index 5 in mock data) as shown in screenshot
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
