import React from "react"
import { Transaction } from "@/types"
import { Search, Filter, MoreVertical, ShoppingCart, Briefcase, Coffee, TrendingUp, ShoppingBag } from "lucide-react"

import { useSearch } from "@/context/SearchContext"

interface TransactionTableProps {
  transactions: Transaction[]
  title?: string
}

export function TransactionTable({ transactions, title = "Recent Transactions" }: TransactionTableProps) {
  const { searchQuery: globalSearch } = useSearch()
  const [localSearch, setLocalSearch] = React.useState("")

  const getIcon = (iconName: string) => {
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

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
    t.category.toLowerCase().includes(effectiveSearch.toLowerCase())
  )

  return (
    <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] w-full overflow-hidden">
      <div className="p-5 border-b border-[oklch(0.25_0.02_260)] flex items-center justify-between">
        <h3 className="text-lg font-bold text-[oklch(0.985_0_0)]">{title}</h3>
        <div className="flex gap-2">
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
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[oklch(0.25_0.02_260)] bg-[oklch(0.145_0_0)] text-[oklch(0.65_0.01_260)] hover:text-[oklch(0.985_0_0)]">
            <Filter size={16} />
          </button>
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
              <th className="px-5 py-4 font-semibold text-center w-12 text-[oklch(0.25_0.02_260)]">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t, i) => (
              <tr 
                key={t.id} 
                className={`border-b border-[oklch(0.25_0.02_260)] hover:bg-[oklch(0.25_0.02_260)]/30 transition-colors ${
                  i === filteredTransactions.length - 1 ? 'border-none' : ''
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
                <td className="px-5 py-4 text-right justify-end">
                  <span className={`font-bold ${t.amount > 0 ? 'text-[oklch(0.70_0.15_150)]' : 'text-[oklch(0.60_0.20_20)]'}`}>
                    {t.amount > 0 ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <button className="text-[oklch(0.65_0.01_260)] hover:text-[oklch(0.985_0_0)] h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[oklch(0.25_0.02_260)]">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
