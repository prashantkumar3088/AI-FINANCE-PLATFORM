import { Alert } from "@/types"
import { MapPin, Clock, CreditCard, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AlertCard({ alert }: { alert: Alert }) {
  const getStatusColor = () => {
    switch (alert.status) {
      case "critical": return "bg-[oklch(0.60_0.20_20)]"
      case "medium": return "bg-[oklch(0.60_0.18_30)]"
      case "low": return "bg-[oklch(0.70_0.15_150)]"
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-[oklch(0.18_0.01_260)] shadow-sm">
      <div className={`h-1.5 w-full ${getStatusColor()}`} />
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="h-32 w-48 shrink-0 overflow-hidden rounded-lg bg-[oklch(0.25_0.02_260)] relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <MapPin size={48} className="text-[oklch(0.985_0_0)]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-[oklch(0.18_0.01_260)]/80 backdrop-blur flex items-center justify-center">
                <ShieldAlert size={16} className={alert.status === 'critical' ? 'text-[oklch(0.60_0.20_20)]' : 'text-[oklch(0.985_0_0)]'} />
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row justify-between md:items-start mb-4 gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                    alert.status === 'critical' ? 'bg-[oklch(0.60_0.20_20)]/20 text-[oklch(0.60_0.20_20)]' : 
                    alert.status === 'medium' ? 'bg-[oklch(0.60_0.18_30)]/20 text-[oklch(0.60_0.18_30)]' : 
                    'bg-[oklch(0.70_0.15_150)]/20 text-[oklch(0.70_0.15_150)]'
                  }`}>
                    {alert.status} Risk
                  </span>
                  <span className="text-xs text-[oklch(0.65_0.01_260)] flex items-center gap-1">
                    • {alert.timestamp}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[oklch(0.985_0_0)] mb-1">
                  ${alert.amount.toFixed(2)} at {alert.merchant}
                </h3>
              </div>
              <div className="text-right flex items-center gap-2 md:block">
                 <p className="text-sm font-medium text-[oklch(0.985_0_0)]">Card ending in</p>
                 <p className="text-sm font-bold text-[oklch(0.65_0.01_260)]">{alert.cardType} • {alert.cardEnding}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
              <div>
                <p className="text-[oklch(0.65_0.01_260)] mb-1 text-xs uppercase tracking-wider">Merchant</p>
                <p className="text-[oklch(0.985_0_0)] font-medium">{alert.merchant}</p>
              </div>
              <div>
                <p className="text-[oklch(0.65_0.01_260)] mb-1 text-xs uppercase tracking-wider">Location</p>
                <p className="text-[oklch(0.985_0_0)] font-medium">{alert.location}</p>
              </div>
              <div>
                <p className="text-[oklch(0.65_0.01_260)] mb-1 text-xs uppercase tracking-wider flex items-center gap-1">
                   Time
                </p>
                <p className="text-[oklch(0.985_0_0)] font-medium">{alert.time}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {alert.status === "critical" || alert.status === "medium" ? (
                <>
                  <Button variant="destructive" className="bg-[oklch(0.60_0.20_20)] hover:bg-[oklch(0.60_0.20_20)]/90 text-[oklch(0.985_0_0)]">
                    Report Fraud
                  </Button>
                  <Button variant="secondary" className="bg-[oklch(0.25_0.02_260)] hover:bg-[oklch(0.25_0.02_260)]/80 text-[oklch(0.985_0_0)]">
                    Block Card
                  </Button>
                  <Button variant="ghost" className="text-[oklch(0.65_0.01_260)] hover:text-[oklch(0.985_0_0)] hover:bg-transparent px-2">
                    Mark as Safe
                  </Button>
                </>
              ) : (
                <div className="w-full flex items-center justify-between">
                   <Button variant="secondary" className="bg-[oklch(0.70_0.15_150)]/20 text-[oklch(0.70_0.15_150)] hover:bg-[oklch(0.70_0.15_150)]/30 border-none">
                      <span className="flex items-center gap-2">✓ Transaction Verified</span>
                   </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
