"use client";

import React, { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TopNavbar } from "@/components/layout/TopNavbar"
import dynamic from 'next/dynamic'
import { StatCard } from "@/components/dashboard/StatCard"
const BalanceChart = dynamic(() => import("@/components/charts/BalanceChart").then(mod => mod.BalanceChart), { ssr: false })
const SpendingChart = dynamic(() => import("@/components/charts/SpendingChart").then(mod => mod.SpendingChart), { ssr: false })
import { TransactionTable } from "@/components/finance/TransactionTable"
import { Button } from "@/components/ui/button"
import { Plus, Minus, TrendingUp, ArrowRightLeft, Sparkles, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { apiService } from "@/lib/api-service"
import { Transaction, Insight } from "@/types"

export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<{
    transactions: Transaction[],
    insights: Insight[],
    totalExpenses: number,
    weeklySpending: any[],
    income: number,
    loading: boolean
  }>({
    transactions: [],
    insights: [],
    totalExpenses: 0,
    weeklySpending: [],
    income: 8250,
    loading: true
  })

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true }))
      
      // Load fast expenses immediately
      const expenses = await apiService.getExpenses(user!.uid)

      const totalExp = expenses.reduce((acc: number, curr: any) => acc + curr.amount, 0)
      
      const formattedTransactions = expenses.map((t: any) => ({
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

      // Process Weekly Spending
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const weeklyData = days.map(day => ({ name: day, value: 0, budget: 500 }))
      
      expenses.forEach((t: any) => {
        const d = new Date(t.date)
        const dayName = days[d.getDay()]
        const weekDay = weeklyData.find(w => w.name === dayName)
        if (weekDay) weekDay.value += t.amount
      })

      // Turn off full-page loader immediately so user sees their data
      setData(prev => ({
        ...prev,
        transactions: formattedTransactions,
        totalExpenses: totalExp,
        weeklySpending: weeklyData,
        income: 8250,
        loading: false
      }))

      // Background fetch AI Insights gracefully 
      apiService.getInsights(user!.uid).then(insightsData => {
        const formattedInsights = (insightsData.insights || []).map((ins: any, i: number) => ({
          id: i,
          title: ins.type === 'alert' ? 'Spending Alert' : 'Strategy Update',
          description: ins.message,
          type: ins.type === 'alert' ? 'warning' : 'opportunity'
        }))
        setData(prev => ({ ...prev, insights: formattedInsights }))
      }).catch(err => console.error("AI Insights fetch failed:", err))

    } catch (error) {
      console.error("Dashboard load failed:", error)
      setData(prev => ({ ...prev, loading: false }))
    }
  }

  const savingsRate = ((data.income - data.totalExpenses) / data.income * 100).toFixed(1)

  return (
    <DashboardLayout>
      <TopNavbar 
        title="Dashboard" 
        actions={
          <Button 
            onClick={() => window.location.href = '/expenses'}
            className="bg-[oklch(0.50_0.20_250)] hover:bg-[oklch(0.55_0.20_250)] text-white gap-2 rounded-full px-6 shadow-lg shadow-[oklch(0.50_0.20_250)]/20"
          >
            <Plus size={16} /> Quick Add
          </Button>
        } 
      />
      
      <div className="p-8 space-y-6 max-w-[1600px] mx-auto pb-24">
        {data.loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4">
             <Loader2 className="animate-spin text-[oklch(0.50_0.20_250)]" size={48} />
             <p className="text-[oklch(0.65_0.01_260)]">Syncing with AI Engines...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="TOTAL BALANCE" value={`$${(data.income - data.totalExpenses).toLocaleString()}`} trend={2.4} trendLabel="vs last month" />
              <StatCard title="MONTHLY INCOME" value={`$${data.income.toLocaleString()}`} trend={0} />
              <StatCard title="MONTHLY EXPENSES" value={`$${data.totalExpenses.toLocaleString()}`} trend={-0.5} />
              <StatCard title="SAVINGS RATE" value={`${savingsRate}%`} trend={3.0} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-[oklch(0.985_0_0)]">Balance Over Time</h3>
                    <div className="bg-[oklch(0.25_0.02_260)] text-[oklch(0.985_0_0)] text-xs font-medium px-3 py-1.5 rounded-lg border border-[oklch(0.25_0.02_260)]">
                      Last 6 Months
                    </div>
                  </div>
                  <BalanceChart data={[
                    { name: 'Jan', value: 4000 },
                    { name: 'Feb', value: 3000 },
                    { name: 'Mar', value: 2000 },
                    { name: 'Apr', value: 2780 },
                    { name: 'May', value: 1890 },
                    { name: 'Jun', value: data.income - data.totalExpenses },
                  ]} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-[oklch(0.985_0_0)]">AI Financial Insights</h3>
                      <Sparkles size={18} className="text-[oklch(0.50_0.20_250)]" />
                    </div>
                    <div className="space-y-4 flex-1">
                      {data.insights.length > 0 ? data.insights.slice(0, 2).map((insight) => (
                        <div key={insight.id} className="p-4 rounded-xl bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)]">
                          <h4 className={`font-semibold mb-1 ${
                            insight.type === 'opportunity' ? 'text-[oklch(0.50_0.20_250)]' : 
                            insight.type === 'success' ? 'text-[oklch(0.70_0.15_150)]' :
                            'text-[oklch(0.60_0.18_30)]'
                          }`}>{insight.title}</h4>
                          <p className="text-sm text-[oklch(0.65_0.01_260)]">{insight.description}</p>
                        </div>
                      )) : (
                        <p className="text-sm text-[oklch(0.65_0.01_260)] italic">Predicting your future trends...</p>
                      )}
                    </div>
                  </div>

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
                
                <TransactionTable transactions={data.transactions} title="Live Transactions" />
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[oklch(0.985_0_0)] mb-6">Income vs Expenses</h3>
                  <div className="space-y-4 mb-8">
                    <div>
                      <div className="flex justify-between text-sm mb-1 text-[oklch(0.65_0.01_260)] font-medium">
                        <span>Income</span>
                        <span className="text-[oklch(0.70_0.15_150)] font-bold">${data.income.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-[oklch(0.145_0_0)] rounded-full overflow-hidden">
                        <div className="h-full bg-[oklch(0.70_0.15_150)] rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1 text-[oklch(0.65_0.01_260)] font-medium">
                        <span>Expenses</span>
                        <span className="text-[oklch(0.50_0.20_250)] font-bold">${data.totalExpenses.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-[oklch(0.145_0_0)] rounded-full overflow-hidden">
                        <div className="h-full bg-[oklch(0.50_0.20_250)] rounded-full" style={{ width: `${(data.totalExpenses / data.income * 100)}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full border-4 border-[oklch(0.70_0.15_150)] flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-[oklch(0.985_0_0)]">{savingsRate}%</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[oklch(0.985_0_0)]">Health Score</h4>
                      <p className="text-sm text-[oklch(0.65_0.01_260)]">{parseFloat(savingsRate) > 20 ? "Exceeding goals" : "Needs attention"}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[oklch(0.985_0_0)] mb-2">Spending Trend</h3>
                  <p className="text-sm text-[oklch(0.65_0.01_260)] mb-2">Weekly breakdown of expenses</p>
                  <SpendingChart data={data.weeklySpending} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
