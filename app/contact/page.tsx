"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BarChart3, Home as HomeIcon, LogOut, Crown, User, Settings, Send } from "lucide-react"
import toast from 'react-hot-toast'

export default function ContactPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/auth/signin')
      return
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.subject || !formData.message) return

    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token')

      const res = await fetch('http://localhost:4000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to send message')

      toast.success('Message sent successfully!')
      setFormData({ subject: '', message: '' })
    } catch (err) {
      toast.error('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/auth/signin')
  }

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
            <Link href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-800/60">
              <User className="w-4 h-4" />
              Profile
            </Link>
            <Link href="/contact" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-600/40">
              <Send className="w-4 h-4" />
              Contact
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
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-purple-100 mb-1">Contact Us</h1>
                <p className="text-sm text-purple-400">Send a message to our support team</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-xl border border-purple-800/70 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-purple-400 mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-black/40 border border-purple-700 rounded-md px-3 py-2 text-sm text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter subject"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-purple-400 mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-black/40 border border-purple-700 rounded-md px-3 py-2 text-sm text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                    placeholder="Enter your message"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white px-6 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
