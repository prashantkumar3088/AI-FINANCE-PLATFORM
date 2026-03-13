import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { AlertCard } from "@/components/finance/AlertCard"
import { mockAlerts } from "@/lib/mock-data"

export default function AlertsPage() {
  return (
    <DashboardLayout>
      <TopNavbar title="Fraud Detection Alerts" />
      
      <div className="p-8 space-y-6 max-w-[1200px] mx-auto pb-24">
        <p className="text-[oklch(0.65_0.01_260)] mb-8 -mt-4">Review recent suspicious activities on your accounts</p>
        
        {/* Sub-navigation tabs */}
        <div className="flex gap-8 border-b border-[oklch(0.25_0.02_260)] mb-8 pb-1">
           <button className="text-[oklch(0.50_0.20_250)] font-bold text-sm h-10 border-b-2 border-[oklch(0.50_0.20_250)] pb-2 relative top-[2px]">
              All Alerts (12)
           </button>
           <button className="text-[oklch(0.65_0.01_260)] hover:text-[oklch(0.985_0_0)] font-semibold text-sm h-10 pb-2 transition-colors">
              Pending Review (3)
           </button>
           <button className="text-[oklch(0.65_0.01_260)] hover:text-[oklch(0.985_0_0)] font-semibold text-sm h-10 pb-2 transition-colors">
              Resolved (9)
           </button>
        </div>

        <div className="space-y-6">
          {mockAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>

      </div>
    </DashboardLayout>
  )
}
