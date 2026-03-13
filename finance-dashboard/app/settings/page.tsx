import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TopNavbar } from "@/components/layout/TopNavbar"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <TopNavbar title="Settings" />
      <div className="p-8 max-w-[1200px] mx-auto">
        <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-8 shadow-sm">
           <h3 className="text-xl font-bold text-[oklch(0.985_0_0)] mb-4">Account Settings</h3>
           <p className="text-[oklch(0.65_0.01_260)]">Profile configuration and application settings will appear here.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
