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
} from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard/", icon: LayoutDashboard },
  { name: "Insights", href: "/insights/", icon: Compass },
  { name: "Transactions", href: "/transactions/", icon: Receipt },
  { name: "Expenses", href: "/expenses/", icon: Receipt },
  { name: "Budgets", href: "/budgets/", icon: PieChart },
  { name: "Alerts", href: "/alerts/", icon: ShieldAlert },
  { name: "Settings", href: "/settings/", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col gap-4 border-r border-[oklch(0.20_0.02_260)] bg-[oklch(0.12_0.01_260)] p-4">
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

      <div className="mt-auto">
        <div className="rounded-xl bg-[oklch(0.18_0.01_260)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.65_0.01_260)] mb-1">
            PRO PLAN
          </p>
          <p className="text-sm text-[oklch(0.985_0_0)] mb-3 leading-tight">
            Unlock advanced AI predictive analytics.
          </p>
          <button className="w-full rounded-lg bg-[oklch(0.50_0.20_250)] py-2 text-sm font-medium text-[oklch(0.985_0_0)] transition-colors hover:bg-[oklch(0.55_0.20_250)] hover:shadow-lg shadow-[oklch(0.50_0.20_250)/20%]">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
