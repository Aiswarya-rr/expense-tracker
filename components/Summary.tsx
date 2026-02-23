"use client"

interface SummaryProps {
  totalIncome: number
  totalExpense: number
}

export default function Summary({ totalIncome, totalExpense }: SummaryProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Total Income:</span>
          <span className="text-green-600">₹{totalIncome.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Expenses:</span>
          <span className="text-red-600">₹{totalExpense.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Balance:</span>
          <span className={`₹${(totalIncome - totalExpense).toFixed(2)}`}>
            ₹{(totalIncome - totalExpense).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}
