"use client"

import Sidebar from "@/components/Sidebar"
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

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/auth/signup"
  }

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
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/monthly`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/category`, { headers })
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
    <div className="min-h-screen bg-black text-purple-200">
      <div className="flex">
        {/* Sidebar */}
        {/* <div className="w-64 bg-gradient-to-br from-purple-900 to-purple-950 min-h-screen border-r border-purple-800 p-6">
          <div className="text-lg font-bold text-purple-300 mb-8">Expense Tracker</div>
          <nav className="space-y-4">
            <a href="/" className="flex items-center gap-3 text-base text-purple-300 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </a>
            <a href="/transactions" className="flex items-center gap-3 text-base text-purple-300 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Transactions
            </a>
            <a href="/analytics" className="flex items-center gap-3 text-base text-white font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </a>
            <a href="/budgets" className="flex items-center gap-3 text-base text-purple-300 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Budgets
            </a>
          </nav>
        </div> */}
       

       <Sidebar user={user} onLogout={handleLogout} />
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-2xl font-bold text-purple-300 mb-6">Analytics</div>

            {/* Monthly Overview */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-6 mb-6">
              <div className="text-lg font-semibold text-purple-300 mb-4">Monthly Overview</div>
              <div className="text-base">
                <div className="grid grid-cols-4 gap-4 text-purple-400 mb-2 font-medium">
                  <div>Month</div>
                  <div>Income</div>
                  <div>Expenses</div>
                  <div>Savings</div>
                </div>
                <div className="divide-y divide-purple-800">
                  {monthlyData.map(m => (
                    <div key={m.month} className="grid grid-cols-4 gap-4 py-3">
                      <div className="text-purple-300">{m.month}</div>
                      <div className="text-emerald-400">₹{m.income.toFixed(2)}</div>
                      <div className="text-red-400">₹{m.expense.toFixed(2)}</div>
                      <div className={`font-medium ${m.income - m.expense >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        ₹{(m.income - m.expense).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-6">
              <div className="text-lg font-semibold text-purple-300 mb-4">Category Breakdown</div>
              <div className="text-base">
                <div className="grid grid-cols-6 gap-4 text-purple-400 mb-2 font-medium">
                  <div>Category</div>
                  <div>Spent</div>
                  <div>Budget</div>
                  <div>Remaining</div>
                  <div>Percentage</div>
                  <div>Status</div>
                </div>
                <div className="divide-y divide-purple-800">
                  {categoryData.map(c => (
                    <div key={c.category} className="grid grid-cols-6 gap-4 py-3 items-center">
                      <div className="text-purple-300">{c.category}</div>
                      <div>₹{c.spent?.toFixed(2) || '0.00'}</div>
                      <div>₹{c.budget?.toFixed(2) || '0.00'}</div>
                      <div className={c.remaining >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        ₹{c.remaining?.toFixed(2) || '0.00'}
                      </div>
                      <div>{c.percentage?.toFixed(1) || '0.0'}%</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          c.status === 'good' ? 'bg-emerald-800 text-emerald-300' :
                          c.status === 'warning' ? 'bg-yellow-800 text-yellow-300' :
                          c.status === 'overspent' ? 'bg-red-800 text-red-300' :
                          'bg-purple-800 text-purple-300'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
