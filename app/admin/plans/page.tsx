"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart3, Home as HomeIcon, LogOut, Crown, Plus, Edit, Trash2 } from "lucide-react"

interface Plan {
  _id: string
  name: string
  price: number
  duration: 'monthly' | 'yearly'
  features: string[]
  isPopular: boolean
}

export default function AdminPlansPage() {
  const [adminToken, setAdminToken] = useState<string | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    duration: 'monthly' as 'monthly' | 'yearly',
    features: '',
    isPopular: false
  })

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
    fetchPlans()
  }, [adminToken])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const res = await fetch("http://localhost:4000/api/plans")
      if (!res.ok) throw new Error('Failed to fetch plans')
      const data = await res.json()
      setPlans(data)
    } catch (e) {
      setError("Failed to load plans")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminToken) return

    const features = formData.features.split('\n').filter(f => f.trim())

    try {
      const method = editingPlan ? 'PUT' : 'POST'
      const url = editingPlan ? `http://localhost:4000/api/plans/${editingPlan._id}` : 'http://localhost:4000/api/plans'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify({ ...formData, features })
      })

      if (!res.ok) throw new Error(editingPlan ? 'Failed to update plan' : 'Failed to add plan')

      await fetchPlans()
      resetForm()
      alert(editingPlan ? 'Plan updated' : 'Plan added')
    } catch (e) {
      alert('Error saving plan')
    }
  }

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      features: plan.features.join('\n'),
      isPopular: plan.isPopular
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this plan?')) return
    if (!adminToken) return

    try {
      const res = await fetch(`http://localhost:4000/api/plans/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': adminToken }
      })

      if (!res.ok) throw new Error('Failed to delete plan')

      await fetchPlans()
      alert('Plan deleted')
    } catch (e) {
      alert('Error deleting plan')
    }
  }

  const resetForm = () => {
    setEditingPlan(null)
    setFormData({ name: '', price: 0, duration: 'monthly', features: '', isPopular: false })
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
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-800/60">
              <BarChart3 className="w-4 h-4" />
              Overview
            </Link>
            <Link href="/admin/plans" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-600/40">
              <Crown className="w-4 h-4" />
              Plans Management
            </Link>
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
                <h1 className="text-3xl font-bold text-purple-100 mb-1">Plans Management</h1>
                <p className="text-sm text-purple-400">Add, edit, and delete subscription plans</p>
              </div>
            </div>

            {error && <div className="text-sm text-red-400 bg-red-900/30 border border-red-700/50 px-4 py-2 rounded-lg">{error}</div>}

            {/* Add/Edit Form */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-xl border border-purple-800/70 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold text-purple-100 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</span>
                </div>
                {editingPlan && (
                  <button onClick={resetForm} className="text-purple-400 hover:text-purple-300 text-sm">Cancel</button>
                )}
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-purple-400 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/40 border border-purple-700 rounded-md px-3 py-2 text-sm text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-purple-400 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-black/40 border border-purple-700 rounded-md px-3 py-2 text-sm text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-purple-400 mb-1">Duration</label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value as 'monthly' | 'yearly' })}
                      className="w-full bg-black/40 border border-purple-700 rounded-md px-3 py-2 text-sm text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-purple-400 mb-1">Popular</label>
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-purple-400 mb-1">Features (one per line)</label>
                  <textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full bg-black/40 border border-purple-700 rounded-md px-3 py-2 text-sm text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white px-6 py-2 rounded-lg text-sm font-semibold"
                >
                  {editingPlan ? 'Update Plan' : 'Add Plan'}
                </button>
              </form>
            </div>

            {/* Plans List */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-xl border border-purple-800/70 p-6">
              <div className="text-lg font-semibold text-purple-100 mb-4">All Plans</div>
              <div className="overflow-x-auto text-sm">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-purple-800/70 text-purple-400">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Price</th>
                      <th className="py-2 pr-4">Duration</th>
                      <th className="py-2 pr-4">Features</th>
                      <th className="py-2 pr-4">Popular</th>
                      <th className="py-2 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((plan) => (
                      <tr key={plan._id} className="border-b border-purple-800/40 last:border-b-0">
                        <td className="py-2 pr-4 text-purple-100">{plan.name}</td>
                        <td className="py-2 pr-4 text-purple-300">₹{plan.price}</td>
                        <td className="py-2 pr-4 text-purple-300">{plan.duration}</td>
                        <td className="py-2 pr-4 text-purple-300 max-w-xs truncate">{plan.features.join(', ')}</td>
                        <td className="py-2 pr-4">
                          {plan.isPopular ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-xs">
                              <Crown className="w-3 h-3" /> Yes
                            </span>
                          ) : (
                            <span className="text-purple-400">No</span>
                          )}
                        </td>
                        <td className="py-2 pr-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(plan)}
                              className="text-blue-400 hover:text-blue-300"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(plan._id)}
                              className="text-red-400 hover:text-red-300"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {plans.length === 0 && !loading && (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-purple-400 text-sm">
                          No plans found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
