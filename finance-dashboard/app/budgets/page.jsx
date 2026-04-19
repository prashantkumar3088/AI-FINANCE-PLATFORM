"use client";

import React, { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, AlertTriangle, Info, Sparkles, Loader2, Trash2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { apiService } from "@/lib/api-service"

export default function BudgetsPage() {
  const { user } = useAuth()
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState("Food & Dining")
  const [newLimit, setNewLimit] = useState("")
  const [creating, setCreating] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    // Render page immediately; fetch data in background
    apiService.getBudgets(user.uid)
      .then(data => setBudgets(data || []))
      .catch(error => console.error("Failed to fetch budgets:", error))
      .finally(() => setLoading(false))
  }

  const handleCreateBudget = async (e) => {
    e.preventDefault()
    if (!newCategory || !newLimit || !user) return

    try {
      setCreating(true)
      await apiService.createBudget(user.uid, newCategory, parseFloat(newLimit))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      setNewCategory("Food & Dining")
      setNewLimit("")
      fetchData()
    } catch (error) {
      console.error("Failed to create budget:", error)
      alert("Failed to create budget. Please check connection.")
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteBudget = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return
    try {
      await apiService.deleteBudget(id)
      fetchData()
    } catch (e) {
      alert("Failed to delete budget")
    }
  }

  const totals = budgets.reduce((acc, b) => ({
    limit: acc.limit + (b.limit ?? 0),
    spent: acc.spent + (b.spent ?? 0)
  }), { limit: 0, spent: 0 })

  return (
    <DashboardLayout>
      <TopNavbar 
        title="Monthly Budget Planner"
        actions={null} 
      />
      
      <div className="p-8 space-y-6 max-w-[1400px] mx-auto pb-24 relative">
        {success && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[oklch(0.70_0.15_150)] text-white px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 animate-in fade-in zoom-in duration-300">
             <div className="h-2 w-2 bg-white rounded-full animate-ping" />
             Budget Saved Successfully!
          </div>
        )}
        
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-[oklch(0.50_0.20_250)]" size={48} />
            <p className="text-[oklch(0.65_0.01_260)] font-medium">Calculating limits and allocations...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-5">
                     <p className="text-xs font-semibold tracking-wider text-[oklch(0.65_0.01_260)] uppercase mb-2">Total Budget</p>
                     <h3 className="text-3xl font-bold text-[oklch(0.985_0_0)]">₹  {totals.limit.toLocaleString()}</h3>
                  </div>
                  <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-5">
                     <p className="text-xs font-semibold tracking-wider text-[oklch(0.65_0.01_260)] uppercase mb-2">Spent</p>
                     <h3 className="text-3xl font-bold text-[oklch(0.50_0.20_250)]">₹  {totals.spent.toLocaleString()}</h3>
                  </div>
                  <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-5">
                     <p className="text-xs font-semibold tracking-wider text-[oklch(0.65_0.01_260)] uppercase mb-2">Remaining</p>
                     <h3 className="text-3xl font-bold text-[oklch(0.70_0.15_150)]">₹  {(totals.limit - totals.spent).toLocaleString()}</h3>
                  </div>
               </div>

               <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-lg font-bold text-[oklch(0.985_0_0)]">Category Allocations</h3>
                  </div>
                  <div className="space-y-8">
                     {budgets.length > 0 ? budgets.map((budget) => {
                        const spent = budget.spent ?? 0;
                        const lim = budget.limit ?? 0;
                        const percentage = lim > 0 ? Math.min((spent / lim) * 100, 100) : 0;
                        const isOverBudget = spent > lim;
                        const icon = budget.category === 'Food & Dining' ? '🍽️' : 
                                     budget.category === 'Transportation' ? '🚗' : 
                                     budget.category === 'Entertainment' ? '🎬' : '💰';

                        return (
                           <div key={budget.id} className={`p-5 rounded-2xl bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] ${isOverBudget ? 'border-[oklch(0.60_0.20_20)]/50' : ''}`}>
                              <div className="flex items-center justify-between mb-4">
                                 <div className="flex items-center gap-4">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.50_0.20_250)]/20 text-[oklch(0.50_0.20_250)]`}>
                                       <span className="text-xl">{icon}</span>
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
                                 <div className="flex items-center gap-4 text-right">
                                    <div>
                                       <p className={`font-bold text-lg ${isOverBudget ? 'text-[oklch(0.60_0.20_20)]' : 'text-[oklch(0.985_0_0)]'}`}>
                                          ₹{spent.toLocaleString()}
                                       </p>
                                       <p className="text-sm text-[oklch(0.65_0.01_260)] font-medium">Limit: ₹{lim.toLocaleString()}</p>
                                    </div>
                                    <button 
                                       onClick={() => handleDeleteBudget(budget.id)}
                                       className="text-[oklch(0.65_0.01_260)] hover:text-red-500 transition-colors p-2 rounded-full hover:bg-[oklch(0.18_0.01_260)]"
                                       title="Delete Budget"
                                    >
                                       <Trash2 size={18} />
                                    </button>
                                 </div>
                              </div>
                              
                              <div className="relative mt-2">
                                 <div className="h-3 w-full bg-[oklch(0.25_0.02_260)] rounded-full overflow-hidden">
                                    <div 
                                       className={`h-full rounded-full ${isOverBudget ? 'bg-[oklch(0.60_0.20_20)]' : 'bg-[oklch(0.50_0.20_250)]'}`} 
                                       style={{ width: `${percentage}%` }}
                                    ></div>
                                 </div>
                              </div>
                           </div>
                        )
                     }) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in duration-500">
                           <p className="text-[oklch(0.65_0.01_260)] font-medium">No budgets set yet. Start by adding a limit for a category!</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
                 <h3 className="text-lg font-bold text-[oklch(0.985_0_0)] mb-6 flex items-center gap-2">
                   <Plus className="bg-[oklch(0.50_0.20_250)] text-white rounded-full p-0.5" size={20} />
                   Add New Budget
                 </h3>
                 
                 <form onSubmit={handleCreateBudget} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[oklch(0.65_0.01_260)] mb-1.5">Category Name</label>
                      <select 
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full h-11 bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] rounded-xl px-3 text-[oklch(0.985_0_0)] appearance-none focus:border-[oklch(0.50_0.20_250)] focus:ring-1 focus:ring-[oklch(0.50_0.20_250)] outline-none transition-all cursor-pointer"
                        required
                      >
                        <option>Food & Dining</option>
                        <option>Transportation</option>
                        <option>Shopping</option>
                        <option>Entertainment</option>
                        <option>Bills</option>
                        <option>Health</option>
                        <option>Others</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[oklch(0.65_0.01_260)] mb-1.5">Monthly Limit</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(0.65_0.01_260)]">₹</span>
                        <input 
                          type="number" 
                          step="0.01"
                          value={newLimit}
                          onChange={(e) => setNewLimit(e.target.value)}
                          placeholder="0.00" 
                          className="w-full h-11 bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] rounded-xl pl-8 pr-4 text-[oklch(0.985_0_0)] focus:border-[oklch(0.50_0.20_250)] focus:ring-1 focus:ring-[oklch(0.50_0.20_250)] outline-none transition-all" 
                          required
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={creating}
                      className="w-full h-11 bg-[oklch(0.50_0.20_250)] hover:bg-[oklch(0.55_0.20_250)] text-white rounded-xl font-bold transition-all pt-0 mt-5"
                    >
                      {creating ? <Loader2 className="animate-spin" size={20} /> : "Save Budget"}
                    </Button>
                 </form>
               </div>

               <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                     <Sparkles className="text-[oklch(0.50_0.20_250)]" size={20} />
                     <h3 className="text-lg font-bold text-[oklch(0.985_0_0)]">AI Advisor</h3>
                  </div>

                  <div className="space-y-4">
                     <div className="p-4 rounded-xl bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)]">
                        <div className="flex items-center gap-2 mb-2">
                           <TrendingUp size={16} className="text-[oklch(0.70_0.15_150)]" />
                           <h4 className="font-semibold text-[oklch(0.985_0_0)] text-sm">Budget Tip</h4>
                        </div>
                        <p className="text-xs text-[oklch(0.65_0.01_260)] mb-3 leading-relaxed">Your spending on food is ₹2,000 above your usual. Consider a lower threshold next month.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}


