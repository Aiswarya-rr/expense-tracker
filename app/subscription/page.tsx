"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Crown, Check, Home as HomeIcon, CreditCard, BarChart3, PiggyBank, Settings, LogOut, MessageSquare, Calendar } from "lucide-react"
import toast from 'react-hot-toast'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function SubscriptionPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [plans, setPlans] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (token && storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem("token")
      }
    }

    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    // Fetch plans
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans`)
      .then(res => res.json())
      .then(setPlans)
      .catch(console.error)
  }, [])

  const handleSubscribe = async (plan: string) => {
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscription/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ plan })
      })

      const data = await response.json()

      console.log('order data', data)

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'Expense Tracker Pro',
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Subscription`,
        prefill: {
          name: user.name,
          email: user.email,
        },
        handler: async function (response: any) {
          // Verify payment
          const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscription/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            })
          })

          const verifyData = await verifyResponse.json()
          if (verifyData.success) {
            alert('Subscription activated! You are now a Pro user.')
            // Update user in localStorage
            const updatedUser = { ...user, isPremium: true }
            localStorage.setItem("user", JSON.stringify(updatedUser))
            setUser(updatedUser)
          } else {
            alert('Payment verification failed. Please contact support.')
          }
        }
      }

      console.log('rzp options', options)

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error('Subscription error', error)
      alert('Failed to initiate subscription. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="min-h-screen bg-black text-zinc-200 flex items-center justify-center">Loading...</div>
  }

  if (user.isPremium) {
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
              <div className="text-sm text-yellow-400 font-semibold">Pro User</div>
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
              <Link href="/bills" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-800/60 transition">
                <Calendar className="w-5 h-5" />
                Bills
              </Link>
              <Link href="/chatbot" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-800/60 transition">
                <MessageSquare className="w-5 h-5" />
                AI Assistant
              </Link>
              <Link href="/subscription" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-600/40">
                <Crown className="w-5 h-5" />
                Subscription
              </Link>
              <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800">
                <Settings className="w-5 h-5" />
                Settings
              </a>
              <button
                onClick={() => { localStorage.clear(); window.location.href = '/' }}
                className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-md hover:bg-red-900 text-red-400"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>
            <div className="mt-10 px-4 text-base text-purple-400 font-semibold">EXPENSIO</div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto text-center">
              <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-purple-200 mb-4">You're a Pro User!</h1>
              <p className="text-purple-400 text-lg">Enjoy unlimited access to all premium features.</p>
            </div>
          </main>
        </div>
      </div>
    )
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
            <Link href="/bills" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-800/60 transition">
              <Calendar className="w-5 h-5" />
              Bills
            </Link>
            <Link href="/chatbot" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-800/60 transition">
              <MessageSquare className="w-5 h-5" />
              AI Assistant
            </Link>
            <Link href="/subscription" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-600/40">
              <Crown className="w-5 h-5" />
              Subscription
            </Link>
            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800">
              <Settings className="w-5 h-5" />
              Settings
            </a>
            <button
              onClick={() => { localStorage.clear(); window.location.href = '/' }}
              className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-md hover:bg-red-900 text-red-400"
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
            <div className="text-center mb-12">
              <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-purple-200 mb-4">Upgrade to Pro</h1>
              <p className="text-purple-400 text-lg">Unlock advanced features and take control of your finances</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.map(plan => {
                const monthly = plans.find(p => p.duration === 'monthly')
                const save = plan.duration === 'yearly' && monthly ? Math.round(((monthly.price * 12 - plan.price) / (monthly.price * 12)) * 100) : 0
                return (
                  <div key={plan._id} className={`bg-gradient-to-br ${plan.isPopular ? 'from-yellow-900/60 to-orange-950/60 border border-yellow-800/60' : 'from-purple-900/60 to-purple-950/60 border border-purple-800/60'} rounded-2xl p-8 shadow-2xl backdrop-blur-sm relative`}>
                    {plan.isPopular && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 py-1 rounded-full text-sm font-semibold">Best Value</div>}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-purple-200 mb-2">{plan.name}</h3>
                      <div className="text-4xl font-bold text-yellow-400 mb-2">₹{plan.price}</div>
                      <p className="text-purple-400">{plan.duration === 'yearly' ? `per year (save ${save}%)` : 'per month'}</p>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-400" />
                          <span className="text-purple-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleSubscribe(plan.duration)}
                      disabled={loading}
                      className={`w-full py-3 px-6 rounded-xl transition shadow-lg disabled:opacity-50 ${plan.isPopular ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-semibold' : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white'}`}
                    >
                      {loading ? 'Processing...' : `Subscribe ${plan.name}`}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
