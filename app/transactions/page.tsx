"use client"

import { useEffect, useRef, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import Link from "next/link"
import { Plus, Upload, FileText, Plane, Home, CreditCard, BarChart3, PiggyBank, Download } from "lucide-react"
import * as XLSX from 'xlsx'
import Sidebar from "../../components/Sidebar"

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

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/auth/signup"
  }

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`, {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/daily`, {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-receipt`, {
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

  const totalIncome = transactions.filter((t: Transaction) => t.type === 'income').reduce((s: number, t: Transaction) => s + t.amount, 0)
  const totalExpense = transactions.filter((t: Transaction) => t.type === 'expense').reduce((s: number, t: Transaction) => s + t.amount, 0)

  if (!user) {
    return <div className="min-h-screen bg-black text-zinc-200 flex items-center justify-center">Loading...</div>
  }

  const exportToExcel = () => {
    const data = transactions.map((t: Transaction) => ({
      Description: t.description || t.category,
      Category: t.category,
      Type: t.type,
      Amount: t.amount,
      Date: new Date(t.date).toLocaleDateString()
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions')
    XLSX.writeFile(wb, 'transactions.xlsx')
  }

  return (
    <div className="min-h-screen bg-black text-purple-200">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar user={user} onLogout={handleLogout} />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-2xl font-bold text-purple-300 mb-6">Transactions</div>
 <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-6 mt-6 mb-4">
            <div className="text-lg font-semibold text-purple-300 mb-4">Export Data</div>
            {user.isPremium ? (
              <button
                onClick={exportToExcel}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white px-6 py-3 rounded-xl transition shadow-lg shadow-purple-900/40 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export to Excel
              </button>
            ) : (
              <div className="text-center">
                <div className="text-purple-400 mb-4">Upgrade to Pro to export your transaction data to Excel</div>
                <Link
                  href="/subscription"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black px-6 py-3 rounded-xl transition shadow-lg shadow-yellow-900/40 inline-flex items-center gap-2 font-semibold"
                >
                  Upgrade to Pro
                </Link>
              </div>
            )}
          </div>
            {/* Summary Cards */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            </div> */}

            {/* Transaction List */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-6 mb-6">
              <div className="text-lg font-semibold text-white mb-4">All Transactions</div>
              <div className="text-base">
                <div className="grid grid-cols-5 gap-4 text-white font-semibold mb-2 font-medium">
                  <div>Description</div>
                  <div>Category</div>
                  <div>Type</div>
                  <div>Date</div>
                  <div className="text-right">Amount</div>
                </div>
                <div className="divide-y divide-purple-800 max-h-96 overflow-y-auto">
                  {transactions.map((tx: Transaction) => (
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
                      <div className="text-white">{new Date(tx.date).toLocaleDateString()}</div>
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
              <div className="text-2xl font-semibold text-white mb-4">Daily Expenses</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-300 rounded-md p-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                      <XAxis dataKey="day" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Total']} />
                      <Bar dataKey="total" fill="#a855f7" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white border border-gray-300 rounded-md h-56 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="text-base text-gray-800 mb-2">Expense Categories</div>
                    {(() => {
                      const categoryTotals = transactions
                        .filter((t: Transaction) => t.type === 'expense')
                        .reduce((acc: {category: string, amount: number}[], t: Transaction) => {
                          const existing = acc.find((c: {category: string, amount: number}) => c.category === t.category)
                          if (existing) existing.amount += t.amount
                          else acc.push({ category: t.category, amount: t.amount })
                          return acc
                        }, [] as { category: string; amount: number }[])
                      return (
                        <ResponsiveContainer width="100%" height={150}>
                          <PieChart>
                            <Pie
                              data={categoryTotals}
                              dataKey="amount"
                              nameKey="category"
                              cx="50%"
                              cy="50%"
                              outerRadius={50}
                            >
                              {categoryTotals.map((entry: {category: string, amount: number}, index: number) => (
                                <Cell key={`cell-${index}`} fill={`hsl(${index * 40 + 240}, 70%, 50%)`} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Amount']} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar View */}
          {user.isPremium ? (
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-4 mt-6">
              <div className="text-xl font-semibold text-white mb-4">Calendar View</div>
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
                    const hasExpenses = transactions.some((t: Transaction) => {
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
          ) : (
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-6 mt-6">
              <div className="text-center">
                <div className="text-purple-400 mb-4">Upgrade to Pro to view calendar view of your transactions</div>
                <Link
                  href="/subscription"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black px-6 py-3 rounded-xl transition shadow-lg shadow-yellow-900/40 inline-flex items-center gap-2 font-semibold"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          )}

          {/* Export to Excel */}
         
        </main>
      </div>
    </div>
  )
}
