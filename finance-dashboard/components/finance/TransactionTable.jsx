"use client";

import React, { useState, useRef, useEffect } from "react"
import { Search, Filter, MoreVertical, ShoppingCart, Briefcase, Coffee, TrendingUp, ShoppingBag, X, Check, ChevronDown, Trash2, Copy, Eye } from "lucide-react"
import { useSearch } from "@/context/SearchContext"

const CATEGORIES = ["All", "Food & Dining", "Transportation", "Shopping", "Entertainment", "Bills", "Health", "Others"]
const SORT_OPTIONS = [
  { label: "Newest First", value: "date-desc" },
  { label: "Oldest First", value: "date-asc" },
  { label: "Amount ↑", value: "amount-asc" },
  { label: "Amount ↓", value: "amount-desc" },
]

export function TransactionTable({ transactions, title = "Recent Transactions" }) {
  const { searchQuery: globalSearch } = useSearch()
  const [localSearch, setLocalSearch] = useState("")
  const [showFilter, setShowFilter] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("date-desc")
  const [activeMenu, setActiveMenu] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [dismissed, setDismissed] = useState(new Set())
  const filterRef = useRef(null)

  // Close filter panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'shopping-cart': return <ShoppingCart size={20} />
      case 'briefcase': return <Briefcase size={20} />
      case 'coffee': return <Coffee size={20} />
      case 'trending-up': return <TrendingUp size={20} />
      case 'shopping-bag': return <ShoppingBag size={20} />
      default: return <ShoppingCart size={20} />
    }
  }

  const effectiveSearch = globalSearch || localSearch

  let filtered = transactions
    .filter(t => !dismissed.has(t.id))
    .filter(t =>
      t.description.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(effectiveSearch.toLowerCase())
    )
    .filter(t => selectedCategory === "All" || t.category === selectedCategory)

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date)
    if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date)
    if (sortBy === "amount-asc") return a.amount - b.amount
    if (sortBy === "amount-desc") return b.amount - a.amount
    return 0
  })

  const handleCopy = (t) => {
    const text = `${t.description} | ${t.category} | ₹${Math.abs(t.amount).toFixed(2)} | ${t.date}`
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedId(t.id)
    setTimeout(() => setCopiedId(null), 1500)
    setActiveMenu(null)
  }

  const handleDismiss = (id) => {
    setDismissed(prev => new Set([...prev, id]))
    setActiveMenu(null)
  }

  const activeFilters = (selectedCategory !== "All" ? 1 : 0) + (sortBy !== "date-desc" ? 1 : 0)

  return (
    <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] w-full overflow-hidden">
      <div className="p-5 border-b border-[oklch(0.25_0.02_260)] flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-lg font-bold text-[oklch(0.985_0_0)]">{title}</h3>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[oklch(0.65_0.01_260)]" />
            <input
              type="text"
              placeholder="Search..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="h-9 w-48 rounded-lg border border-[oklch(0.25_0.02_260)] bg-[oklch(0.145_0_0)] pl-9 pr-3 text-sm text-[oklch(0.985_0_0)] placeholder:text-[oklch(0.65_0.01_260)] focus:border-[oklch(0.50_0.20_250)] focus:outline-none"
            />
          </div>
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilter(v => !v)}
              className={`flex h-9 items-center gap-1.5 px-3 rounded-lg border text-sm font-medium transition-colors ${
                showFilter || activeFilters > 0
                  ? "border-[oklch(0.50_0.20_250)] bg-[oklch(0.50_0.20_250)]/10 text-[oklch(0.50_0.20_250)]"
                  : "border-[oklch(0.25_0.02_260)] bg-[oklch(0.145_0_0)] text-[oklch(0.65_0.01_260)] hover:text-[oklch(0.985_0_0)]"
              }`}
            >
              <Filter size={14} />
              Filter
              {activeFilters > 0 && (
                <span className="ml-1 h-4 w-4 rounded-full bg-[oklch(0.50_0.20_250)] text-[9px] font-bold text-white flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
              <ChevronDown size={12} className={`transition-transform ${showFilter ? 'rotate-180' : ''}`} />
            </button>

            {showFilter && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] shadow-2xl z-20 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-[oklch(0.65_0.01_260)]">Category</p>
                  {selectedCategory !== "All" && (
                    <button onClick={() => setSelectedCategory("All")} className="text-[10px] text-[oklch(0.50_0.20_250)] hover:underline">Clear</button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        selectedCategory === cat
                          ? "bg-[oklch(0.50_0.20_250)] text-white"
                          : "bg-[oklch(0.145_0_0)] text-[oklch(0.65_0.01_260)] hover:text-[oklch(0.985_0_0)] border border-[oklch(0.25_0.02_260)]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-[oklch(0.65_0.01_260)] mb-3">Sort By</p>
                <div className="space-y-1">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        sortBy === opt.value
                          ? "bg-[oklch(0.50_0.20_250)]/10 text-[oklch(0.50_0.20_250)]"
                          : "text-[oklch(0.65_0.01_260)] hover:bg-[oklch(0.145_0_0)] hover:text-[oklch(0.985_0_0)]"
                      }`}
                    >
                      {opt.label}
                      {sortBy === opt.value && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase text-[oklch(0.65_0.01_260)] bg-[oklch(0.145_0_0)]/50 tracking-wider font-semibold">
            <tr>
              <th className="px-5 py-4 font-semibold">Description</th>
              <th className="px-5 py-4 font-semibold hidden md:table-cell">Category</th>
              <th className="px-5 py-4 font-semibold hidden sm:table-cell">Date</th>
              <th className="px-5 py-4 font-semibold text-right">Amount</th>
              <th className="px-5 py-4 font-semibold text-center w-12 text-[oklch(0.25_0.02_260)]">ACT</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-[oklch(0.65_0.01_260)] text-sm">
                  No transactions match your filters.
                </td>
              </tr>
            ) : filtered.map((t, i) => (
              <tr
                key={t.id}
                className={`border-b border-[oklch(0.25_0.02_260)] hover:bg-[oklch(0.25_0.02_260)]/30 transition-colors ${
                  i === filtered.length - 1 ? 'border-none' : ''
                }`}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.color}`}>
                      {getIcon(t.icon)}
                    </div>
                    <div>
                      <p className="font-semibold text-[oklch(0.985_0_0)]">{t.description}</p>
                      <p className="text-xs text-[oklch(0.65_0.01_260)] md:hidden">{t.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[oklch(0.985_0_0)] hidden md:table-cell">{t.category}</td>
                <td className="px-5 py-4 text-[oklch(0.65_0.01_260)] hidden sm:table-cell">{t.date}</td>
                <td className="px-5 py-4 text-right">
                  <span className={`font-bold ${t.amount > 0 ? 'text-[oklch(0.70_0.15_150)]' : 'text-[oklch(0.60_0.20_20)]'}`}>
                    {t.amount > 0 ? '+' : '-'}₹{Math.abs(t.amount).toFixed(2)}
                  </span>
                </td>
                <td className="px-5 py-4 text-center relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === t.id ? null : t.id)}
                    className="text-[oklch(0.65_0.01_260)] hover:text-[oklch(0.985_0_0)] h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[oklch(0.25_0.02_260)] mx-auto"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {activeMenu === t.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                      <div className="absolute right-2 top-full mt-1 z-20 w-44 rounded-xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                        <button
                          onClick={() => handleCopy(t)}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[oklch(0.65_0.01_260)] hover:bg-[oklch(0.25_0.02_260)] hover:text-[oklch(0.985_0_0)] transition-colors"
                        >
                          {copiedId === t.id ? <Check size={14} className="text-[oklch(0.70_0.15_150)]" /> : <Copy size={14} />}
                          {copiedId === t.id ? "Copied!" : "Copy Details"}
                        </button>
                        <button
                          onClick={() => { setActiveMenu(null) }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[oklch(0.65_0.01_260)] hover:bg-[oklch(0.25_0.02_260)] hover:text-[oklch(0.985_0_0)] transition-colors"
                        >
                          <Eye size={14} />
                          Mark Reviewed
                        </button>
                        <div className="h-px bg-[oklch(0.25_0.02_260)]" />
                        <button
                          onClick={() => handleDismiss(t.id)}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[oklch(0.60_0.20_20)] hover:bg-[oklch(0.60_0.20_20)]/10 transition-colors"
                        >
                          <Trash2 size={14} />
                          Remove from View
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="px-5 py-3 border-t border-[oklch(0.25_0.02_260)] text-xs text-[oklch(0.65_0.01_260)] flex justify-between items-center">
          <span>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</span>
          <span>Total: ₹{filtered.reduce((acc, t) => acc + Math.abs(t.amount), 0).toFixed(2)}</span>
        </div>
      )}
    </div>
  )
}
