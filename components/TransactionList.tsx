"use client"

interface Transaction {
  _id: string
  userId: string
  type: "income" | "expense"
  category: string
  amount: number
  date: string
  description?: string
}

interface TransactionListProps {
  transactions: Transaction[]
}

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions yet.</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx._id} className="flex justify-between items-center border-b pb-2">
              <div>
                <div className="font-medium">{tx.category}</div>
                <div className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</div>
                {tx.description && <div className="text-sm text-gray-600">{tx.description}</div>}
              </div>
              <div className={`font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
