"use client"

import { useEffect, useState } from "react"

interface MonthlyData {
  month: string
  income: number
  expense: number
}

interface CategoryData {
  category: string
  spent: number
  budget: number
  remaining: number
  percentage: number
  status: 'good' | 'warning' | 'overspent' | 'no-budget'
}

export default function Analytics() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (token && storedUser && storedUser !== "undefined") {
      try { setUser(JSON.parse(storedUser)) } catch {}
    }
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
      const [monthlyRes, categoryRes] = await Promise.all([
        fetch("http://localhost:4000/api/analytics/monthly", { headers }),
        fetch("http://localhost:4000/api/analytics/category", { headers })
      ])

      if (monthlyRes.ok) {
        const monthly = await monthlyRes.json()
        setMonthlyData(monthly.map((m: any) => ({
          month: m.month.toString(),
          income: m.income || 0,
          expense: m.expense || 0
        })))
      }

      if (categoryRes.ok) {
        const category = await categoryRes.json()
        setCategoryData(category)
      }
    } catch (error) {
      console.error("Failed to fetch analytics", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-zinc-200">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-zinc-900/80 border-r border-zinc-800 min-h-screen sticky top-0 hidden md:block">
          <div className="p-6 flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-zinc-800" />
            <div className="text-sm text-zinc-400">{user?.name ?? 'User'}</div>
          </div>
          <nav className="px-3 space-y-1 text-sm">
            <a href="/home" className="block px-4 py-2 rounded-md hover:bg-zinc-800">Home</a>
            <a href="/transactions" className="block px-4 py-2 rounded-md hover:bg-zinc-800">Expenses</a>
            <a href="/analytics" className="block px-4 py-2 rounded-md bg-emerald-600/10 text-emerald-400">Analytics</a>
            <a href="/budgets" className="block px-4 py-2 rounded-md hover:bg-zinc-800">Budgets</a>
          </nav>
          <div className="mt-10 px-4 text-xs text-zinc-500">EXPENSIO</div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-6xl mx-auto space-y-6">
            {loading ? (
              <div className="text-zinc-400">Loading analytics...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Summary */}
                <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
                  <div className="text-sm text-zinc-400 mb-3">Monthly Summary</div>
                  {monthlyData.length === 0 ? (
                    <p className="text-zinc-500">No data available</p>
                  ) : (
                    <div className="space-y-3">
                      {/* Tiny stacked chart bar */}
                      <div className="bg-zinc-950 border border-zinc-800 rounded-md h-40 flex items-end p-3 gap-2">
                        {monthlyData.slice(0,6).map((m, i) => {
                          const total = Math.max(1, m.income + m.expense)
                          const incH = Math.min(100, (m.income / total) * 100)
                          const expH = Math.min(100, (m.expense / total) * 100)
                          return (
                            <div key={i} className="w-6 flex flex-col justify-end gap-1">
                              <div className="w-full bg-emerald-600/70 rounded-sm" style={{ height: `${incH}%` }} />
                              <div className="w-full bg-violet-600/70 rounded-sm" style={{ height: `${expH}%` }} />
                            </div>
                          )
                        })}
                      </div>
                      {/* List */}
                      <div className="divide-y divide-zinc-800 text-sm">
                        {monthlyData.map((month, index) => (
                          <div key={index} className="py-2">
                            <div className="font-medium text-zinc-200">Month {month.month}</div>
                            <div className="text-emerald-400">Income: ₹{month.income.toFixed(2)}</div>
                            <div className="text-violet-400">Expenses: ₹{month.expense.toFixed(2)}</div>
                            <div className="font-semibold">Balance: ₹{(month.income - month.expense).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Breakdown */}
                <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
                  <div className="text-sm text-zinc-400 mb-3">Category Breakdown</div>
                  {categoryData.length === 0 ? (
                    <p className="text-zinc-500">No data available</p>
                  ) : (
                    <div className="space-y-3">
                      {/* Simple bar chart */}
                      <div className="bg-zinc-950 border border-zinc-800 rounded-md p-4 space-y-2">
                        {categoryData.slice(0,8).map((cat, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-28 text-xs text-zinc-400 truncate">{cat.category}</div>
                            <div className="flex-1 h-2 bg-zinc-800 rounded">
                              <div className={`h-2 rounded ${
                                cat.status === 'overspent'
                                  ? 'bg-red-500'
                                  : cat.status === 'warning'
                                  ? 'bg-yellow-500'
                                  : cat.budget > 0
                                  ? 'bg-green-500'
                                  : 'bg-violet-600'
                              }`} style={{ width: `${Math.min(cat.percentage || 0, 100)}%` }} />
                            </div>
                            <div className="w-24 text-right text-sm">₹{cat.spent?.toFixed(2) || '0.00'} {cat.budget > 0 ? `/ ₹${cat.budget?.toFixed(2) || '0.00'}` : ''}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
