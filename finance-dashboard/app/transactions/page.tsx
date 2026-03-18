"use client";

import React, { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { TransactionTable } from "@/components/finance/TransactionTable"
import { useAuth } from "@/context/AuthContext"
import { apiService } from "@/lib/api-service"
import { Transaction } from "@/types"
import { Loader2 } from "lucide-react"

export default function TransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadTransactions()
    }
  }, [user])

  const loadTransactions = () => {
    // Render page instantly
    setLoading(true)
    apiService.getExpenses(user!.uid)
      .then(expenses => {
        const formatted = expenses.map((t: any) => ({
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
        setTransactions(formatted)
      })
      .catch(error => console.error("Failed to load transactions:", error))
      .finally(() => setLoading(false))
  }

  return (
    <DashboardLayout>
      <TopNavbar title="All Transactions" />
      <div className="p-8 space-y-6 max-w-[1200px] mx-auto pb-24">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-[oklch(0.50_0.20_250)]" size={40} />
            <p className="text-[oklch(0.65_0.01_260)]">Retrieving ledger...</p>
          </div>
        ) : (
          <TransactionTable transactions={transactions} title="Transaction History" />
        )}
      </div>
    </DashboardLayout>
  )
}
