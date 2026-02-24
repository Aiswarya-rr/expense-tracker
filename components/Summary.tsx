"use client"

interface SummaryProps {
  totalIncome: number
  totalExpense: number
}

export default function Summary({ totalIncome, totalExpense }: SummaryProps) {
  const balance = totalIncome - totalExpense
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4 text-zinc-200">Summary</h2>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Total Income:</span>
          <span className="text-emerald-400 font-medium">₹{totalIncome.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Total Expenses:</span>
          <span className="text-rose-400 font-medium">₹{totalExpense.toFixed(2)}</span>
        </div>
        <div className="h-px bg-zinc-800" />
        <div className="flex items-center justify-between font-semibold">
          <span className="text-zinc-300">Balance:</span>
          <span className={balance >= 0 ? "text-emerald-400" : "text-rose-400"}>₹{balance.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
