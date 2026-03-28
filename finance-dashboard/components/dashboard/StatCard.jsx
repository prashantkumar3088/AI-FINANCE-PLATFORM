import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

export function StatCard({ title, value, trend, trendLabel }) {
  const isPositive = trend >= 0

  return (
    <Card className="bg-[oklch(0.18_0.01_260)] border-none shadow-sm shadow-[oklch(0.12_0.01_260)]/50">
      <CardContent className="p-6">
        <p className="text-xs font-semibold tracking-wider text-[oklch(0.65_0.01_260)] uppercase mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-[oklch(0.985_0_0)] mb-2">{value}</h3>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-[oklch(0.70_0.15_150)]' : 'text-[oklch(0.60_0.20_20)]'}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{isPositive ? '+' : ''}{trend}%</span>
          </div>
          {trendLabel && <span className="text-xs text-[oklch(0.65_0.01_260)]">{trendLabel}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
