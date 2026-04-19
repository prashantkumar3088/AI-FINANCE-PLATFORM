"use client";

import { Search, User, Menu, X, Loader2 } from "lucide-react"
import { useSearch } from "@/context/SearchContext"
import { NotificationDropdown } from "./NotificationDropdown"
import { useRouter } from "next/navigation"
import { useSidebar } from "@/context/SidebarContext"
import { useAuth } from "@/context/AuthContext"
import { apiService } from "@/lib/api-service"
import { useState, useEffect, useRef, useCallback } from "react"

export function TopNavbar({ title, actions }) {
  const { searchQuery, setSearchQuery } = useSearch()
  const router = useRouter()
  const { toggle } = useSidebar()
  const { user } = useAuth()

  const [open, setOpen] = useState(false)
  const [localQuery, setLocalQuery] = useState("")
  const [results, setResults] = useState([])
  const [allTx, setAllTx] = useState([])
  const [loadingTx, setLoadingTx] = useState(false)
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  // Load all transactions once when user logs in
  useEffect(() => {
    if (!user) return
    setLoadingTx(true)
    apiService.getExpenses(user.uid)
      .then(data => setAllTx(data || []))
      .catch(() => {})
      .finally(() => setLoadingTx(false))
  }, [user])

  // Filter on every keystroke
  useEffect(() => {
    const q = localQuery.trim().toLowerCase()
    setSearchQuery(localQuery) // sync global context for TransactionTable
    if (!q) { setResults([]); return }
    const filtered = allTx
      .filter(t =>
        (t.description || "").toLowerCase().includes(q) ||
        (t.category || "").toLowerCase().includes(q)
      )
      .slice(0, 6) // max 6 results
    setResults(filtered)
  }, [localQuery, allTx])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleOpen = () => {
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleSelect = (t) => {
    setOpen(false)
    setLocalQuery("")
    setSearchQuery("")
    router.push("/expenses")
  }

  const handleClear = () => {
    setLocalQuery("")
    setSearchQuery("")
    setResults([])
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") { setOpen(false); setLocalQuery(""); setSearchQuery("") }
    if (e.key === "Enter" && localQuery.trim()) {
      setOpen(false)
      router.push("/expenses")
    }
  }

  const CATEGORY_COLORS = {
    "Food & Dining": "bg-orange-500/20 text-orange-400",
    "Transportation": "bg-blue-500/20 text-blue-400",
    "Shopping": "bg-purple-500/20 text-purple-400",
    "Entertainment": "bg-pink-500/20 text-pink-400",
    "Bills": "bg-red-500/20 text-red-400",
    "Health": "bg-emerald-500/20 text-emerald-400",
    "Education": "bg-sky-500/20 text-sky-400",
  }

  return (
    <div className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-[oklch(0.20_0.02_260)] bg-[oklch(0.145_0_0)] px-4 md:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="p-2 lg:hidden text-[oklch(0.65_0.01_260)] hover:text-white"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[oklch(0.985_0_0)] truncate">{title || "Dashboard"}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* ── Search ── */}
        <div className="relative group hidden sm:block" ref={containerRef}>
          <div
            className={`flex items-center h-10 rounded-full border transition-all ${
              open
                ? "w-64 md:w-80 border-[oklch(0.50_0.20_250)] bg-[oklch(0.18_0.01_260)]"
                : "w-40 md:w-64 border-[oklch(0.25_0.02_260)] bg-[oklch(0.18_0.01_260)] cursor-pointer hover:border-[oklch(0.35_0.05_260)]"
            }`}
            onClick={!open ? handleOpen : undefined}
          >
            {loadingTx && open
              ? <Loader2 size={16} className="ml-3 text-[oklch(0.50_0.20_250)] animate-spin shrink-0" />
              : <Search size={16} className={`ml-3 shrink-0 transition-colors ${open ? "text-[oklch(0.50_0.20_250)]" : "text-[oklch(0.65_0.01_260)]"}`} />
            }
            <input
              ref={inputRef}
              type="text"
              placeholder="Search transactions..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent pl-2 pr-2 text-sm text-[oklch(0.985_0_0)] placeholder:text-[oklch(0.65_0.01_260)] focus:outline-none"
            />
            {localQuery && (
              <button onClick={handleClear} className="mr-3 text-[oklch(0.65_0.01_260)] hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Results dropdown */}
          {open && localQuery.trim() && (
            <div className="absolute left-0 right-0 top-12 rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {results.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-[oklch(0.55_0.01_260)]">No transactions found for &quot;{localQuery}&quot;</p>
                </div>
              ) : (
                <>
                  <div className="px-4 pt-3 pb-1">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-[oklch(0.50_0.01_260)]">
                      {results.length} result{results.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <ul>
                    {results.map((t, i) => (
                      <li key={t.id || i}>
                        <button
                          onClick={() => handleSelect(t)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[oklch(0.22_0.01_260)] transition-colors text-left"
                        >
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${CATEGORY_COLORS[t.category] || "bg-[oklch(0.25_0.02_260)] text-[oklch(0.65_0.01_260)]"}`}>
                            {t.category}
                          </span>
                          <span className="flex-1 text-sm text-[oklch(0.85_0.01_260)] truncate">{t.description}</span>
                          <span className="text-sm font-bold text-[oklch(0.60_0.20_20)] shrink-0">
                            ₹{Math.abs(t.amount).toLocaleString()}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-[oklch(0.22_0.01_260)] px-4 py-2.5">
                    <button
                      onClick={() => { router.push("/expenses"); setOpen(false); }}
                      className="text-xs text-[oklch(0.50_0.20_250)] hover:underline"
                    >
                      View all results in Expenses →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <NotificationDropdown />
        </div>

        <button
          onClick={() => router.push('/settings')}
          title="Account Settings"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[oklch(0.60_0.18_30)]/20 text-[oklch(0.60_0.18_30)] transition-colors hover:bg-[oklch(0.60_0.18_30)] hover:text-white"
        >
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
