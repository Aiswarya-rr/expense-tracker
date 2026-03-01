"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const adminEmail = "admin@example.com"
    const adminPassword = "admin123"
    const adminSecret = "supersecret123"

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem("adminToken", adminSecret)
      router.push("/admin")
    } else {
      setError("Invalid admin credentials")
    }
  }

  return (
    <div className="min-h-screen bg-black text-purple-200 flex items-center justify-center">
      <div className="w-full max-w-md bg-gradient-to-br from-purple-900/80 to-purple-950/80 border border-purple-800/60 rounded-2xl p-8 shadow-2xl shadow-purple-900/50">
        <h1 className="text-2xl font-bold text-purple-100 mb-4 text-center">Admin Login</h1>
        {error && <div className="mb-4 text-sm text-red-400 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-purple-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-purple-700 rounded-lg px-3 py-2 text-sm text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-purple-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-purple-700 rounded-lg px-3 py-2 text-sm text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white py-2 rounded-lg text-sm font-semibold mt-2"
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  )
}
