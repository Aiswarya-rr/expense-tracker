"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import TransactionForm from "../../components/TransactionForm"
import Summary from "../../components/Summary"

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
        // data.error might be an array of Zod issues or a string
        let msg = "Failed to add transaction"
        if (Array.isArray(data.error)) {
          msg = data.error.map((e: any) => e.message).join("; ")
        } else if (typeof data.error === "string") {
          msg = data.error
        } else if (typeof data.message === "string") {
          msg = data.message
        }
        setError(msg)
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
        <aside className="w-64 bg-zinc-900/80 border-r border-zinc-800 min-h-screen sticky top-0 hidden md:block">
          <div className="p-6 flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-zinc-800" />
            <div className="text-sm text-zinc-400">{user.name}</div>
          </div>
          <nav className="px-3 space-y-1 text-sm">
            <Link href="/home" className="block px-4 py-2 rounded-md bg-emerald-600/10 text-emerald-400">Home</Link>
            <Link href="/transactions" className="block px-4 py-2 rounded-md hover:bg-zinc-800">Expenses</Link>
            <Link href="/analytics" className="block px-4 py-2 rounded-md hover:bg-zinc-800">Analytics</Link>
            <Link href="/budgets" className="block px-4 py-2 rounded-md hover:bg-zinc-800">Budgets</Link>
            <a href="#" className="block px-4 py-2 rounded-md hover:bg-zinc-800">Trips</a>
            <a href="#" className="block px-4 py-2 rounded-md hover:bg-zinc-800">Approvals</a>
            <a href="#" className="block px-4 py-2 rounded-md hover:bg-zinc-800">Settings</a>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 rounded-md hover:bg-zinc-800 text-red-400"
            >Logout</button>
          </nav>
          <div className="mt-10 px-4 text-xs text-zinc-500">EXPENSIO</div>
        </aside>

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

            {/* Recent Expenses */}
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

            {/* Budget Status */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
              <div className="text-sm text-zinc-400 mb-3">Budget Status</div>
              <div className="space-y-2">
                {categoryData.map(c => (
                  <div key={c.category} className={`text-sm ${c.status === 'overspent' ? 'text-red-400' : c.status === 'warning' ? 'text-yellow-400' : c.budget > 0 ? 'text-green-400' : 'text-zinc-400'}`}>
                    {c.category}: ₹{c.spent?.toFixed(2) || '0.00'} {c.budget > 0 ? `/ ₹${c.budget?.toFixed(2) || '0.00'}` : '(no budget)'} ({c.percentage?.toFixed(1) || '0.0'}%)
                  </div>
                ))}
                {categoryData.length === 0 && (
                  <div className="text-zinc-500">No budgets set</div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
