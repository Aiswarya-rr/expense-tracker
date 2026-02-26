"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Plus, Upload, FileText, Plane, Home, CreditCard, BarChart3, PiggyBank } from "lucide-react"

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
  const [uploading, setUploading] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0])
    }
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('receipt', file)

    try {
      const response = await fetch('http://localhost:4000/api/upload-receipt', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData
      })

      if (response.ok) {
        fetchTransactions()
        fetchDaily()
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error("Upload failed", error)
    } finally {
      setUploading(false)
    }
  }

  if (!user) {
    return <div className="min-h-screen bg-black text-zinc-200 flex items-center justify-center">Loading...</div>
  }

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  return (
    <div className="min-h-screen bg-black text-purple-200">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-br from-purple-900 to-purple-950 min-h-screen border-r border-purple-800 p-6">
          <div className="text-lg font-bold text-purple-300 mb-8">Expense Tracker</div>
          <nav className="space-y-4">
            <Link href="/" className="flex items-center gap-3 text-base text-purple-300 hover:text-white transition">
              <Home className="w-5 h-5" />
              Home
            </Link>
            <Link href="/transactions" className="flex items-center gap-3 text-base text-white font-medium">
              <CreditCard className="w-5 h-5" />
              Transactions
            </Link>
            <Link href="/analytics" className="flex items-center gap-3 text-base text-purple-300 hover:text-white transition">
              <BarChart3 className="w-5 h-5" />
              Analytics
            </Link>
            <Link href="/budgets" className="flex items-center gap-3 text-base text-purple-300 hover:text-white transition">
              <PiggyBank className="w-5 h-5" />
              Budgets
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-2xl font-bold text-purple-300 mb-6">Transactions</div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-6">
                <div className="text-base text-purple-400 mb-2">Total Income</div>
                <div className="text-2xl font-bold text-emerald-400">₹{totalIncome.toFixed(2)}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-6">
                <div className="text-base text-purple-400 mb-2">Total Expenses</div>
                <div className="text-2xl font-bold text-red-400">₹{totalExpense.toFixed(2)}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-6">
                <div className="text-base text-purple-400 mb-2">Balance</div>
                <div className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  ₹{(totalIncome - totalExpense).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Transaction List */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-6 mb-6">
              <div className="text-lg font-semibold text-purple-300 mb-4">All Transactions</div>
              <div className="text-base">
                <div className="grid grid-cols-5 gap-4 text-purple-400 mb-2 font-medium">
                  <div>Description</div>
                  <div>Category</div>
                  <div>Type</div>
                  <div>Date</div>
                  <div className="text-right">Amount</div>
                </div>
                <div className="divide-y divide-purple-800 max-h-96 overflow-y-auto">
                  {transactions.map(tx => (
                    <div key={tx._id} className="grid grid-cols-5 gap-4 py-3 items-center">
                      <div className="truncate">{tx.description || tx.category}</div>
                      <div>
                        <span className="px-3 py-1 rounded-full text-sm bg-purple-800 text-purple-300">
                          {tx.category}
                        </span>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          tx.type === 'income' ? 'bg-emerald-800 text-emerald-300' : 'bg-red-800 text-red-300'
                        }`}>
                          {tx.type}
                        </span>
                      </div>
                      <div className="text-purple-400">{new Date(tx.date).toLocaleDateString()}</div>
                      <div className={`text-right font-medium ${
                        tx.type === 'income' ? 'text-emerald-400' : 'text-purple-100'
                      }`}>
                        {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Access */}
              {/* <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-4">
                <div className="text-base text-purple-400 mb-4">Quick Access</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-base">
                  <button className="bg-purple-800 hover:bg-purple-700 transition rounded-md py-3 flex items-center justify-center gap-2 hover:shadow-lg">
                    <Plus className="w-4 h-4" />
                    New expense
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-purple-800 hover:bg-purple-700 transition rounded-md py-3 disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg">
                    {uploading ? 'Uploading...' : (
                      <>
                        <Upload className="w-4 h-4" />
                        Add receipt
                      </>
                    )}
                  </button>
                  <button className="bg-purple-800 hover:bg-purple-700 transition rounded-md py-3 flex items-center justify-center gap-2 hover:shadow-lg">
                    <FileText className="w-4 h-4" />
                    Create report
                  </button>
                  <button className="bg-purple-800 hover:bg-purple-700 transition rounded-md py-3 flex items-center justify-center gap-2 hover:shadow-lg">
                    <Plane className="w-4 h-4" />
                    Create trip
                  </button>
                </div>
                <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
              </div> */}

            {/* Daily Expenses */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-4">
              <div className="text-base text-purple-400 mb-4">Daily Expenses</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-950 border border-purple-800 rounded-md p-4">
                  <svg width="100%" height="200" viewBox="0 0 300 200">
                    {/* Y Axis */}
                    <line x1="30" y1="10" x2="30" y2="170" stroke="#a855f7" strokeWidth="1" />
                    {/* Y Axis labels */}
                    {(() => {
                      const maxTotal = Math.max(...dailyData.map(d => d.total), 1)
                      return [0, 1, 2, 3, 4].map(i => {
                        const value = (maxTotal / 4) * i
                        const y = 170 - (i * 160 / 4)
                        return (
                          <g key={i}>
                            <line x1="25" y1={y} x2="30" y2={y} stroke="#a855f7" strokeWidth="1" />
                            <text x="20" y={y + 4} textAnchor="end" fill="#a855f7" fontSize="10">{value.toFixed(0)}</text>
                          </g>
                        )
                      })
                    })()}
                    {/* Bars */}
                    {dailyData.map((d, i) => {
                      const maxTotal = Math.max(...dailyData.map(d => d.total), 1)
                      const height = (d.total / maxTotal) * 160
                      const x = 40 + i * 50
                      const y = 170 - height
                      return (
                        <g key={d.day}>
                          <rect x={x} y={y} width="30" height={height} fill="#10b981" opacity="0.6" rx="2" />
                          {/* X axis label */}
                          <text x={x + 15} y="185" textAnchor="middle" fill="#a855f7" fontSize="10">{d.day}</text>
                        </g>
                      )
                    })}
                    {/* X Axis */}
                    <line x1="30" y1="170" x2="280" y2="170" stroke="#a855f7" strokeWidth="1" />
                  </svg>
                </div>
                <div className="bg-purple-950 border border-purple-800 rounded-md h-56 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="text-base text-purple-400 mb-2">Expense Categories</div>
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
                    {/* Legend */}
                    <div className="mt-2 text-xs text-purple-300">
                      {(() => {
                        const categoryTotals = transactions
                          .filter(t => t.type === 'expense')
                          .reduce((acc, t) => {
                            const existing = acc.find(c => c.category === t.category)
                            if (existing) existing.amount += t.amount
                            else acc.push({ category: t.category, amount: t.amount })
                            return acc
                          }, [] as { category: string; amount: number }[])
                        return categoryTotals.map((c, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: `hsl(${i * 60 + 120}, 70%, 50%)` }}></div>
                            <span>{c.category}</span>
                          </div>
                        ))
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar View */}
          <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-4 mt-6">
            <div className="text-base text-purple-400 mb-4">Calendar View</div>
            {/* Month navigation */}
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={() => {
                  if (currentMonth === 0) {
                    setCurrentMonth(11)
                    setCurrentYear(currentYear - 1)
                  } else {
                    setCurrentMonth(currentMonth - 1)
                  }
                }} 
                className="text-purple-400 hover:text-purple-300 transition"
              >
                ← Prev
              </button>
              <div className="text-purple-200 font-medium">
                {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <button 
                onClick={() => {
                  if (currentMonth === 11) {
                    setCurrentMonth(0)
                    setCurrentYear(currentYear + 1)
                  } else {
                    setCurrentMonth(currentMonth + 1)
                  }
                }} 
                className="text-purple-400 hover:text-purple-300 transition"
              >
                Next →
              </button>
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Days of week */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-purple-500 text-sm font-medium py-2">{day}</div>
              ))}
              {/* Empty cells for start of month */}
              {(() => {
                const firstDay = new Date(currentYear, currentMonth, 1).getDay()
                return Array.from({ length: firstDay }, (_, i) => <div key={`empty-${i}`} className="py-2"></div>)
              })()}
              {/* Days */}
              {(() => {
                const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
                return Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1
                  const hasExpenses = transactions.some(t => {
                    const tDate = new Date(t.date)
                    return tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonth && tDate.getDate() === day
                  })
                  return (
                    <div 
                      key={day} 
                      className={`py-2 px-1 rounded-md transition ${hasExpenses ? 'bg-purple-600 text-white shadow-lg' : 'text-purple-300 hover:bg-purple-800/50'}`}
                      title={hasExpenses ? `Expenses on ${day}` : `No expenses on ${day}`}
                    >
                      {day}
                      {hasExpenses && <div className="w-1 h-1 bg-fuchsia-400 rounded-full mx-auto mt-1"></div>}
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
