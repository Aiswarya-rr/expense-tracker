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
    <div className="bg-gradient-to-br from-purple-900 to-purple-950 border border-purple-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-purple-300">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-400 text-base">{error}</div>
        )}
        <div>
          <label className="block text-xl font-medium mb-1 text-white font-semibold">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as "income" | "expense" })}
            className="w-full rounded-md px-3 py-2 bg-purple-950 text-white border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div>
          <label className="block text-xl font-medium mb-1 text-white font-semibold">Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full rounded-md px-3 py-2 bg-purple-950 text-white placeholder:text-purple-500 border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="e.g., Food, Salary"
            required
          />
        </div>
        <div>
          <label className="block text-xl font-medium mb-1 text-white font-semibold">Amount</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full rounded-md px-3 py-2 bg-purple-950 text-white placeholder:text-purple-500 border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <label className="block text-xl font-medium mb-1 text-white font-semibold">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full rounded-md px-3 py-2 bg-purple-950 text-white border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
        </div>
        <div>
          <label className="block text-xl font-medium mb-1 text-white font-semibold">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-md px-3 py-2 bg-purple-950 text-white placeholder:text-purple-500 border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Optional description"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-800 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium transition disabled:opacity-50 hover:shadow-lg"
        >
          {loading ? "Adding..." : "Add Transaction"}
        </button>
      </form>
    </div>
  )
}
