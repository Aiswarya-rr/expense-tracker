"use client"

import { useState } from "react"

interface BudgetFormProps {
  onSuccess?: () => void
}

export default function BudgetForm({ onSuccess }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    category: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    limit: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          limit: parseFloat(formData.limit) || 0,
        }),
      })

      if (response.ok) {
        setFormData({
          category: "",
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          limit: "",
        })
        onSuccess?.()
      } else {
        const data = await response.json()
        let msg = "Failed to set budget"
        if (Array.isArray(data.error)) {
          msg = data.error.map((e: any) => e.message).join("; ")
        } else if (typeof data.error === "string") {
          msg = data.error
        } else if (typeof data.message === "string") {
          msg = data.message
        }
        setError(msg)
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4 text-zinc-200">Set Monthly Budget</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g., Food, Transport"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Month</label>
            <select
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Year</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              min="2020"
              max="2030"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Budget Limit (₹)</label>
          <input
            type="number"
            value={formData.limit}
            onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            step="0.01"
            min="0"
            placeholder="0.00"
            required
          />
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-2 px-4 rounded-md transition"
        >
          {loading ? "Setting Budget..." : "Set Budget"}
        </button>
      </form>
    </div>
  )
}
