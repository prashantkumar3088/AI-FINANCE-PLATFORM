import { Bell, Search, PlusCircle, Settings, User } from "lucide-react"
import { useSearch } from "@/context/SearchContext"

export function TopNavbar({ title, actions }: { title?: string, actions?: React.ReactNode }) {
  const { searchQuery, setSearchQuery } = useSearch()

  return (
    <div className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-[oklch(0.20_0.02_260)] bg-[oklch(0.145_0_0)/80%] px-8 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-[oklch(0.985_0_0)]">{title || "Dashboard"}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[oklch(0.65_0.01_260)] group-focus-within:text-[oklch(0.50_0.20_250)] transition-colors" />
          <input
            type="text"
            placeholder="Search analytics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-64 rounded-full border border-[oklch(0.25_0.02_260)] bg-[oklch(0.18_0.01_260)] pl-10 pr-4 text-sm text-[oklch(0.985_0_0)] placeholder:text-[oklch(0.65_0.01_260)] focus:border-[oklch(0.50_0.20_250)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.50_0.20_250)] transition-all"
          />
        </div>

        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[oklch(0.18_0.01_260)] text-[oklch(0.65_0.01_260)] transition-colors hover:bg-[oklch(0.25_0.02_260)] hover:text-[oklch(0.985_0_0)] relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[oklch(0.145_0_0)]"></span>
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[oklch(0.60_0.18_30)]/20 text-[oklch(0.60_0.18_30)] transition-colors hover:bg-[oklch(0.60_0.18_30)] hover:text-white">
          <User className="h-5 w-5" />
        </button>
        
        {actions && (
          <div className="ml-2 pl-6 border-l border-[oklch(0.25_0.02_260)]">
             {actions}
          </div>
        )}
      </div>
    </div>
  )
}
