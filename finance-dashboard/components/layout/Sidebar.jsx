"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Receipt,
  PieChart,
  TrendingUp,
  Settings,
  HelpCircle,
  AlertTriangle,
  ShieldAlert,
  Wallet,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/SidebarContext";
import { Menu, X } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard/", icon: LayoutDashboard },
  { name: "AI Insights", href: "/insights/", icon: Compass },
  { name: "Transactions", href: "/transactions/", icon: Receipt },
  { name: "Expenses", href: "/expenses/", icon: Wallet },
  { name: "Budgets", href: "/budgets/", icon: PieChart },
  { name: "Alerts", href: "/alerts/", icon: ShieldAlert },
  { name: "Settings", href: "/settings/", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col gap-4 border-r border-[oklch(0.20_0.02_260)] bg-[oklch(0.12_0.01_260)] p-4 transition-transform duration-300 lg:static lg:translate-x-0 shadow-2xl lg:shadow-none",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex shrink-0 items-center justify-between py-2 px-3">
        <Link href="/dashboard/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[oklch(0.50_0.20_250)] text-[oklch(0.985_0_0)]">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="block font-bold text-[oklch(0.985_0_0)]">
              FinAI
            </span>
            <span className="block text-xs text-[oklch(0.65_0.01_260)]">
              AI Financial Assistant
            </span>
          </div>
        </Link>
        <button onClick={close} className="lg:hidden text-[oklch(0.65_0.01_260)] hover:text-white">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-2 mt-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname + "/" === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:text-[oklch(0.985_0_0)]",
                isActive
                  ? "bg-[oklch(0.18_0.01_260)] text-[oklch(0.50_0.20_250)] shadow-inner"
                  : "text-[oklch(0.65_0.01_260)] hover:bg-[oklch(0.18_0.01_260)]",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-[oklch(0.50_0.20_250)]" : "text-current",
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto" />

    </div>
  );
}
