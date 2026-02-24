"use client"

interface TransactionFormProps {
  formData: {
    type: "income" | "expense"
    category: string
    amount: string
    date: string
    description: string
  }
  setFormData: (data: any) => void
  handleSubmit: (e: React.FormEvent) => void
  loading: boolean
  error: string
}

export default function TransactionForm({
  formData,
  setFormData,
  handleSubmit,
  loading,
  error,
}: TransactionFormProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4 text-zinc-200">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}
        <div>
          <label className="block text-xs font-medium mb-1 text-zinc-400">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as "income" | "expense" })}
            className="w-full rounded-md px-3 py-2 bg-zinc-950 text-zinc-200 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-zinc-400">Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full rounded-md px-3 py-2 bg-zinc-950 text-zinc-200 placeholder:text-zinc-500 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            placeholder="e.g., Food, Salary"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-zinc-400">Amount</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full rounded-md px-3 py-2 bg-zinc-950 text-zinc-200 placeholder:text-zinc-500 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-zinc-400">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full rounded-md px-3 py-2 bg-zinc-950 text-zinc-200 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-zinc-400">Description (optional)</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-md px-3 py-2 bg-zinc-950 text-zinc-200 placeholder:text-zinc-500 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            placeholder="Optional description"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Transaction"}
        </button>
      </form>
    </div>
  )
}
