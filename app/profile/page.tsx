"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BarChart3, Home as HomeIcon, LogOut, Crown, User, Settings, Check } from "lucide-react"
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  isPremium?: boolean
}

interface Plan {
  _id: string
  name: string
  price: number
  duration: 'monthly' | 'yearly'
  features: string[]
  isPopular: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/auth/signin')
      return
    }
    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)
    setFormData({
      name: parsedUser.name,
      email: parsedUser.email,
      password: ''
    })

    // Fetch plans
    fetchPlans()
  }, [router])

  const fetchPlans = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/plans')
      if (res.ok) {
        const data = await res.json()
        setPlans(data)
      }
    } catch (err) {
      console.error('Failed to fetch plans')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token')

      const updates: any = {}
      if (formData.name !== user.name) updates.name = formData.name
      if (formData.email !== user.email) updates.email = formData.email
      if (formData.password) updates.password = formData.password

      const res = await fetch('http://localhost:4000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })

      if (!res.ok) throw new Error('Failed to update profile')

      const data = await res.json()
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      toast.success('Profile updated successfully')
      setFormData(prev => ({ ...prev, password: '' }))
    } catch (err) {
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/auth/signin')
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-black text-purple-200">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-br from-purple-900/90 to-purple-950/90 border-r border-purple-800/60 min-h-screen p-6">
          <div className="text-lg font-bold text-purple-100 mb-8 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            <span>Expense Tracker</span>
          </div>
          <nav className="space-y-3 text-sm">
            <Link href="/home" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-800/60">
              <HomeIcon className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/transactions" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-800/60">
              <BarChart3 className="w-4 h-4" />
              Transactions
            </Link>
            <Link href="/budgets" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-800/60">
              <Crown className="w-4 h-4" />
              Budgets
            </Link>
            <Link href="/analytics" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-800/60">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Link>
            <Link href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-600/40">
              <User className="w-4 h-4" />
              Profile
            </Link>
            <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-800/60">
              <Settings className="w-4 h-4" />
              Settings
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
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-purple-100 mb-1">Profile</h1>
                <p className="text-sm text-purple-400">Manage your account information</p>
              </div>
            </div>

            {error && <div className="text-sm text-red-400 bg-red-900/30 border border-red-700/50 px-4 py-2 rounded-lg">{error}</div>}

            {/* Profile Form */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-xl border border-purple-800/70 p-6">
              <div className="text-lg font-semibold text-purple-100 mb-4">Account Information</div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-purple-400 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/40 border border-purple-700 rounded-md px-3 py-2 text-sm text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-purple-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/40 border border-purple-700 rounded-md px-3 py-2 text-sm text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-purple-400 mb-2">New Password (leave empty to keep current)</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-black/40 border border-purple-700 rounded-md px-3 py-2 text-sm text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white px-6 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>

            {/* Subscription Status */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-xl border border-purple-800/70 p-6">
              <div className="text-lg font-semibold text-purple-100 mb-4">Subscription Status</div>
              <div className="flex items-center gap-3">
                {user.isPremium ? (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Crown className="w-5 h-5" />
                    <span className="font-semibold">Pro User</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-purple-400">
                    <span>Free Plan</span>
                  </div>
                )}
                <Link
                  href="/subscription"
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Manage Subscription
                </Link>
              </div>
            </div>

            {/* Paid Plans */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-xl border border-purple-800/70 p-6">
              <div className="text-lg font-semibold text-purple-100 mb-4">Available Plans</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan._id}
                    className={`relative bg-black/40 border rounded-lg p-6 ${
                      plan.isPopular ? 'border-yellow-500' : 'border-purple-700'
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
                        Most Popular
                      </div>
                    )}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-purple-100 mb-2">{plan.name}</h3>
                      <div className="text-3xl font-bold text-purple-200 mb-1">
                        ₹{plan.price}
                        <span className="text-sm font-normal text-purple-400">/{plan.duration}</span>
                      </div>
                      <ul className="text-sm text-purple-300 space-y-1 mb-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/subscription"
                        className="inline-block bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white px-6 py-2 rounded-lg text-sm font-semibold"
                      >
                        {user.isPremium ? 'Manage' : 'Subscribe'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
