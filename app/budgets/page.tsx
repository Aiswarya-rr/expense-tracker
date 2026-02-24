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
    <div className="min-h-screen bg-black text-zinc-200">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-zinc-900/80 border-r border-zinc-800 min-h-screen sticky top-0 hidden md:block">
          <div className="p-6 flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-zinc-800" />
            <div className="text-sm text-zinc-400">{user.name}</div>
          </div>
          <nav className="px-3 space-y-1 text-sm">
            <Link href="/home" className="block px-4 py-2 rounded-md hover:bg-zinc-800">Home</Link>
            <Link href="/transactions" className="block px-4 py-2 rounded-md hover:bg-zinc-800">Expenses</Link>
            <Link href="/analytics" className="block px-4 py-2 rounded-md hover:bg-zinc-800">Analytics</Link>
            <Link href="/budgets" className="block px-4 py-2 rounded-md bg-emerald-600/10 text-emerald-400">Budgets</Link>
          </nav>
          <div className="mt-10 px-4 text-xs text-zinc-500">EXPENSIO</div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-zinc-200">Budget Planning</h1>
            {loading ? (
              <div className="text-zinc-400">Loading budget data...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BudgetForm onSuccess={fetchCategoryData} />
                <BudgetProgress categoryData={categoryData} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
