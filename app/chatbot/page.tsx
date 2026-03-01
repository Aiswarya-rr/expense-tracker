"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Plus, Upload, FileText, Plane, Home as HomeIcon, CreditCard, BarChart3, PiggyBank, Settings, LogOut, MessageSquare, Send, User, Bot } from "lucide-react"
import Sidebar from "@/components/Sidebar"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you with your expenses today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/auth/signup"
  }

  const suggestedQuestions = [
    "What is my total expenses this month?",
    "Show me my spending by category",
    "What are my top expenses?",
    "How much have I saved this month?",
    "Suggest ways to reduce my expenses"
  ]

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (token && storedUser && storedUser !== "undefined") {
      try { setUser(JSON.parse(storedUser)) } catch {}
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e?: React.MouseEvent | string) => {
    let msgToSend: string;
    if (typeof e === 'string') {
      msgToSend = e;
    } else {
      msgToSend = input.trim();
    }
    if (!msgToSend || loading) return

    const userMessage: Message = { role: 'user', content: msgToSend }
    setMessages(prev => [...prev, userMessage])
    if (typeof e !== 'string') setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message: msgToSend })
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = { role: 'assistant', content: data.response }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
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
        {/* <aside className="w-64 bg-gradient-to-br from-purple-900/80 to-purple-950/80 border-r border-purple-800/60 min-h-screen sticky top-0 hidden md:block backdrop-blur-sm">
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
            <Link href="/chatbot" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-600/40">
              <MessageSquare className="w-5 h-5" />
              AI Assistant
            </Link>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-800/60 transition">
              <Plane className="w-5 h-5" />
              Trips
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-800/60 transition">
              <FileText className="w-5 h-5" />
              Approvals
            </a>
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
        </aside> */}
        <Sidebar user={user} onLogout={handleLogout} />
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-3xl font-bold text-purple-200 mb-2">AI Assistant</div>
            <p className="text-purple-400 mb-6">Get personalized insights and help with your expenses</p>

            {/* Suggested Questions */}
            <div className="mb-6">
              <p className="text-purple-300 mb-3 text-sm">Quick questions about your expenses:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(question)}
                    disabled={loading}
                    className="bg-purple-800/60 hover:bg-purple-700/60 disabled:opacity-50 text-purple-200 px-3 py-2 rounded-lg text-sm transition shadow-lg"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Container */}
            <div className="bg-gradient-to-br from-purple-900/60 to-purple-950/60 rounded-2xl border border-purple-800/60 p-6 h-[600px] flex flex-col shadow-2xl shadow-purple-900/40 backdrop-blur-sm">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-6 mb-6">
                {messages.map((message, index) => (
                  <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-900/40">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-lg ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white ml-12'
                        : 'bg-gradient-to-r from-purple-800 to-purple-900 text-purple-100 mr-12'
                    }`}>
                      {message.content}
                    </div>
                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-900/40">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex items-start gap-3 justify-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-900/40">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-purple-800 to-purple-900 text-purple-100 rounded-2xl px-4 py-3 shadow-lg mr-12">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about your expenses..."
                    className="w-full bg-purple-950/60 text-purple-200 placeholder-purple-500 border border-purple-800/60 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg backdrop-blur-sm"
                    disabled={loading}
                  />
                  <MessageSquare className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-500" />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl transition shadow-lg shadow-purple-900/40 hover:shadow-xl hover:shadow-purple-900/60"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
