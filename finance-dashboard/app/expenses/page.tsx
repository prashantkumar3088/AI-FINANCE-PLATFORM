import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { TransactionTable } from "@/components/finance/TransactionTable"
import { mockTransactions } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Plus } from "lucide-react"

export default function ExpensesPage() {
  return (
    <DashboardLayout>
      <TopNavbar 
        title="Expense Tracker" 
        actions={
          <Button className="bg-[oklch(0.50_0.20_250)] hover:bg-[oklch(0.55_0.20_250)] text-white gap-2">
            <Plus size={16} /> Quick Transaction
          </Button>
        } 
      />
      
      <div className="p-8 space-y-6 max-w-[1600px] mx-auto pb-24">
        <p className="text-[oklch(0.65_0.01_260)] mb-6 -mt-4">Monitor your spending and manage your budget efficiently.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-[oklch(0.985_0_0)]">Monthly Spending Trend</h3>
               <div className="bg-[oklch(0.25_0.02_260)] text-[oklch(0.985_0_0)] text-xs font-medium px-3 py-1.5 rounded-lg border border-[oklch(0.25_0.02_260)]">
                  Last 6 Months
               </div>
             </div>
             {/* Note: In the screenshot this is an empty dark area, likely a placeholder for a chart */}
             <div className="h-[250px] w-full bg-[oklch(0.145_0_0)] rounded-xl border border-[oklch(0.25_0.02_260)] flex flex-col justify-end p-4">
                <div className="flex justify-between w-full text-xs text-[oklch(0.65_0.01_260)] border-t border-[oklch(0.25_0.02_260)] pt-2 mt-auto px-4">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                </div>
             </div>
          </div>

          {/* Category Distribution Area */}
          <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm text-center flex flex-col items-center">
             <h3 className="text-lg font-bold text-[oklch(0.985_0_0)] mb-6 w-full text-left">Category Distribution</h3>
             
             {/* Mocking a donut chart visually */}
             <div className="relative h-64 w-64 my-4 flex items-center justify-center">
               <div className="absolute inset-0 rounded-full border-[16px] border-[oklch(0.50_0.20_250)] border-r-[oklch(0.80_0.10_80)] border-t-[oklch(0.70_0.15_150)] border-l-[oklch(0.50_0.20_250)]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', transform: 'rotate(45deg)'}}></div>
               <div className="absolute inset-0 rounded-full border-[16px] border-[oklch(0.60_0.18_30)]" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 50% 100%)', transform: 'rotate(50deg)'}}></div>
               <div className="absolute inset-0 rounded-full border-[16px] border-[oklch(0.65_0.15_300)] border-t-transparent border-l-transparent border-b-transparent" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 50%)', transform: 'rotate(-25deg)'}}></div>
               
               <div className="h-48 w-48 rounded-full bg-[oklch(0.18_0.01_260)] z-10 flex flex-col items-center justify-center">
                 <span className="text-2xl font-bold text-[oklch(0.985_0_0)]">$4.2k</span>
                 <span className="text-sm text-[oklch(0.65_0.01_260)]">Total Spent</span>
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4 w-full mt-4 text-left text-sm">
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-[oklch(0.50_0.20_250)]"></div><span className="text-[oklch(0.65_0.01_260)]">Bills (40%)</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-[oklch(0.80_0.10_80)]"></div><span className="text-[oklch(0.65_0.01_260)]">Food (25%)</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-[oklch(0.70_0.15_150)]"></div><span className="text-[oklch(0.65_0.01_260)]">Shopping (20%)</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-[oklch(0.65_0.15_300)]"></div><span className="text-[oklch(0.65_0.01_260)]">Others (15%)</span></div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Expense Form Area */}
          <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
             <h3 className="text-lg font-bold text-[oklch(0.985_0_0)] mb-6 flex items-center gap-2">
               <Plus className="bg-[oklch(0.50_0.20_250)] text-white rounded-full p-0.5" size={20} />
               Add New Expense
             </h3>
             
             <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[oklch(0.65_0.01_260)] mb-1.5">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(0.65_0.01_260)]">$</span>
                    <input type="text" placeholder="0.00" className="w-full h-11 bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] rounded-xl pl-8 pr-4 text-[oklch(0.985_0_0)] focus:border-[oklch(0.50_0.20_250)] focus:ring-1 focus:ring-[oklch(0.50_0.20_250)] outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[oklch(0.65_0.01_260)] mb-1.5">Category</label>
                  <select className="w-full h-11 bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] rounded-xl px-3 text-[oklch(0.985_0_0)] appearance-none focus:border-[oklch(0.50_0.20_250)] focus:ring-1 focus:ring-[oklch(0.50_0.20_250)] outline-none transition-all cursor-pointer">
                    <option>Food & Dining</option>
                    <option>Travel</option>
                    <option>Shopping</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-[oklch(0.65_0.01_260)] mb-1.5">Date</label>
                     <div className="relative">
                        <input type="text" placeholder="mm/dd/yyyy" className="w-full h-11 bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] rounded-xl px-3 text-[oklch(0.985_0_0)] focus:border-[oklch(0.50_0.20_250)] focus:ring-1 focus:ring-[oklch(0.50_0.20_250)] outline-none transition-all text-sm" />
                        <CalendarIcon size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.65_0.01_260)]" />
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-[oklch(0.65_0.01_260)] mb-1.5">Time</label>
                     <div className="relative">
                        <input type="text" placeholder="--:--" className="w-full h-11 bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] rounded-xl px-3 text-[oklch(0.985_0_0)] focus:border-[oklch(0.50_0.20_250)] focus:ring-1 focus:ring-[oklch(0.50_0.20_250)] outline-none transition-all text-sm text-center" />
                     </div>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-[oklch(0.65_0.01_260)] mb-1.5">Notes (Optional)</label>
                   <textarea placeholder="Where did you spend it?" rows={3} className="w-full bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] rounded-xl p-3 text-[oklch(0.985_0_0)] resize-none focus:border-[oklch(0.50_0.20_250)] focus:ring-1 focus:ring-[oklch(0.50_0.20_250)] outline-none transition-all placeholder:text-[oklch(0.65_0.01_260)] text-sm"></textarea>
                </div>
             </form>

             {/* Mock user profile area at bottom left in the screenshot */}
             <div className="mt-8 pt-4 border-t border-[oklch(0.25_0.02_260)] flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[oklch(0.25_0.02_260)] overflow-hidden flex items-center justify-center text-xl">👩🏻‍💼</div>
                <div>
                   <p className="font-medium text-[oklch(0.985_0_0)] text-sm">Alex Rivera</p>
                   <p className="text-xs text-[oklch(0.65_0.01_260)]">Premium Plan</p>
                </div>
             </div>
          </div>

          <div className="lg:col-span-2">
            <TransactionTable transactions={mockTransactions} />
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
