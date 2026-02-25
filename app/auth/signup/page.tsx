"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Mail, Lock, Wallet } from "lucide-react"

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    try {
      const res = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setMessage("Signup successful! Redirecting...")
        setIsSuccess(true)
        // Navigate immediately after persisting auth state
        router.replace("/home")
      } else {
        setMessage(data.message || "Signup failed. Please try again.")
        setIsSuccess(false)
      }
    } catch (err: any) {
      setMessage("Signup failed. Please try again.")
      setIsSuccess(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-purple-100 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Glow background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 -top-40 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-700/20 blur-3xl" />
        <div className="absolute right-1/2 bottom-[-120px] h-[500px] w-[500px] translate-x-1/2 rounded-full bg-purple-900/30 blur-3xl" />
        <div className="absolute left-1/2 bottom-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-fuchsia-700/20 blur-3xl" />
      </div>
      <div className="max-w-md w-full bg-gradient-to-br from-purple-900/80 to-black shadow-xl rounded-2xl p-8 border border-purple-700/60 backdrop-blur-sm relative z-10">
        <div className="text-center">
          <Wallet className="mx-auto h-12 w-12 text-purple-400 mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">
            Create your account
          </h2>
          <p className="text-purple-300">Start tracking your expenses today</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className={`rounded-md p-4 border ${isSuccess ? 'bg-green-900/50 border-green-500/50 text-green-300' : 'bg-red-900/50 border-red-500/50 text-red-300'}`}>
              {message}
            </div>
          )}
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-purple-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-purple-600/50 rounded-md bg-purple-900/30 text-white placeholder-purple-400 focus:ring-purple-500 focus:border-purple-500 sm:text-sm shadow-lg"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
              </div>
            </div>
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-purple-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-purple-600/50 rounded-md bg-purple-900/30 text-white placeholder-purple-400 focus:ring-purple-500 focus:border-purple-500 sm:text-sm shadow-lg"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
              </div>
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-purple-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-purple-600/50 rounded-md bg-purple-900/30 text-white placeholder-purple-400 focus:ring-purple-500 focus:border-purple-500 sm:text-sm shadow-lg"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
            >
              <Wallet className="mr-2 h-5 w-5" />
              Sign up
            </button>
          </div>

          <div className="text-center">
            <Link href="/auth/signin" className="text-purple-400 hover:text-purple-300 font-medium">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
