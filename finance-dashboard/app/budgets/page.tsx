import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { mockBudgets } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, AlertTriangle, Info, Sparkles } from "lucide-react"

export default function BudgetsPage() {
  return (
    <DashboardLayout>
      <TopNavbar 
        title="Monthly Budget Planner"
        actions={
          <Button className="bg-[oklch(0.50_0.20_250)] hover:bg-[oklch(0.55_0.20_250)] text-white gap-2 rounded-full">
            <Plus size={16} /> New Category
          </Button>
        } 
      />
      
      <div className="p-8 space-y-6 max-w-[1400px] mx-auto pb-24">
        <p className="text-[oklch(0.65_0.01_260)] mb-8 -mt-4">Manage your allocations and track spending limits for October 2023.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             {/* Top Summary Blocks */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-5">
                   <p className="text-xs font-semibold tracking-wider text-[oklch(0.65_0.01_260)] uppercase mb-2">Total Budget</p>
                   <h3 className="text-3xl font-bold text-[oklch(0.985_0_0)]">$4,500.00</h3>
                </div>
                <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-5">
                   <p className="text-xs font-semibold tracking-wider text-[oklch(0.65_0.01_260)] uppercase mb-2">Spent</p>
                   <h3 className="text-3xl font-bold text-[oklch(0.50_0.20_250)]">$2,840.12</h3>
                </div>
                <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-5">
                   <p className="text-xs font-semibold tracking-wider text-[oklch(0.65_0.01_260)] uppercase mb-2">Remaining</p>
                   <h3 className="text-3xl font-bold text-[oklch(0.70_0.15_150)]">$1,659.88</h3>
                </div>
             </div>

             {/* Category Allocations */}
             <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[oklch(0.985_0_0)] mb-6">Category Allocations</h3>
                <div className="space-y-8">
                   {mockBudgets.map((budget) => {
                      const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
                      const isOverBudget = budget.spent > budget.limit;

                      // Decide what to render for icon
                      const renderIcon = () => {
                        switch(budget.icon) {
                          case 'utensils': return <span className="text-xl">🍽️</span>;
                          case 'plane': return <span className="text-xl">✈️</span>;
                          case 'shopping-bag': return <span className="text-xl">🛍️</span>;
                          case 'zap': return <span className="text-xl">⚡</span>;
                          case 'film': return <span className="text-xl">🎬</span>;
                          default: return <Info size={20} />;
                        }
                      };

                      return (
                         <div key={budget.id} className={`p-5 rounded-2xl bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] ${isOverBudget ? 'border-[oklch(0.60_0.20_20)]/50' : ''}`}>
                            <div className="flex items-center justify-between mb-4">
                               <div className="flex items-center gap-4">
                                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${budget.color}/20 text-${budget.color.replace('bg-', '')}`}>
                                     {renderIcon()}
                                  </div>
                                  <div>
                                     <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-[oklch(0.985_0_0)] text-base">{budget.category}</h4>
                                        {isOverBudget && (
                                           <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[oklch(0.60_0.20_20)] text-white">
                                              Over Budget
                                           </span>
                                        )}
                                     </div>
                                     <p className="text-sm text-[oklch(0.65_0.01_260)]">{percentage.toFixed(0)}% of limit reached</p>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <p className={`font-bold text-lg ${isOverBudget ? 'text-[oklch(0.60_0.20_20)]' : 'text-[oklch(0.985_0_0)]'}`}>
                                     ${budget.spent.toFixed(2)}
                                  </p>
                                  <p className="text-sm text-[oklch(0.65_0.01_260)] font-medium">Limit: ${budget.limit.toFixed(2)}</p>
                               </div>
                            </div>
                            
                            <div className="relative mt-2">
                               <div className="h-3 w-full bg-[oklch(0.25_0.02_260)] rounded-full overflow-hidden">
                                  <div 
                                     className={`h-full rounded-full ${isOverBudget ? 'bg-[oklch(0.60_0.20_20)]' : budget.color}`} 
                                     style={{ width: `${percentage}%` }}
                                  ></div>
                               </div>
                               <div 
                                  className="absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-[oklch(0.50_0.20_250)] rounded-full border-2 border-[oklch(0.18_0.01_260)] shadow shadow-black/50 cursor-grab"
                                  style={{ left: `calc(${percentage}% - 10px)` }}
                               ></div>
                            </div>
                         </div>
                      )
                   })}
                </div>
             </div>
          </div>

          <div className="space-y-6">
             {/* FinAI Recommendations */}
             <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                   <Sparkles className="text-[oklch(0.50_0.20_250)]" size={20} />
                   <h3 className="text-lg font-bold text-[oklch(0.985_0_0)]">FinAI Recommendations</h3>
                </div>

                <div className="space-y-4">
                   <div className="p-4 rounded-xl bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)]">
                      <div className="flex items-center gap-2 mb-2">
                         <TrendingUp size={16} className="text-[oklch(0.70_0.15_150)]" />
                         <h4 className="font-semibold text-[oklch(0.985_0_0)] text-sm">Increase Savings</h4>
                      </div>
                      <p className="text-xs text-[oklch(0.65_0.01_260)] mb-3 leading-relaxed">Based on your spending, you can move $200 from Travel to Savings this month.</p>
                      <button className="text-xs font-semibold text-[oklch(0.50_0.20_250)] hover:text-white transition-colors">Apply Adjustment ›</button>
                   </div>

                   <div className="p-4 rounded-xl bg-[oklch(0.145_0_0)] border border-[oklch(0.60_0.20_20)]/30 border">
                      <div className="flex items-center gap-2 mb-2">
                         <AlertTriangle size={16} className="text-[oklch(0.60_0.20_20)]" />
                         <h4 className="font-semibold text-[oklch(0.985_0_0)] text-sm">Shopping Alert</h4>
                      </div>
                      <p className="text-xs text-[oklch(0.65_0.01_260)] mb-3 leading-relaxed">You've exceeded your shopping budget by 12%. I recommend reducing Entertainment by $60 to balance.</p>
                      <button className="text-xs font-semibold text-[oklch(0.60_0.20_20)] hover:text-red-400 transition-colors">Rebalance Now ›</button>
                   </div>

                   <div className="p-4 rounded-xl bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)]">
                      <div className="flex items-center gap-2 mb-2">
                         <Info size={16} className="text-[oklch(0.50_0.20_250)]" />
                         <h4 className="font-semibold text-[oklch(0.985_0_0)] text-sm">Subscription Check</h4>
                      </div>
                      <p className="text-xs text-[oklch(0.65_0.01_260)] mb-3 leading-relaxed">I found 3 overlapping streaming subscriptions. Canceling 2 could save you $34.99/mo.</p>
                      <button className="text-xs font-semibold text-[oklch(0.50_0.20_250)] hover:text-white transition-colors">View Subscriptions ›</button>
                   </div>
                </div>

                <div className="mt-6 p-5 rounded-2xl bg-[oklch(0.50_0.20_250)] flex items-center justify-between shadow-lg shadow-[oklch(0.50_0.20_250)]/20">
                   <div>
                      <p className="text-xs font-bold text-white/80 uppercase tracking-widest mb-1">AI CONFIDENCE</p>
                      <p className="text-4xl font-bold text-white">98%</p>
                   </div>
                   <TrendingUp className="text-white/60" size={48} />
                </div>
             </div>

             {/* Upcoming Due Dates */}
             <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
                <h3 className="text-[oklch(0.985_0_0)] font-bold mb-4">Upcoming Due Dates</h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                         <div className="h-2 w-2 rounded-full bg-[oklch(0.50_0.20_250)]"></div>
                         <span className="text-[oklch(0.985_0_0)] font-medium">Internet Bill</span>
                      </div>
                      <span className="text-[oklch(0.985_0_0)] font-bold">Oct 14</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                         <div className="h-2 w-2 rounded-full bg-[oklch(0.60_0.18_30)]"></div>
                         <span className="text-[oklch(0.985_0_0)] font-medium">Car Insurance</span>
                      </div>
                      <span className="text-[oklch(0.985_0_0)] font-bold">Oct 18</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                         <div className="h-2 w-2 rounded-full bg-[oklch(0.65_0.01_260)]"></div>
                         <span className="text-[oklch(0.985_0_0)] font-medium">Cloud Storage</span>
                      </div>
                      <span className="text-[oklch(0.985_0_0)] font-bold">Oct 22</span>
                   </div>
                </div>
             </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
