"use client";

import React, { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { InsightCard } from "@/components/finance/InsightCard"
import dynamic from 'next/dynamic'
const SpendingChart = dynamic(() => import("@/components/charts/SpendingChart").then(mod => mod.SpendingChart), { ssr: false })
import { useAuth } from "@/context/AuthContext"
import { apiService } from "@/lib/api-service"
import { Loader2, TrendingUp, TrendingDown, Target, HelpCircle, Sparkles } from "lucide-react"

export default function InsightsPage() {
  const { user } = useAuth()
  const [insights, setInsights] = useState<any[]>([])
  const [advice, setAdvice] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    // Show UI instantly instead of blocking the whole page
    setLoading(false)

    // Load AI in the background
    Promise.all([
      apiService.getInsights(user!.uid),
      apiService.getAdvice(user!.uid)
    ]).then(([insightsData, advisorData]) => {
      const formattedInsights = (insightsData.insights || []).map((ins: any, i: number) => ({
        id: i,
        title: ins.type === 'alert' ? "Spending Alert" : "Optimization Opportunity",
        description: ins.message,
        type: ins.type || 'info', 
        category: ins.category || 'General',
        impact: ins.type === 'alert' ? 'High' : 'Medium'
      }))

      setInsights(formattedInsights)
      setAdvice(advisorData)
    }).catch(error => {
      console.error("Failed to fetch insights:", error)
    })
  }

  return (
    <DashboardLayout>
      <TopNavbar title="Financial Insights" />
      
      <div className="p-8 space-y-8 max-w-[1200px] mx-auto pb-24">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-6">
             <Loader2 className="animate-spin text-[oklch(0.50_0.20_250)]" size={48} />
             <p className="text-[oklch(0.65_0.01_260)] font-medium">Running FinAI Brain Scan...</p>
          </div>
        ) : (
          <>
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[oklch(0.985_0_0)] mb-1">Analysis Overview</h2>
                <p className="text-[oklch(0.65_0.01_260)]">Personalized AI analysis based on your activity this month.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-[oklch(0.65_0.01_260)]">AI Advisor Status</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[oklch(0.70_0.15_150)]/20 text-[oklch(0.70_0.15_150)]">Active</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-[oklch(0.985_0_0)]">Optimizing</span>
                  </div>
                  <p className="text-sm text-[oklch(0.65_0.01_260)] leading-relaxed">
                    {advice?.advice || "Your AI Advisor is scanning for new patterns."}
                  </p>
                </div>

                <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6">
                   <div className="flex items-center gap-2 mb-4">
                      <Target className="text-[oklch(0.60_0.18_30)]" size={20} />
                      <span className="text-sm font-medium text-[oklch(0.65_0.01_260)]">Goal Analysis</span>
                   </div>
                   <h3 className="text-2xl font-bold text-[oklch(0.985_0_0)] mb-2">Steady Progress</h3>
                   <p className="text-sm text-[oklch(0.65_0.01_260)]">You are moving toward your long-term goals at a consistent pace.</p>
                </div>

                <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6">
                   <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="text-[oklch(0.70_0.15_150)]" size={20} />
                      <span className="text-sm font-medium text-[oklch(0.65_0.01_260)]">Savings Forecast</span>
                   </div>
                   <h3 className="text-2xl font-bold text-[oklch(0.70_0.15_150)] mb-2">+ ₹2,500</h3>
                   <p className="text-sm text-[oklch(0.65_0.01_260)]">Anticipated increase in residual income if trends continue.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[oklch(0.985_0_0)] mb-4 mt-8">AI Recommendations</h2>
              <div className="space-y-4">
                {insights.length > 0 ? (
                  insights.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))
                ) : (
                  <div className="p-8 border border-dashed border-[oklch(0.25_0.02_260)] rounded-2xl text-center">
                    <HelpCircle className="mx-auto text-[oklch(0.25_0.02_260)] mb-3" size={32} />
                    <p className="text-[oklch(0.65_0.01_260)] animate-pulse">Analyzing your transactions and generating AI insights...</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
