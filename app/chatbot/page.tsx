"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Plus, Upload, FileText, Plane, Home as HomeIcon, CreditCard, BarChart3, PiggyBank, Settings, LogOut, MessageSquare, Send } from "lucide-react"

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

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (token && storedUser && storedUser !== "undefined") {
      try { setUser(JSON.parse(storedUser)) } catch {}
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message: input })
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
    <div className="min-h-screen bg-black text-purple-200">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-br from-purple-900 to-purple-950 border-r border-purple-800 min-h-screen sticky top-0 hidden md:block">
          <div className="p-6 flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-purple-800" />
            <div className="text-base text-purple-400">{user.name}</div>
          </div>
          <nav className="px-3 space-y-1 text-base">
            <Link href="/home" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800">
              <HomeIcon className="w-5 h-5" />
              Home
            </Link>
            <Link href="/transactions" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800">
              <CreditCard className="w-5 h-5" />
              Expenses
            </Link>
            <Link href="/analytics" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800">
              <BarChart3 className="w-5 h-5" />
              Analytics
            </Link>
            <Link href="/budgets" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800">
              <PiggyBank className="w-5 h-5" />
              Budgets
            </Link>
            <Link href="/chatbot" className="flex items-center gap-3 px-4 py-2 rounded-md bg-purple-600/10 text-purple-400">
              <MessageSquare className="w-5 h-5" />
              AI Assistant
            </Link>
            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800">
              <Plane className="w-5 h-5" />
              Trips
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800">
              <FileText className="w-5 h-5" />
              Approvals
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800">
              <Settings className="w-5 h-5" />
              Settings
            </a>
            <button
              onClick={() => { localStorage.clear(); window.location.href = '/' }}
              className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800 text-red-400"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </nav>
          <div className="mt-10 px-4 text-base text-purple-500">EXPENSIO</div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-2xl font-bold text-purple-300 mb-6">AI Assistant</div>

            {/* Chat Container */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-6 h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-800 text-purple-200'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-purple-800 text-purple-200 rounded-lg px-4 py-2">
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about your expenses..."
                  className="flex-1 bg-purple-950 text-purple-200 placeholder-purple-500 border border-purple-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="bg-purple-800 hover:bg-purple-700 disabled:opacity-50 text-purple-200 px-4 py-2 rounded-md transition hover:shadow-lg"
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
