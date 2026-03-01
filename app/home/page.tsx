"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import TransactionForm from "../../components/TransactionForm"
import Summary from "../../components/Summary"
import { Plus, Upload, FileText, Plane, TrendingUp, TrendingDown, DollarSign, Home as HomeIcon, CreditCard, BarChart3, PiggyBank, Settings, LogOut, MessageSquare, Calendar, Crown } from "lucide-react"
import Sidebar from "@/components/Sidebar"

interface Transaction {
  _id: string
  userId: string
  type: "income" | "expense"
  category: string
  amount: number
  date: string
  description?: string
}

interface CategoryData {
  category: string
  spent: number
  budget: number
  remaining: number
  percentage: number
  status: 'good' | 'warning' | 'overspent' | 'no-budget'
}

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    category: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
  })
  const [error, setError] = useState("")
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [transactionsLoading, setTransactionsLoading] = useState(false)

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
      fetchCategoryData()
    }
  }, [user])

  const fetchTransactions = async () => {
    setTransactionsLoading(true)
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
    } finally {
      setTransactionsLoading(false)
    }
  }

  const fetchCategoryData = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/analytics/category?type=expense", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        console.log('categoryData from API:', data)
        setCategoryData(data)
      } else {
        console.log('Failed to fetch category data:', response.status)
      }
    } catch (error) {
      console.error("Failed to fetch category data", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:4000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount) || 0,
        }),
      })

      if (response.ok) {
        setFormData({
          type: "expense",
          category: "",
          amount: "",
          date: new Date().toISOString().split('T')[0],
          description: "",
        })
        fetchTransactions()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to add transaction")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/auth/signup"
  }

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  if (!user) {
    return <div className="min-h-screen bg-black text-zinc-200 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-black text-zinc-200">
      <div className="flex">
        {/* Sidebar */}
        {/* <aside className="w-64 bg-gradient-to-br from-purple-900 to-purple-950 border-r border-purple-800 min-h-screen sticky top-0 hidden md:block">
          <div className="p-6 flex flex-col items-center gap-3">
            
            <div className="text-base text-white font-semibold">{user.name}</div>
          </div>
          <nav className="px-3 space-y-1 text-base">
            <Link href="/home" className="flex items-center gap-3 px-4 py-2 rounded-md bg-purple-600/10 text-purple-400">
              <HomeIcon className="w-5 h-5" />
              Home
            </Link>
            <Link href="/transactions" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800">
              <CreditCard className="w-5 h-5" />
              Expenses
            </Link>
            <Link href="/analytics" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800">
              <BarChart3 className="w-5 h-5" />
              Analytics
            </Link>
            <Link href="/budgets" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800">
              <PiggyBank className="w-5 h-5" />
              Budgets
            </Link>
            <Link href="/chatbot" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800">
              <MessageSquare className="w-5 h-5" />
              AI Assistant
            </Link>
            <Link href="/bills" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800">
              <Calendar className="w-5 h-5" />
              Bills
            </Link>
            <Link href="/subscription" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800">
              <Crown className="w-5 h-5" />
              Subscription
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800">
              <FileText className="w-5 h-5" />
              Approvals
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800 text-red-400"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </nav>
         
        </aside> */}
        <Sidebar user={user} onLogout={handleLogout} />
        {/* Main */}
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Form + Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TransactionForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                loading={loading}
                error={error}
              />
              <Summary totalIncome={totalIncome} totalExpense={totalExpense} />
            </div>

            {/* Quick Access */}
            {/* <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-4">
              <div className="text-base text-purple-400 mb-3">Quick Access</div>
              <div className="text-base">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-base">
                  <Link href="/transactions" className="bg-purple-800 hover:bg-purple-700 transition rounded-md py-3 flex items-center justify-center gap-2 hover:shadow-lg">
                    <Plus className="w-4 h-4" />
                    New expense
                  </Link>
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
              </div>
            </div> */}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-6 hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                  <div>
                    <div className="text-base text-purple-400 mb-2">Total Income</div>
                    <div className="text-2xl font-bold text-emerald-400">₹{totalIncome.toFixed(2)}</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-6 hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-6 h-6 text-red-400" />
                  <div>
                    <div className="text-base text-purple-400 mb-2">Total Expenses</div>
                    <div className="text-2xl font-bold text-red-400">₹{totalExpense.toFixed(2)}</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-6 hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-purple-400" />
                  <div>
                    <div className="text-base text-purple-400 mb-2">Balance</div>
                    <div className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      ₹{(totalIncome - totalExpense).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Expenses */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-4">
              <div className="text-base text-white font-semibold mb-3">Recent Expenses</div>
              <div className="text-base">
                <div className="grid grid-cols-4 gap-2 text-white font-semibold mb-2">
                  <div>Subject</div>
                  <div>Category</div>
                  <div>Date</div>
                  <div className="text-right">Amount</div>
                </div>
                <div className="divide-y divide-purple-800">
                  {transactionsLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <div key={i} className="grid grid-cols-4 gap-2 py-2">
                        <div className="animate-pulse bg-purple-800 h-4 rounded"></div>
                        <div className="animate-pulse bg-purple-800 h-4 rounded"></div>
                        <div className="animate-pulse bg-purple-800 h-4 rounded"></div>
                        <div className="animate-pulse bg-purple-800 h-4 rounded text-right"></div>
                      </div>
                    ))
                  ) : (
                    transactions.slice(0,5).map(tx => (
                      <div key={tx._id} className="grid grid-cols-4 gap-2 py-2 items-center">
                        <div className="truncate">{tx.description || tx.category}</div>
                        <div>
                          <span className="px-2 py-0.5 rounded-full text-xl bg-purple-800 text-purple-300">
                            {tx.category}
                          </span>
                        </div>
                        <div className="text-white text-xl">{new Date(tx.date).toLocaleDateString()}</div>
                        <div className={`text-right font-medium ${tx.type === 'income' ? 'text-emerald-400' : 'text-purple-100'}`}>
                          {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                        </div>
                      </div>
                    ))
                  )}
                  {transactions.length === 0 && (
                    <div className="py-6 text-center text-purple-500">No expenses yet</div>
                  )}
                </div>
              </div>
            </div>

            {/* Budget Status */}
            {/* <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-4">
              <div className="text-base text-purple-400 mb-3">Budget Status</div>
              <div className="space-y-2">
                {categoryData.map(c => (
                  <div key={c.category} className={`text-base ${c.status === 'overspent' ? 'text-red-400' : c.status === 'warning' ? 'text-yellow-400' : c.budget > 0 ? 'text-green-400' : 'text-purple-400'}`}>
                    {c.category}: ₹{c.spent?.toFixed(2) || '0.00'} {c.budget > 0 ? `/ ₹${c.budget?.toFixed(2) || '0.00'}` : '(no budget)'} ({c.percentage?.toFixed(1) || '0.0'}%)
                  </div>
                ))}
                {categoryData.length === 0 && (
                  <div className="text-purple-500">No budgets set</div>
                )}
              </div>
            </div> */}
          </div>
        </main>
      </div>
    </div>
  )
}
