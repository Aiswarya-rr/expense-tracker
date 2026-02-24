"use client"

import { useEffect, useState } from "react"

interface Transaction {
  _id: string
  userId: string
  type: "income" | "expense"
  category: string
  amount: number
  date: string
  description?: string
}

export default function TransactionsPage() {
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [dailyData, setDailyData] = useState<{ day: number; total: number }[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (token && storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/auth/signup"
      }
    } else {
      window.location.href = "/auth/signup"
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchTransactions()
      fetchDaily()
    }
  }, [user])

  const fetchTransactions = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/transactions", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      }
    } catch (error) {
      console.error("Failed to fetch transactions", error)
    }
  }

  const fetchDaily = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/analytics/daily", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        console.log('dailyData:', data)
        setDailyData(data)
      } else {
        console.log('Failed to fetch daily data:', response.status)
      }
    } catch (error) {
      console.error("Failed to fetch daily data", error)
    }
  }

  if (!user) {
    return <div className="min-h-screen bg-black text-zinc-200 flex items-center justify-center">Loading...</div>
  }

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

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
            <a href="/home" className="block px-4 py-2 rounded-md hover:bg-zinc-800">Home</a>
            <a href="/transactions" className="block px-4 py-2 rounded-md bg-emerald-600/10 text-emerald-400">Expenses</a>
            <a href="/analytics" className="block px-4 py-2 rounded-md hover:bg-zinc-800">Analytics</a>
            <a href="/budgets" className="block px-4 py-2 rounded-md hover:bg-zinc-800">Budgets</a>
            <a href="#" className="block px-4 py-2 rounded-md hover:bg-zinc-800">Trips</a>
            <a href="#" className="block px-4 py-2 rounded-md hover:bg-zinc-800">Approvals</a>
            <a href="#" className="block px-4 py-2 rounded-md hover:bg-zinc-800">Settings</a>
            <button
              onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/auth/signup' }}
              className="w-full text-left px-4 py-2 rounded-md hover:bg-zinc-800 text-red-400"
            >Logout</button>
          </nav>
          <div className="mt-10 px-4 text-xs text-zinc-500">EXPENSIO</div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Top cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
                <div className="text-sm text-zinc-400 mb-3">Pending Tasks</div>
                <div className="space-y-2 text-zinc-300 text-sm">
                  <div className="flex items-center justify-between"><span>Pending Approvals</span><span className="text-zinc-400">5</span></div>
                  <div className="flex items-center justify-between"><span>New Trips Registered</span><span className="text-zinc-400">1</span></div>
                  <div className="flex items-center justify-between"><span>Unreported Expenses</span><span className="text-zinc-400">4</span></div>
                  <div className="flex items-center justify-between"><span>Upcoming Expenses</span><span className="text-zinc-400">2</span></div>
                  <div className="flex items-center justify-between"><span>Unreported Advances</span><span className="text-zinc-400">0</span></div>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
                <div className="text-sm text-zinc-400 mb-3">Recent Expenses</div>
                <div className="text-sm">
                  <div className="grid grid-cols-4 gap-2 text-zinc-400 mb-2">
                    <div>Subject</div>
                    <div>Category</div>
                    <div>Date</div>
                    <div className="text-right">Amount</div>
                  </div>
                  <div className="divide-y divide-zinc-800">
                    {transactions.slice(0,5).map(tx => (
                      <div key={tx._id} className="grid grid-cols-4 gap-2 py-2 items-center">
                        <div className="truncate">{tx.description || tx.category}</div>
                        <div>
                          <span className="px-2 py-0.5 rounded-full text-xs bg-zinc-800 text-zinc-300">
                            {tx.category}
                          </span>
                        </div>
                        <div className="text-zinc-400 text-xs">{new Date(tx.date).toLocaleDateString()}</div>
                        <div className={`text-right font-medium ${tx.type === 'income' ? 'text-emerald-400' : 'text-zinc-100'}`}>
                          {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                    {transactions.length === 0 && (
                      <div className="py-6 text-center text-zinc-500">No expenses yet</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
              <div className="text-sm text-zinc-400 mb-4">Quick Access</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <button className="bg-zinc-800 hover:bg-zinc-700 transition rounded-md py-3">+ New expense</button>
                <button className="bg-zinc-800 hover:bg-zinc-700 transition rounded-md py-3">+ Add receipt</button>
                <button className="bg-zinc-800 hover:bg-zinc-700 transition rounded-md py-3">+ Create report</button>
                <button className="bg-zinc-800 hover:bg-zinc-700 transition rounded-md py-3">+ Create trip</button>
              </div>
            </div>

            {/* Daily Expenses */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
              <div className="text-sm text-zinc-400 mb-4">Daily Expenses</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-950 border border-zinc-800 rounded-md h-56 flex items-end p-4 gap-0.5">
                  {dailyData.map((d, i) => {
                    const maxTotal = Math.max(...dailyData.map(d => d.total), 1)
                    const height = (d.total / maxTotal) * 100
                    return <div key={d.day} className="flex-1 bg-emerald-600/60 rounded-sm" style={{ height: `${height}%` }} title={`Day ${d.day}: ₹${d.total.toFixed(2)}`} />
                  })}
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded-md h-56 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm text-zinc-400 mb-2">Expense Categories</div>
                    <svg width="150" height="150" viewBox="0 0 150 150">
                      {(() => {
                        const categoryTotals = transactions
                          .filter(t => t.type === 'expense')
                          .reduce((acc, t) => {
                            const existing = acc.find(c => c.category === t.category)
                            if (existing) existing.amount += t.amount
                            else acc.push({ category: t.category, amount: t.amount })
                            return acc
                          }, [] as { category: string; amount: number }[])
                        
                        const total = categoryTotals.reduce((s, c) => s + c.amount, 0)
                        let currentAngle = 0
                        
                        return categoryTotals.map((c, i) => {
                          const angle = (c.amount / total) * 360
                          const startAngle = currentAngle
                          currentAngle += angle
                          
                          const x1 = 75 + 60 * Math.cos((startAngle * Math.PI) / 180)
                          const y1 = 75 + 60 * Math.sin((startAngle * Math.PI) / 180)
                          const x2 = 75 + 60 * Math.cos(((startAngle + angle) * Math.PI) / 180)
                          const y2 = 75 + 60 * Math.sin(((startAngle + angle) * Math.PI) / 180)
                          
                          const largeArc = angle > 180 ? 1 : 0
                          
                          return (
                            <path
                              key={i}
                              d={`M 75 75 L ${x1} ${y1} A 60 60 0 ${largeArc} 1 ${x2} ${y2} Z`}
                              fill={`hsl(${i * 60 + 120}, 70%, 50%)`}
                              stroke="white"
                              strokeWidth="1"
                            >
                              <title>{c.category}: ₹{c.amount.toFixed(2)}</title>
                            </path>
                          )
                        })
                      })()}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
