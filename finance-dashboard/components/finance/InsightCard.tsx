import { Insight } from "@/types"
import { PiggyBank, Zap, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export function InsightCard({ insight }: { insight: Insight }) {
  const getIconInfo = () => {
    switch (insight.type) {
      case "opportunity":
        return { icon: PiggyBank, color: "text-[oklch(0.50_0.20_250)]", bg: "bg-[oklch(0.50_0.20_250)]/20" }
      case "success":
        return { icon: Zap, color: "text-[oklch(0.70_0.15_150)]", bg: "bg-[oklch(0.70_0.15_150)]/20" }
      case "alert":
        return { icon: AlertTriangle, color: "text-[oklch(0.60_0.18_30)]", bg: "bg-[oklch(0.60_0.18_30)]/20" }
      default:
        return { icon: Info, color: "text-[oklch(0.80_0.10_80)]", bg: "bg-[oklch(0.80_0.10_80)]/20" }
    }
  }

  const { icon: Icon, color, bg } = getIconInfo()

  return (
    <div className="flex gap-4 p-5 rounded-2xl bg-[oklch(0.18_0.01_260)] shadow-sm border border-[oklch(0.25_0.02_260)] transition-transform hover:scale-[1.01]">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-[oklch(0.985_0_0)]">{insight.title}</h4>
            {insight.priority && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                insight.priority === 'high' ? 'bg-[oklch(0.50_0.20_250)]/20 text-[oklch(0.50_0.20_250)]' : 
                'bg-[oklch(0.60_0.18_30)]/20 text-[oklch(0.60_0.18_30)]'
              }`}>
                {insight.priority} Priority
              </span>
            )}
          </div>
          {insight.actionText && (
            <Button variant="secondary" size="sm" className="h-8 bg-[oklch(0.25_0.02_260)] text-[oklch(0.985_0_0)] hover:bg-[oklch(0.50_0.20_250)] hover:text-white transition-colors">
              {insight.actionText}
            </Button>
          )}
        </div>
        <p className="text-sm text-[oklch(0.65_0.01_260)] leading-relaxed">{insight.description}</p>
      </div>
    </div>
  )
}
