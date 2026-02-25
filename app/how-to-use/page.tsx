"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Upload, FileText, Plane, TrendingUp, TrendingDown, DollarSign, Home as HomeIcon, CreditCard, BarChart3, PiggyBank, Settings, LogOut, MessageSquare, UserPlus, LogIn, Receipt, Target, Eye, Bot } from "lucide-react"

interface Step {
  icon: React.ElementType
  title: string
  description: string
  details: string[]
}

const steps: Step[] = [
  {
    icon: UserPlus,
    title: "Getting Started",
    description: "Create your account and start tracking expenses",
    details: [
      "Sign up with your email and password",
      "Log in to access your dashboard",
      "Your data is secure and private"
    ]
  },
  {
    icon: Plus,
    title: "Adding Transactions",
    description: "Record your income and expenses easily",
    details: [
      "Use the transaction form on the Home page",
      "Select income or expense type",
      "Add category, amount, date, and description",
      "Transactions appear instantly in your lists"
    ]
  },
  {
    icon: Target,
    title: "Managing Budgets",
    description: "Set monthly limits and track your spending",
    details: [
      "Go to Budgets page to create new budgets",
      "Set limits per category and month",
      "Monitor progress bars and alerts",
      "Receive email notifications when overspending"
    ]
  },
  {
    icon: Eye,
    title: "Viewing Analytics",
    description: "Understand your spending patterns",
    details: [
      "Check monthly charts and trends",
      "View category breakdowns",
      "See budget progress and status",
      "Export reports for deeper insights"
    ]
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description: "Get personalized financial advice",
    details: [
      "Access AI chatbot for expense questions",
      "Ask about budgeting tips or analysis",
      "Get personalized recommendations",
      "Available 24/7 for instant help"
    ]
  },
  {
    icon: Receipt,
    title: "Receipt Upload",
    description: "Digitize your receipts with OCR",
    details: [
      "Upload receipt images from Home or Transactions",
      "AI extracts amount, date, and category",
      "Auto-creates expense transactions",
      "Supports multiple formats"
    ]
  }
]

export default function HowToUsePage() {
  const [visible, setVisible] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (token && storedUser && storedUser !== "undefined") {
      try { setUser(JSON.parse(storedUser)) } catch {}
    }
    setVisible(true)
  }, [])

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
            <Link href="/chatbot" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-800">
              <MessageSquare className="w-5 h-5" />
              AI Assistant
            </Link>
            <Link href="/how-to-use" className="flex items-center gap-3 px-4 py-2 rounded-md bg-purple-600/10 text-purple-400">
              <Eye className="w-5 h-5" />
              How to Use
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
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className={`text-4xl font-bold text-purple-300 mb-4 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                How to Use Expensio
              </div>
              <div className={`text-lg text-purple-400 transition-all duration-1000 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                Your complete guide to mastering expense tracking
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-6 transition-all duration-1000 hover:scale-105 hover:shadow-2xl ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 0.2 + 0.5}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-purple-200" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl font-bold text-purple-300">{index + 1}</div>
                        <h3 className="text-xl font-semibold text-purple-300">{step.title}</h3>
                      </div>
                      <p className="text-base text-purple-400 mb-4">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li
                            key={detailIndex}
                            className="flex items-start gap-2 text-base text-purple-200"
                          >
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className={`text-center mt-12 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '2.5s' }}>
              <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-8 hover:scale-105 transition-all duration-300">
                <div className="text-2xl font-bold text-purple-300 mb-4">Ready to Get Started?</div>
                <div className="text-base text-purple-400 mb-6">
                  Start tracking your expenses today and take control of your finances!
                </div>
                <Link
                  href="/home"
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-medium transition hover:shadow-lg"
                >
                  <HomeIcon className="w-5 h-5" />
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
