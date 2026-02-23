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
        body: JSON.stringify(formData),
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
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Expense Tracker</h1>
          <div className="flex items-center gap-4">
            <Link href="/transactions" className="text-blue-600 hover:text-blue-800">
              Transactions
            </Link>
            <Link href="/analytics" className="text-blue-600 hover:text-blue-800">
              Analytics
            </Link>
            <span>Welcome, {user.name}!</span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TransactionForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
          <Summary totalIncome={totalIncome} totalExpense={totalExpense} />
        </div>
      </main>
    </div>
  )
}
