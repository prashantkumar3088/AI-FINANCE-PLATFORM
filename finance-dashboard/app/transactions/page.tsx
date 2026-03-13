import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { TransactionTable } from "@/components/finance/TransactionTable"
import { mockTransactions } from "@/lib/mock-data"

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <TopNavbar title="All Transactions" />
      <div className="p-8 space-y-6 max-w-[1200px] mx-auto pb-24">
        <TransactionTable transactions={[...mockTransactions, ...mockTransactions]} title="Transaction History" />
      </div>
    </DashboardLayout>
  )
}
