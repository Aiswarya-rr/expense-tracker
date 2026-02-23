"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface MonthlyData {
  month: string
  income: number
  expense: number
}

interface CategoryData {
  category: string
  totalAmount: number
}

export default function Analytics() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
      const [monthlyRes, categoryRes] = await Promise.all([
        fetch("http://localhost:4000/api/analytics/monthly", { headers }),
        fetch("http://localhost:4000/api/analytics/category", { headers })
      ])

      if (monthlyRes.ok) {
        const monthly = await monthlyRes.json()
        setMonthlyData(monthly.map((m: any) => ({
          month: m.month.toString(),
          income: m.income || 0,
          expense: m.expense || 0
        })))
      }

      if (categoryRes.ok) {
        const category = await categoryRes.json()
        setCategoryData(category)
      }
    } catch (error) {
      console.error("Failed to fetch analytics", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Expense Tracker - Analytics</h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-semibold mb-8">Analytics</h2>

        {loading ? (
          <div>Loading analytics...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Monthly Summary</h3>
              {monthlyData.length === 0 ? (
                <p className="text-gray-500">No data available</p>
              ) : (
                <div className="space-y-4">
                  {monthlyData.map((month, index) => (
                    <div key={index} className="border-b pb-2">
                      <div className="font-medium">Month {month.month}</div>
                      <div className="text-sm text-green-600">Income: ₹{month.income.toFixed(2)}</div>
                      <div className="text-sm text-red-600">Expenses: ₹{month.expense.toFixed(2)}</div>
                      <div className="text-sm font-semibold">Balance: ₹{(month.income - month.expense).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Category Breakdown</h3>
              {categoryData.length === 0 ? (
                <p className="text-gray-500">No data available</p>
              ) : (
                <div className="space-y-4">
                  {categoryData.map((cat, index) => (
                    <div key={index} className="flex justify-between border-b pb-2">
                      <span className="font-medium">{cat.category}</span>
                      <span className="text-red-600">₹{cat.totalAmount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
