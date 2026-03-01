"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import BudgetForm from "../../components/BudgetForm"
import BudgetProgress from "../../components/BudgetProgress"
import Sidebar from "../../components/Sidebar"

interface CategoryData {
  category: string
  spent: number
  budget: number
  remaining: number
  percentage: number
  status: 'good' | 'warning' | 'overspent' | 'no-budget'
}

export default function BudgetsPage() {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/auth/signup"
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (token && storedUser && storedUser !== "undefined") {
      try { setUser(JSON.parse(storedUser)) } catch {}
    }
    fetchCategoryData()
  }, [])

  const fetchCategoryData = async () => {
    setLoading(true)
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
      const response = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/analytics/category?type=expense", { headers })
      if (response.ok) {
        const data = await response.json()
        setCategoryData(data)
      }
    } catch (error) {
      console.error("Failed to fetch category data", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="min-h-screen bg-black text-zinc-200 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-black text-purple-200">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar user={user} onLogout={handleLogout} />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-2xl font-bold text-purple-300 mb-6">Budgets</div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-6">
                <BudgetForm onSuccess={fetchCategoryData} />
              </div>

              <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border border-purple-800 p-6">
                <div className="text-lg font-semibold text-purple-300 mb-4">Budget Progress</div>
                <div className="text-base">
                  <BudgetProgress categoryData={categoryData} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
