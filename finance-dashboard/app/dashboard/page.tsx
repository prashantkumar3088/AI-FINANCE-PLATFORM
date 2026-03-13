import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { StatCard } from "@/components/dashboard/StatCard"
import { BalanceChart } from "@/components/charts/BalanceChart"
import { SpendingChart } from "@/components/charts/SpendingChart"
import { InsightCard } from "@/components/finance/InsightCard"
import { TransactionTable } from "@/components/finance/TransactionTable"
import { mockBalanceHistory, mockSpendingHistory, mockInsights, mockTransactions } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Plus, Minus, TrendingUp, ArrowRightLeft, Sparkles } from "lucide-react"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <TopNavbar 
        title="Dashboard" 
        actions={
          <Button className="bg-[oklch(0.50_0.20_250)] hover:bg-[oklch(0.55_0.20_250)] text-white gap-2">
            <Plus size={16} /> Quick Add
          </Button>
        } 
      />
      
      <div className="p-8 space-y-6 max-w-[1600px] mx-auto pb-24">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="TOTAL NET WORTH" value="$124,500.00" trend={2.4} trendLabel="vs last month" />
          <StatCard title="MONTHLY INCOME" value="$8,250.00" trend={1.2} />
          <StatCard title="MONTHLY EXPENSES" value="$4,120.00" trend={-0.5} />
          <StatCard title="SAVINGS RATE" value="50.1%" trend={3.0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[oklch(0.985_0_0)]">Balance Over Time</h3>
                <div className="bg-[oklch(0.25_0.02_260)] text-[oklch(0.985_0_0)] text-xs font-medium px-3 py-1.5 rounded-lg border border-[oklch(0.25_0.02_260)]">
                  Last 6 Months
                </div>
              </div>
              <BalanceChart data={mockBalanceHistory} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI Insights Widget */}
              <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[oklch(0.985_0_0)]">AI Financial Insights</h3>
                  <Sparkles size={18} className="text-[oklch(0.50_0.20_250)]" />
                </div>
                <div className="space-y-4 flex-1">
                  {mockInsights.slice(0, 2).map((insight) => (
                    <div key={insight.id} className="p-4 rounded-xl bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)]">
                      <h4 className={`font-semibold mb-1 ${
                        insight.type === 'opportunity' ? 'text-[oklch(0.50_0.20_250)]' : 
                        insight.type === 'success' ? 'text-[oklch(0.70_0.15_150)]' :
                        'text-[oklch(0.60_0.18_30)]'
                      }`}>{insight.title}</h4>
                      <p className="text-sm text-[oklch(0.65_0.01_260)]">{insight.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions Widget */}
              <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[oklch(0.985_0_0)] mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4 h-full pb-8">
                  <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] text-[oklch(0.65_0.01_260)] hover:text-[oklch(0.985_0_0)] hover:border-[oklch(0.50_0.20_250)] transition-colors">
                    <div className="h-10 w-10 rounded-full bg-[oklch(0.25_0.02_260)] flex items-center justify-center text-[oklch(0.985_0_0)]">
                      <Plus size={20} />
                    </div>
                    <span className="text-sm font-medium">Add Income</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] text-[oklch(0.65_0.01_260)] hover:text-[oklch(0.985_0_0)] hover:border-[oklch(0.50_0.20_250)] transition-colors">
                    <div className="h-10 w-10 rounded-full bg-[oklch(0.25_0.02_260)] flex items-center justify-center text-[oklch(0.985_0_0)]">
                      <Minus size={20} />
                    </div>
                    <span className="text-sm font-medium">Add Expense</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] text-[oklch(0.65_0.01_260)] hover:text-[oklch(0.985_0_0)] hover:border-[oklch(0.50_0.20_250)] transition-colors">
                    <div className="h-10 w-10 rounded-full bg-[oklch(0.25_0.02_260)] flex items-center justify-center text-[oklch(0.985_0_0)]">
                      <TrendingUp size={20} />
                    </div>
                    <span className="text-sm font-medium">Investment</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] text-[oklch(0.65_0.01_260)] hover:text-[oklch(0.985_0_0)] hover:border-[oklch(0.50_0.20_250)] transition-colors">
                     <div className="h-10 w-10 rounded-full bg-[oklch(0.25_0.02_260)] flex items-center justify-center text-[oklch(0.985_0_0)]">
                      <ArrowRightLeft size={20} />
                    </div>
                    <span className="text-sm font-medium">Transfer</span>
                  </button>
                </div>
              </div>
            </div>
            
            <TransactionTable transactions={mockTransactions} />
          </div>

          {/* Side Panel Area */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-[oklch(0.985_0_0)]">Income vs Expenses</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                <div>
                  <div className="flex justify-between text-sm mb-1 text-[oklch(0.65_0.01_260)] font-medium">
                    <span>Income</span>
                    <span className="text-[oklch(0.70_0.15_150)] font-bold">$8,250</span>
                  </div>
                  <div className="h-2 w-full bg-[oklch(0.145_0_0)] rounded-full overflow-hidden">
                    <div className="h-full bg-[oklch(0.70_0.15_150)] rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1 text-[oklch(0.65_0.01_260)] font-medium">
                    <span>Expenses</span>
                    <span className="text-[oklch(0.50_0.20_250)] font-bold">$4,120</span>
                  </div>
                  <div className="h-2 w-full bg-[oklch(0.145_0_0)] rounded-full overflow-hidden">
                    <div className="h-full bg-[oklch(0.50_0.20_250)] rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1 text-[oklch(0.65_0.01_260)] font-medium">
                    <span>Debt Repayment</span>
                    <span className="text-[oklch(0.80_0.10_80)] font-bold">$1,200</span>
                  </div>
                  <div className="h-2 w-full bg-[oklch(0.145_0_0)] rounded-full overflow-hidden">
                    <div className="h-full bg-[oklch(0.80_0.10_80)] rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] flex items-center gap-4">
                <div className="h-16 w-16 rounded-full border-4 border-[oklch(0.70_0.15_150)] flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-[oklch(0.985_0_0)]">82%</span>
                </div>
                <div>
                  <h4 className="font-bold text-[oklch(0.985_0_0)]">Health Score</h4>
                  <p className="text-sm text-[oklch(0.65_0.01_260)]">Exceeding goals</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
               <div className="flex items-center justify-between mb-2">
                 <h3 className="text-lg font-bold text-[oklch(0.985_0_0)]">Spending Trend</h3>
              </div>
              <p className="text-sm text-[oklch(0.65_0.01_260)] mb-2">Weekly breakdown of expenses vs. budget</p>
              <SpendingChart data={mockSpendingHistory} />
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
