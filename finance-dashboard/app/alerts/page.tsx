"use client";

import React, { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { AlertCard } from "@/components/finance/AlertCard"
import { useAuth } from "@/context/AuthContext"
import { apiService } from "@/lib/api-service"
import { Loader2, ShieldCheck } from "lucide-react"

export default function AlertsPage() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await apiService.getAlerts(user!.uid)
      setAlerts(data || [])
    } catch (error) {
      console.error("Failed to fetch alerts:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <TopNavbar title="Fraud Detection Alerts" />
      
      <div className="p-8 space-y-6 max-w-[1200px] mx-auto pb-24">
        <p className="text-[oklch(0.65_0.01_260)] mb-8 -mt-4">Review recent suspicious activities on your accounts</p>
        
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-[oklch(0.50_0.20_250)]" size={40} />
            <p className="text-[oklch(0.65_0.01_260)]">Scanning transaction history...</p>
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-6">
            {alerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        ) : (
          <div className="p-16 border border-dashed border-[oklch(0.25_0.02_260)] rounded-3xl text-center">
             <ShieldCheck size={64} className="mx-auto text-[oklch(0.70_0.15_150)] mb-4" />
             <h3 className="text-xl font-bold text-[oklch(0.985_0_0)]">No Security Threats Found</h3>
             <p className="text-[oklch(0.65_0.01_260)] mt-2">All your recent transactions look secure and validated.</p>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
