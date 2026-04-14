"use client"

import { Sidebar } from "./Sidebar"
import { useSidebar } from "@/context/SidebarContext"

export function DashboardLayout({ children }) {
  const { isOpen, close } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-[oklch(0.145_0_0)] relative">
      {/* Sidebar Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={close}
        />
      )}
      
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto w-full relative">
        {children}
      </main>
    </div>
  )
}
