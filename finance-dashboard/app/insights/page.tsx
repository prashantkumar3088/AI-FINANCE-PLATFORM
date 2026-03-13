import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { InsightCard } from "@/components/finance/InsightCard"
import { mockInsights, mockSpendingHistory } from "@/lib/mock-data"
import { SpendingChart } from "@/components/charts/SpendingChart"

export default function InsightsPage() {
  return (
    <DashboardLayout>
      <TopNavbar title="Financial Insights" />
      
      <div className="p-8 space-y-8 max-w-[1200px] mx-auto pb-24">
        
        {/* Analysis Overview Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[oklch(0.985_0_0)] mb-1">Analysis Overview</h2>
            <p className="text-[oklch(0.65_0.01_260)]">Personalized AI analysis based on your activity this month.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-[oklch(0.65_0.01_260)]">Monthly Health Score</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[oklch(0.70_0.15_150)]/20 text-[oklch(0.70_0.15_150)]">Improving</span>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-5xl font-bold text-[oklch(0.985_0_0)]">82</span>
                <span className="text-xl font-medium text-[oklch(0.65_0.01_260)]">/100</span>
              </div>
              <div className="h-2 w-full bg-[oklch(0.25_0.02_260)] rounded-full overflow-hidden mb-4">
                 <div className="h-full bg-[oklch(0.50_0.20_250)] rounded-full" style={{ width: '82%' }}></div>
              </div>
              <p className="text-sm text-[oklch(0.65_0.01_260)]">Your score is <span className="text-[oklch(0.70_0.15_150)] font-medium">5% higher</span> than last month. Good job on managing your utilities!</p>
            </div>

            <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="h-10 w-10 rounded-xl bg-[oklch(0.60_0.18_30)]/20 flex items-center justify-center text-[oklch(0.60_0.18_30)]">
                  <span className="text-xl">🍽️</span>
                </div>
                <div className="flex items-center gap-1 text-[oklch(0.80_0.10_80)] font-medium text-sm">
                  <span>~ 20%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-[oklch(0.65_0.01_260)] mb-1">Food & Dining</p>
              <h3 className="text-3xl font-bold text-[oklch(0.985_0_0)] mb-4">₹12,450</h3>
              <p className="text-sm text-[oklch(0.65_0.01_260)]">You spent 20% more on food this month compared to your 3-month average.</p>
            </div>

            <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="h-10 w-10 rounded-xl bg-[oklch(0.50_0.20_250)]/20 flex items-center justify-center text-[oklch(0.50_0.20_250)]">
                  <span className="text-xl">🎬</span>
                </div>
                <span className="text-sm font-medium text-[oklch(0.50_0.20_250)]">Target Saved</span>
              </div>
              <p className="text-sm font-medium text-[oklch(0.65_0.01_260)] mb-1">Potential Savings</p>
              <h3 className="text-3xl font-bold text-[oklch(0.70_0.15_150)] mb-4">₹4,000</h3>
              <p className="text-sm text-[oklch(0.65_0.01_260)]">Save this by reducing non-essential entertainment subscriptions.</p>
            </div>
          </div>
        </section>

        {/* Recommendations Section */}
        <section>
          <div className="flex items-center justify-between mb-4 mt-8">
            <h2 className="text-xl font-bold text-[oklch(0.985_0_0)]">Top Recommendations</h2>
            <button className="text-sm font-medium text-[oklch(0.50_0.20_250)] hover:text-white transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {mockInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </section>

        {/* Spending Trend Section */}
        <section className="mt-8">
          <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-8">
             <div className="flex items-center justify-between mb-2">
                <div>
                   <h3 className="text-xl font-bold text-[oklch(0.985_0_0)] mb-1">Spending Trend</h3>
                   <p className="text-[oklch(0.65_0.01_260)]">Weekly breakdown of expenses vs. budget</p>
                </div>
                <div className="flex gap-2">
                   <button className="px-3 py-1.5 rounded-lg bg-[oklch(0.25_0.02_260)] text-[oklch(0.65_0.01_260)] text-sm font-medium hover:text-[oklch(0.985_0_0)] transition-colors">1W</button>
                   <button className="px-3 py-1.5 rounded-lg bg-[oklch(0.50_0.20_250)] text-[oklch(0.985_0_0)] text-sm font-medium transition-colors">1M</button>
                   <button className="px-3 py-1.5 rounded-lg bg-[oklch(0.25_0.02_260)] text-[oklch(0.65_0.01_260)] text-sm font-medium hover:text-[oklch(0.985_0_0)] transition-colors">3M</button>
                </div>
             </div>
             <div className="mt-4 pt-4 border-t border-[oklch(0.25_0.02_260)]">
                {/* Increase height for the larger trend chart in the insights page */}
                <div className="h-[300px]">
                  <SpendingChart data={mockSpendingHistory} />
                </div>
             </div>
          </div>
        </section>

      </div>
    </DashboardLayout>
  )
}
