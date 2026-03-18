"use client";

import React, { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TopNavbar } from "@/components/layout/TopNavbar"
const BalanceChart = dynamic(() => import("@/components/charts/BalanceChart").then(mod => mod.BalanceChart), { ssr: false })
const SpendingChart = dynamic(() => import("@/components/charts/SpendingChart").then(mod => mod.SpendingChart), { ssr: false })
import dynamic from 'next/dynamic'
import { useAuth } from "@/context/AuthContext"
import { apiService } from "@/lib/api-service"
import { Transaction } from "@/types"
import { TransactionTable } from "@/components/finance/TransactionTable"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"

export default function ExpensesPage() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Transaction[]>([])
  const [chartData, setChartData] = useState<{ weekly: any[], monthly: any[] }>({ weekly: [], monthly: [] })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Form State
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Food & Dining")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (user) {
      fetchExpenses()
    }
  }, [user])

  const fetchExpenses = () => {
    // Load data in background — page renders immediately
    setLoading(true)
    apiService.getExpenses(user!.uid)
      .then(data => {
        const formatted = data.map((t: any) => ({
          id: t.id,
          description: t.description || "No description",
          category: t.category,
          date: new Date(t.date).toLocaleDateString(),
          amount: t.amount,
          icon: t.category.toLowerCase().includes('food') ? 'coffee' : 
                t.category.toLowerCase().includes('shop') ? 'shopping-bag' : 'shopping-cart',
          color: t.category.toLowerCase().includes('food') ? 'bg-orange-500/20 text-orange-500' : 
                 t.category.toLowerCase().includes('shop') ? 'bg-blue-500/20 text-blue-500' : 'bg-purple-500/20 text-purple-500'
        }))
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const weekly = days.map(day => ({ name: day, value: 0, budget: 500 }))
        data.forEach((t: any) => {
          const d = new Date(t.date)
          const day = days[d.getDay()]
          const w = weekly.find(x => x.name === day)
          if (w) w.value += t.amount
        })

        setExpenses(formatted)
        setChartData({ weekly, monthly: [] })
      })
      .catch(error => console.error("Failed to fetch expenses:", error))
      .finally(() => setLoading(false))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !amount || !description) return

    try {
      setSubmitting(true)
      await apiService.addExpense({
        user_id: user.uid,
        amount: parseFloat(amount),
        category,
        description,
        date: new Date(date).toISOString()
      })
      
      setAmount("")
      setDescription("")
      fetchExpenses()
    } catch (error) {
      console.error("Failed to add expense:", error)
      alert("Error adding expense. Is the backend running?")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <TopNavbar 
        title="Expense Tracker" 
        actions={
          <Button 
            onClick={() => window.location.href='/budgets'}
            className="bg-[oklch(0.50_0.20_250)] hover:bg-[oklch(0.55_0.20_250)] text-white gap-2 rounded-full px-6"
          >
            <Plus size={16} /> Manage Budgets
          </Button>
        } 
      />
      
      <div className="p-8 space-y-6 max-w-[1600px] mx-auto pb-24">
        <p className="text-[oklch(0.65_0.01_260)] mb-6 -mt-4">Monitor your spending and manage your budget efficiently.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-[oklch(0.985_0_0)]">Weekly Spending Breakdown</h3>
               <div className="bg-[oklch(0.25_0.02_260)] text-[oklch(0.985_0_0)] text-xs font-medium px-3 py-1.5 rounded-lg border border-[oklch(0.25_0.02_260)]">
                  Active View
               </div>
             </div>
             <SpendingChart data={chartData.weekly} />
          </div>

          <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm text-center flex flex-col items-center">
             <h3 className="text-lg font-bold text-[oklch(0.985_0_0)] mb-6 w-full text-left">Category Distribution</h3>
             
             <div className="relative h-64 w-64 my-4 flex items-center justify-center">
               <div className="absolute inset-0 rounded-full border-[16px] border-[oklch(0.50_0.20_250)] border-r-[oklch(0.80_0.10_80)] border-t-[oklch(0.70_0.15_150)] border-l-[oklch(0.50_0.20_250)]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', transform: 'rotate(45deg)'}}></div>
               <div className="absolute inset-0 rounded-full border-[16px] border-[oklch(0.60_0.18_30)]" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 50% 100%)', transform: 'rotate(50deg)'}}></div>
               <div className="absolute inset-0 rounded-full border-[16px] border-[oklch(0.65_0.15_300)] border-t-transparent border-l-transparent border-b-transparent" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 50%)', transform: 'rotate(-25deg)'}}></div>
               
               <div className="h-48 w-48 rounded-full bg-[oklch(0.18_0.01_260)] z-10 flex flex-col items-center justify-center">
                 <span className="text-2xl font-bold text-[oklch(0.985_0_0)]">${expenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</span>
                 <span className="text-sm text-[oklch(0.65_0.01_260)]">Total Spent</span>
               </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
             <h3 className="text-lg font-bold text-[oklch(0.985_0_0)] mb-6 flex items-center gap-2">
               <Plus className="bg-[oklch(0.50_0.20_250)] text-white rounded-full p-0.5" size={20} />
               Add New Expense
             </h3>
             
             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[oklch(0.65_0.01_260)] mb-1.5">Description</label>
                  <input 
                    type="text" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Merchant or item" 
                    className="w-full h-11 bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] rounded-xl px-4 text-[oklch(0.985_0_0)] focus:border-[oklch(0.50_0.20_250)] focus:ring-1 focus:ring-[oklch(0.50_0.20_250)] outline-none transition-all" 
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[oklch(0.65_0.01_260)] mb-1.5">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(0.65_0.01_260)]">$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00" 
                      className="w-full h-11 bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] rounded-xl pl-8 pr-4 text-[oklch(0.985_0_0)] focus:border-[oklch(0.50_0.20_250)] focus:ring-1 focus:ring-[oklch(0.50_0.20_250)] outline-none transition-all" 
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[oklch(0.65_0.01_260)] mb-1.5">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] rounded-xl px-3 text-[oklch(0.985_0_0)] appearance-none focus:border-[oklch(0.50_0.20_250)] focus:ring-1 focus:ring-[oklch(0.50_0.20_250)] outline-none transition-all cursor-pointer"
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
                   <label className="block text-sm font-medium text-[oklch(0.65_0.01_260)] mb-1.5">Date</label>
                   <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-11 bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] rounded-xl px-3 text-[oklch(0.985_0_0)] focus:border-[oklch(0.50_0.20_250)] focus:ring-1 focus:ring-[oklch(0.50_0.20_250)] outline-none transition-all text-sm" 
                   />
                </div>

                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full h-11 bg-[oklch(0.50_0.20_250)] hover:bg-[oklch(0.55_0.20_250)] text-white rounded-xl font-bold transition-all"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : "Save Expense"}
                </Button>
             </form>
          </div>

          <div className="lg:col-span-2">
            {loading ? (
              <div className="h-64 flex items-center justify-center rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)]">
                <Loader2 className="animate-spin text-[oklch(0.50_0.20_250)]" size={32} />
              </div>
            ) : (
              <TransactionTable transactions={expenses} title="Real Transactions" />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
