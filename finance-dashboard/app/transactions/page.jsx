"use client";

import React, { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { TransactionTable } from "@/components/finance/TransactionTable"
import { useAuth } from "@/context/AuthContext"
import { apiService } from "@/lib/api-service"
import { Loader2, Calendar } from "lucide-react"

const formatMonth = (date) => {
  return new Date(date).toLocaleString("en-IN", { month: "long", year: "numeric" })
}

export default function TransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState("all")

  useEffect(() => {
    if (user) {
      loadTransactions()
    }
  }, [user])

  const loadTransactions = () => {
    setLoading(true)
    apiService.getAllTransactions(user.uid)
      .then(expenses => {
        // Filter out transactions with invalid or missing dates
        const validExpenses = expenses.filter(t => t.date && !isNaN(new Date(t.date).getTime()));
        
        const formatted = validExpenses.map((t) => ({
          id: t.id,
          description: t.description || "No description",
          category: t.category,
          date: t.date,  // keep raw date for month grouping
          displayDate: new Date(t.date).toLocaleDateString("en-IN"),
          amount: t.amount,
          icon: t.category?.toLowerCase().includes('food') ? 'coffee' :
                t.category?.toLowerCase().includes('shop') ? 'shopping-bag' : 'shopping-cart',
          color: t.category?.toLowerCase().includes('food') ? 'bg-orange-500/20 text-orange-500' :
                 t.category?.toLowerCase().includes('shop') ? 'bg-blue-500/20 text-blue-500' : 'bg-purple-500/20 text-purple-500'
        }))
        setTransactions(formatted)
      })
      .catch(error => console.error("Failed to load transactions:", error))
      .finally(() => setLoading(false))
  }

  // Build month options from transaction dates
  const monthKeys = [...new Set(
    transactions.map(t => {
      const d = new Date(t.date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    })
  )].sort((a, b) => b.localeCompare(a))

  const filteredTransactions = selectedMonth === "all"
    ? transactions.map(t => ({ ...t, date: t.displayDate }))
    : transactions
        .filter(t => {
          const d = new Date(t.date)
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
          return key === selectedMonth
        })
        .map(t => ({ ...t, date: t.displayDate }))

  const totalSpent = filteredTransactions.reduce((acc, t) => acc + Math.abs(t.amount), 0)

  return (
    <DashboardLayout>
      <TopNavbar title="Transaction History" />
      <div className="p-8 space-y-6 max-w-[1200px] mx-auto pb-24">
        <p className="text-[oklch(0.65_0.01_260)] -mt-4">Complete record of all your expenses across all time.</p>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-[oklch(0.50_0.20_250)]" size={40} />
            <p className="text-[oklch(0.65_0.01_260)]">Retrieving ledger...</p>
          </div>
        ) : (
          <>
            {/* Summary Bar */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-5">
                <p className="text-xs font-semibold tracking-wider text-[oklch(0.65_0.01_260)] uppercase mb-2">
                  {selectedMonth === "all" ? "All Time" : "This Period"}
                </p>
                <h3 className="text-2xl font-bold text-[oklch(0.985_0_0)]">₹{totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              </div>
              <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-5">
                <p className="text-xs font-semibold tracking-wider text-[oklch(0.65_0.01_260)] uppercase mb-2">Transactions</p>
                <h3 className="text-2xl font-bold text-[oklch(0.985_0_0)]">{filteredTransactions.length}</h3>
              </div>
              <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-5 hidden md:block">
                <p className="text-xs font-semibold tracking-wider text-[oklch(0.65_0.01_260)] uppercase mb-2">Avg. Transaction</p>
                <h3 className="text-2xl font-bold text-[oklch(0.985_0_0)]">
                  ₹{filteredTransactions.length > 0
                    ? (totalSpent / filteredTransactions.length).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : "0.00"}
                </h3>
              </div>
            </div>

            {/* Month Filter Tabs */}
            {monthKeys.length > 1 && (
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-[oklch(0.65_0.01_260)]">
                  <Calendar size={14} />
                  <span className="text-xs font-medium uppercase tracking-wider">Filter by month</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedMonth("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedMonth === "all"
                        ? "bg-[oklch(0.50_0.20_250)] text-white"
                        : "bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] text-[oklch(0.65_0.01_260)] hover:text-[oklch(0.985_0_0)]"
                    }`}
                  >
                    All Time
                  </button>
                  {monthKeys.map(mk => {
                    const [year, month] = mk.split("-")
                    const label = new Date(Number(year), Number(month) - 1, 1)
                      .toLocaleString("en-IN", { month: "short", year: "2-digit" })
                    return (
                      <button
                        key={mk}
                        onClick={() => setSelectedMonth(mk)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          selectedMonth === mk
                            ? "bg-[oklch(0.50_0.20_250)] text-white"
                            : "bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] text-[oklch(0.65_0.01_260)] hover:text-[oklch(0.985_0_0)]"
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <TransactionTable
              transactions={filteredTransactions}
              title={selectedMonth === "all" ? "All Transactions" : `Transactions — ${new Date(monthKeys.find(m => m === selectedMonth) ? `${selectedMonth}-01` : Date.now()).toLocaleString("en-IN", { month: "long", year: "numeric" })}`}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
