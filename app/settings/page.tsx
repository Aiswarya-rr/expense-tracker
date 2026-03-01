"use client"

import { useEffect, useState } from "react"
import Sidebar from "../../components/Sidebar"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (token && storedUser && storedUser !== "undefined") {
      try { setUser(JSON.parse(storedUser)) } catch {}
    }

    const savedTheme = localStorage.getItem("theme") || 'dark'
    setTheme(savedTheme)
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/auth/signup"
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    if (newTheme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
  }

  if (!user) {
    return <div className="min-h-screen bg-black text-zinc-200 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-black text-purple-200">
      <div className="flex">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-3xl font-bold text-purple-300 mb-6">Settings</div>

            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-6">
              <div className="text-lg font-semibold text-purple-300 mb-4">Appearance</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base text-purple-200 mb-1">Light Mode</div>
                  <div className="text-sm text-purple-400">Toggle between dark and light themes</div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    theme === 'light' ? 'bg-purple-600' : 'bg-purple-800'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      theme === 'light' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
