"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Home as HomeIcon, CreditCard, BarChart3, PiggyBank, Settings, LogOut, MessageSquare, Calendar, CheckCircle, AlertTriangle } from "lucide-react"

interface Bill {
  _id: string
  name: string
  amount: number
  dueDate: string
  category: string
  recurring: string
  paid: boolean
  paidDate?: string
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    amount: '',
    dueDate: '',
    category: '',
    recurring: 'one-time'
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (token && storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        setUser(JSON.parse(storedUser))
        fetchBills()
      } catch (e) {
        localStorage.removeItem("token")
      }
    }
  }, [])

  const fetchBills = async () => {
    try {
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/bills', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      if (response.ok) {
        const data = await response.json()
        setBills(data)
      }
    } catch (error) {
      console.error('Failed to fetch bills', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/bills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount)
        })
      })
      if (response.ok) {
        setShowForm(false)
        setForm({ name: '', amount: '', dueDate: '', category: '', recurring: 'one-time' })
        fetchBills()
      }
    } catch (error) {
      console.error('Failed to create bill', error)
    }
  }

  const handlePay = async (billId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bills/${billId}/pay`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      if (response.ok) {
        fetchBills()
      }
    } catch (error) {
      console.error('Failed to pay bill', error)
    }
  }

  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays >= 0
  }

  const isOverdue = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    return due < now
  }

  if (!user) {
    return <div className="min-h-screen bg-black text-zinc-200 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-black text-purple-200 relative overflow-hidden">
      {/* Glow background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 -top-40 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-700/20 blur-3xl" />
        <div className="absolute right-1/2 bottom-[-120px] h-[500px] w-[500px] translate-x-1/2 rounded-full bg-purple-900/30 blur-3xl" />
        <div className="absolute left-1/2 bottom-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-fuchsia-700/20 blur-3xl" />
      </div>
      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-br from-purple-900/80 to-purple-950/80 border-r border-purple-800/60 min-h-screen sticky top-0 hidden md:block backdrop-blur-sm">
          <div className="p-6 flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 shadow-lg shadow-purple-900/40" />
            <div className="text-base text-purple-300 font-medium">{user.name}</div>
          </div>
          <nav className="px-3 space-y-1 text-base">
            <Link href="/home" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-800/60 transition">
              <HomeIcon className="w-5 h-5" />
              Home
            </Link>
            <Link href="/transactions" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-800/60 transition">
              <CreditCard className="w-5 h-5" />
              Expenses
            </Link>
            <Link href="/analytics" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-800/60 transition">
              <BarChart3 className="w-5 h-5" />
              Analytics
            </Link>
            <Link href="/budgets" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-800/60 transition">
              <PiggyBank className="w-5 h-5" />
              Budgets
            </Link>
            <Link href="/bills" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-600/40">
              <Calendar className="w-5 h-5" />
              Bills
            </Link>
            <Link href="/chatbot" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-800/60 transition">
              <MessageSquare className="w-5 h-5" />
              AI Assistant
            </Link>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-800/60 transition">
              <Settings className="w-5 h-5" />
              Settings
            </a>
            <button
              onClick={() => { localStorage.clear(); window.location.href = '/' }}
              className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900/60 text-red-400 transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </nav>
          <div className="mt-10 px-4 text-base text-purple-400 font-semibold">EXPENSIO</div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="text-3xl font-bold text-purple-200 mb-2">Bill Reminders</div>
                <p className="text-purple-400">Manage your bills and get reminders for upcoming payments</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white px-6 py-3 rounded-xl transition shadow-lg shadow-purple-900/40"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Add Bill
              </button>
            </div>

            {/* Add Bill Form */}
            {showForm && (
              <div className="bg-gradient-to-br from-purple-900/60 to-purple-950/60 rounded-2xl border border-purple-800/60 p-6 mb-6 shadow-2xl shadow-purple-900/40 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Bill Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-purple-950/60 text-purple-200 placeholder-purple-500 border border-purple-800/60 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="bg-purple-950/60 text-purple-200 placeholder-purple-500 border border-purple-800/60 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="bg-purple-950/60 text-purple-200 placeholder-purple-500 border border-purple-800/60 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="bg-purple-950/60 text-purple-200 placeholder-purple-500 border border-purple-800/60 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <select
                    value={form.recurring}
                    onChange={(e) => setForm({ ...form, recurring: e.target.value })}
                    className="bg-purple-950/60 text-purple-200 border border-purple-800/60 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="one-time">One-time</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white px-6 py-3 rounded-xl transition shadow-lg shadow-purple-900/40"
                    >
                      Add Bill
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="bg-purple-800/60 hover:bg-purple-700/60 text-purple-200 px-6 py-3 rounded-xl transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Bills List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">Loading bills...</div>
              ) : bills.length === 0 ? (
                <div className="text-center py-8 text-purple-400">No bills yet. Add your first bill!</div>
              ) : (
                bills.map((bill) => (
                  <div
                    key={bill._id}
                    className={`bg-gradient-to-br from-purple-900/60 to-purple-950/60 rounded-2xl border border-purple-800/60 p-6 shadow-2xl backdrop-blur-sm ${
                      bill.paid ? 'opacity-60' : isOverdue(bill.dueDate) ? 'border-red-500/60 bg-red-900/20' : isDueSoon(bill.dueDate) ? 'border-yellow-500/60 bg-yellow-900/20' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-purple-200">{bill.name}</h3>
                          {bill.paid ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : isOverdue(bill.dueDate) ? (
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                          ) : isDueSoon(bill.dueDate) ? (
                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                          ) : null}
                        </div>
                        <div className="text-purple-300 space-y-1">
                          <p>Amount: ₹{bill.amount.toFixed(2)}</p>
                          <p>Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                          <p>Category: {bill.category}</p>
                          <p>Recurring: {bill.recurring}</p>
                          {bill.paid && bill.paidDate && <p className="text-green-400">Paid on: {new Date(bill.paidDate).toLocaleDateString()}</p>}
                        </div>
                      </div>
                      {!bill.paid && (
                        <button
                          onClick={() => handlePay(bill._id)}
                          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-6 py-3 rounded-xl transition shadow-lg shadow-green-900/40"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
