"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CreditCard, BarChart3, PiggyBank, MessageSquare, Calendar, Crown, FileText, LogOut } from "lucide-react"

interface SidebarProps {
  user?: any
  onLogout?: () => void
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname()

  const getLinkClass = (href: string) => {
    return pathname === href
      ? "flex items-center gap-3 px-4 py-2 rounded-md bg-purple-600/10 text-purple-400"
      : "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800"
  }

  return (
    <aside className="w-64 bg-gradient-to-br from-purple-900 to-purple-950 border-r border-purple-800 min-h-screen sticky top-0 hidden md:block">
      <div className="p-6 flex flex-col items-center gap-3">
        <div className="text-base text-white font-semibold">{user?.name || "Expense Tracker"}</div>
      </div>
      <nav className="px-3 space-y-1 text-base">
        <Link href="/home" className={getLinkClass("/home")}>
          <Home className="w-5 h-5" />
          Home
        </Link>
        <Link href="/transactions" className={getLinkClass("/transactions")}>
          <CreditCard className="w-5 h-5" />
          Expenses
        </Link>
        <Link href="/analytics" className={getLinkClass("/analytics")}>
          <BarChart3 className="w-5 h-5" />
          Analytics
        </Link>
        <Link href="/budgets" className={getLinkClass("/budgets")}>
          <PiggyBank className="w-5 h-5" />
          Budgets
        </Link>
        <Link href="/chatbot" className={getLinkClass("/chatbot")}>
          <MessageSquare className="w-5 h-5" />
          AI Assistant
        </Link>
        <Link href="/bills" className={getLinkClass("/bills")}>
          <Calendar className="w-5 h-5" />
          Bills
        </Link>
        <Link href="/subscription" className={getLinkClass("/subscription")}>
          <Crown className="w-5 h-5" />
          Subscription
        </Link>
        <Link href="#" className={getLinkClass("#")}>
          <FileText className="w-5 h-5" />
          Approvals
        </Link>
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800 text-red-400"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        )}
      </nav>
    </aside>
  )
}
