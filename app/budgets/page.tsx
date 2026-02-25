"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import BudgetForm from "../../components/BudgetForm"
import BudgetProgress from "../../components/BudgetProgress"

interface CategoryData {
  category: string
  spent: number
  budget: number
  remaining: number
  percentage: number
  status: 'good' | 'warning' | 'overspent' | 'no-budget'
}

export default function BudgetsPage() {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (token && storedUser && storedUser !== "undefined") {
      try { setUser(JSON.parse(storedUser)) } catch {}
    }
    fetchCategoryData()
  }, [])

  const fetchCategoryData = async () => {
    setLoading(true)
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
      const response = await fetch("http://localhost:4000/api/analytics/category?type=expense", { headers })
      if (response.ok) {
        const data = await response.json()
        setCategoryData(data)
      }
    } catch (error) {
      console.error("Failed to fetch category data", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="min-h-screen bg-black text-zinc-200 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-black text-purple-200">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-br from-purple-900 to-purple-950 min-h-screen border-r border-purple-800 p-6">
          <div className="text-lg font-bold text-purple-300 mb-8">Expense Tracker</div>
          <nav className="space-y-4">
            <Link href="/home" className="flex items-center gap-3 text-base text-purple-300 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <Link href="/transactions" className="flex items-center gap-3 text-base text-purple-300 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Transactions
            </Link>
            <Link href="/analytics" className="flex items-center gap-3 text-base text-purple-300 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </Link>
            <Link href="/budgets" className="flex items-center gap-3 text-base text-white font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Budgets
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-2xl font-bold text-purple-300 mb-6">Budgets</div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-6">
                <BudgetForm onSuccess={fetchCategoryData} />
              </div>

              <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-6">
                <div className="text-lg font-semibold text-purple-300 mb-4">Budget Progress</div>
                <div className="text-base">
                  <BudgetProgress categoryData={categoryData} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
