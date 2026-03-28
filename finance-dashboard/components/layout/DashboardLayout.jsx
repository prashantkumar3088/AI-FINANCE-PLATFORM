"use client"

import { Sidebar } from "./Sidebar"

export function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[oklch(0.145_0_0)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full relative">
        {children}
      </main>
    </div>
  )
}
