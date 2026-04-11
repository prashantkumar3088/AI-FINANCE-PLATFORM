"use client";

import React, { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TopNavbar } from "@/components/layout/TopNavbar"
import dynamic from 'next/dynamic'
import { StatCard } from "@/components/dashboard/StatCard"
const BalanceChart = dynamic(() => import("@/components/charts/BalanceChart").then(mod => mod.BalanceChart), { ssr: false })
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { apiService } from "@/lib/api-service"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [data, setData] = useState({
    transactions: [],
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
      const expenses = await apiService.getExpenses(user.uid)

      const totalExp = expenses.reduce((acc, curr) => acc + curr.amount, 0)
      
      const formattedTransactions = expenses.map((t) => ({
        id: t.id,
        description: t.description || "No description",
        category: t.category,
        date: new Date(t.date).toLocaleDateString(),
        amount: t.amount,
        icon: t.category?.toLowerCase().includes('food') ? 'coffee' : 
              t.category?.toLowerCase().includes('shop') ? 'shopping-bag' : 'shopping-cart',
        color: t.category?.toLowerCase().includes('food') ? 'bg-orange-500/20 text-orange-500' : 
               t.category?.toLowerCase().includes('shop') ? 'bg-blue-500/20 text-blue-500' : 'bg-purple-500/20 text-purple-500'
      }))

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const weeklyData = days.map(day => ({ name: day, value: 0, budget: 500 }))
      expenses.forEach((t) => {
        const d = new Date(t.date)
        const dayName = days[d.getDay()]
        const weekDay = weeklyData.find(w => w.name === dayName)
        if (weekDay) weekDay.value += t.amount
      })

      const storedIncome = localStorage.getItem('monthlyIncome')
      const currentIncome = storedIncome ? parseFloat(storedIncome) : 8250;

      setData(prev => ({
        ...prev,
        transactions: formattedTransactions,
        totalExpenses: totalExp,
        weeklySpending: weeklyData,
        income: currentIncome,
        loading: false
      }))
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
            onClick={() => router.push('/expenses')}
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
             <p className="text-[oklch(0.65_0.01_260)]">Loading your data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="TOTAL BALANCE" value={`₹${(data.income - data.totalExpenses).toLocaleString()}`} trend={2.4} trendLabel="vs last month" />
              <StatCard 
                title="MONTHLY INCOME" 
                value={`₹${data.income.toLocaleString()}`} 
                trend={0} 
                action={
                  <button 
                    title="Update income"
                    onClick={() => {
                      const newIncome = prompt("Enter your new monthly income:", data.income);
                      if (newIncome && !isNaN(newIncome)) {
                        localStorage.setItem('monthlyIncome', newIncome);
                        setData(prev => ({ ...prev, income: parseFloat(newIncome) }));
                      }
                    }}
                    className="h-6 w-6 rounded-full bg-[oklch(0.50_0.20_250)]/10 text-[oklch(0.50_0.20_250)] border border-[oklch(0.50_0.20_250)]/30 flex items-center justify-center hover:bg-[oklch(0.50_0.20_250)] hover:text-white transition-all hover:scale-110"
                  >
                    <Plus size={14} />
                  </button>
                }
              />
              <StatCard title="MONTHLY EXPENSES" value={`₹${data.totalExpenses.toLocaleString()}`} trend={-0.5} />
              <StatCard title="SAVINGS RATE" value={`${savingsRate}%`} trend={3.0} />
            </div>

            <div className="space-y-6">
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
                  { name: 'Jun', value: Math.max(0, data.income - data.totalExpenses) },
                ]} />
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
