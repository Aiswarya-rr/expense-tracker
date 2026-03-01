"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart3, Users, Crown, Home as HomeIcon, LogOut, FileText } from "lucide-react"

interface Overview {
  totalUsers: number
  premiumUsers: number
  freeUsers: number
  totalIncome: number
  totalExpense: number
}

interface AdminUser {
  _id: string
  name: string
  email: string
  isPremium: boolean
}

interface HowToUseSection {
  id: number
  title: string
  body: string
}

export default function AdminDashboardPage() {
  const [adminToken, setAdminToken] = useState<string | null>(null)
  const [overview, setOverview] = useState<Overview | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [sections, setSections] = useState<HowToUseSection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      setLoading(false)
      return
    }
    setAdminToken(token)
  }, [])

  useEffect(() => {
    if (!adminToken) return
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")
        const [overviewRes, usersRes, howRes] = await Promise.all([
          fetch("http://localhost:4000/api/admin/overview", {
            headers: { "x-admin-token": adminToken },
          }),
          fetch("http://localhost:4000/api/admin/users", {
            headers: { "x-admin-token": adminToken },
          }),
          fetch("http://localhost:4000/api/admin/how-to-use", {
            headers: { "x-admin-token": adminToken },
          }),
        ])

        if (!overviewRes.ok || !usersRes.ok || !howRes.ok) {
          setError("Failed to load admin data. Check admin login or server.")
          setLoading(false)
          return
        }

        const overviewData = await overviewRes.json()
        const usersData = await usersRes.json()
        const howData = await howRes.json()

        setOverview(overviewData)
        setUsers(usersData)
        setSections(howData)
      } catch (e) {
        setError("Failed to load admin data.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [adminToken])

  const handlePlanChange = async (userId: string, plan: "free" | "pro") => {
    if (!adminToken) return
    try {
      const res = await fetch(`http://localhost:4000/api/admin/users/${userId}/subscription`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify({ plan }),
      })
      if (res.ok) {
        const updated = await res.json()
        setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)))
        if (overview) {
          const premiumUsers = updated.isPremium
            ? overview.premiumUsers + 1
            : overview.premiumUsers - 1
          const freeUsers = overview.totalUsers - premiumUsers
          setOverview({ ...overview, premiumUsers, freeUsers })
        }
      }
    } catch (e) {
      console.error("Failed to update plan", e)
    }
  }

  const handleSaveHowToUse = async () => {
    if (!adminToken) return
    try {
      const res = await fetch("http://localhost:4000/api/admin/how-to-use", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify({ sections }),
      })
      if (res.ok) {
        const data = await res.json()
        setSections(data)
        alert("How-to-use content saved")
      }
    } catch (e) {
      console.error("Failed to save how-to-use", e)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    window.location.href = "/auth/admin"
  }

  if (!adminToken) {
    return (
      <div className="min-h-screen bg-black text-purple-200 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-xl font-semibold">Admin access required</div>
          <Link
            href="/auth/admin"
            className="inline-block bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white px-6 py-3 rounded-xl text-sm font-semibold"
          >
            Go to Admin Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-purple-200">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-br from-purple-900/90 to-purple-950/90 border-r border-purple-800/60 min-h-screen p-6">
          <div className="text-lg font-bold text-purple-100 mb-8 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            <span>Admin Dashboard</span>
          </div>
          <nav className="space-y-3 text-sm">
            <Link href="/home" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-800/60">
              <HomeIcon className="w-4 h-4" />
              User App
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-900/60 text-red-400 w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-purple-100 mb-1">Admin Overview</h1>
                <p className="text-sm text-purple-400">Manage subscriptions and how-to-use content</p>
              </div>
            </div>

            {error && <div className="text-sm text-red-400 bg-red-900/30 border border-red-700/50 px-4 py-2 rounded-lg">{error}</div>}

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-xl border border-purple-800/70 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-purple-400">Total Users</span>
                  <Users className="w-4 h-4 text-purple-300" />
                </div>
                <div className="text-3xl font-bold text-purple-100">{overview?.totalUsers ?? (loading ? "..." : 0)}</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-900 to-yellow-950 rounded-xl border border-yellow-800/70 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-yellow-300">Premium Users</span>
                  <Crown className="w-4 h-4 text-yellow-300" />
                </div>
                <div className="text-3xl font-bold text-yellow-300">{overview?.premiumUsers ?? (loading ? "..." : 0)}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-xl border border-purple-800/70 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-purple-400">Free Users</span>
                </div>
                <div className="text-3xl font-bold text-purple-100">{overview?.freeUsers ?? (loading ? "..." : 0)}</div>
              </div>
            </div>

            {/* Income / Expense summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-xl border border-emerald-800/70 p-6">
                <div className="text-sm text-emerald-300 mb-2">Total Income (all users)</div>
                <div className="text-3xl font-bold text-emerald-300">₹{overview?.totalIncome?.toFixed(2) ?? (loading ? "..." : "0.00")}</div>
              </div>
              <div className="bg-gradient-to-br from-red-900 to-red-950 rounded-xl border border-red-800/70 p-6">
                <div className="text-sm text-red-300 mb-2">Total Expenses (all users)</div>
                <div className="text-3xl font-bold text-red-300">₹{overview?.totalExpense?.toFixed(2) ?? (loading ? "..." : "0.00")}</div>
              </div>
            </div>

            {/* Users table */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-xl border border-purple-800/70 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold text-purple-100 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Users & Subscriptions</span>
                </div>
              </div>
              <div className="overflow-x-auto text-sm">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-purple-800/70 text-purple-400">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Plan</th>
                      <th className="py-2 pr-4">Change Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b border-purple-800/40 last:border-b-0">
                        <td className="py-2 pr-4 text-purple-100">{u.name}</td>
                        <td className="py-2 pr-4 text-purple-300">{u.email}</td>
                        <td className="py-2 pr-4">
                          {u.isPremium ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-xs">
                              <Crown className="w-3 h-3" /> Pro
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-700/40 text-purple-200 text-xs">
                              Free
                            </span>
                          )}
                        </td>
                        <td className="py-2 pr-4">
                          <select
                            value={u.isPremium ? "pro" : "free"}
                            onChange={(e) => handlePlanChange(u._id, e.target.value as "free" | "pro")}
                            className="bg-black/40 border border-purple-700 rounded-md px-2 py-1 text-xs text-purple-100"
                          >
                            <option value="free">Free</option>
                            <option value="pro">Pro</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && !loading && (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-purple-400 text-sm">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* How to use editor */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-xl border border-purple-800/70 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold text-purple-100 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>How To Use Content</span>
                </div>
                <button
                  onClick={handleSaveHowToUse}
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Save Changes
                </button>
              </div>
              <div className="space-y-4 text-sm">
                {sections.map((s, index) => (
                  <div key={s.id} className="bg-black/30 border border-purple-800/70 rounded-lg p-4 space-y-2">
                    <input
                      type="text"
                      value={s.title}
                      onChange={(e) => {
                        const value = e.target.value
                        setSections((prev) => {
                          const copy = [...prev]
                          copy[index] = { ...copy[index], title: value }
                          return copy
                        })
                      }}
                      className="w-full bg-black/40 border border-purple-700 rounded-md px-3 py-2 text-sm text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Section title"
                    />
                    <textarea
                      value={s.body}
                      onChange={(e) => {
                        const value = e.target.value
                        setSections((prev) => {
                          const copy = [...prev]
                          copy[index] = { ...copy[index], body: value }
                          return copy
                        })
                      }}
                      className="w-full bg-black/40 border border-purple-700 rounded-md px-3 py-2 text-sm text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                      placeholder="Section content"
                    />
                  </div>
                ))}
                {sections.length === 0 && (
                  <div className="text-purple-400 text-sm">No sections yet.</div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
