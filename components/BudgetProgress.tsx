"use client"

interface CategoryData {
  category: string
  spent: number
  budget: number
  remaining: number
  percentage: number
  status: 'good' | 'warning' | 'overspent' | 'no-budget'
}

interface BudgetProgressProps {
  categoryData: CategoryData[]
}

export default function BudgetProgress({ categoryData }: BudgetProgressProps) {
  const warnings = categoryData.filter(c => c.status === 'warning')
  const overspent = categoryData.filter(c => c.status === 'overspent')

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4 text-zinc-200">Budget Progress</h2>

      {/* Alerts */}
      {warnings.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-900/50 border border-yellow-700 rounded-md">
          <div className="text-yellow-400 text-sm font-medium">⚠️ Budget Warnings</div>
          <div className="text-yellow-300 text-sm mt-1">
            Nearing limit: {warnings.map(w => w.category).join(', ')}
          </div>
        </div>
      )}
      {overspent.length > 0 && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md">
          <div className="text-red-400 text-sm font-medium">🚨 Overspending Alerts</div>
          <div className="text-red-300 text-sm mt-1">
            {overspent.map(o => `${o.category} (over by ₹${(o.spent - o.budget).toFixed(2)})`).join(', ')}
          </div>
        </div>
      )}

      {categoryData.length === 0 ? (
        <p className="text-zinc-500">No budget data available</p>
      ) : (
        <div className="space-y-4">
          {categoryData.map((cat) => (
            <div key={cat.category} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-200 font-medium">{cat.category}</span>
                <span className="text-zinc-400">
                  ₹{cat.spent?.toFixed(2) || '0.00'} {cat.budget > 0 ? `/ ₹${cat.budget?.toFixed(2) || '0.00'}` : ''}
                  {cat.budget > 0 && ` (${cat.percentage?.toFixed(1) || '0.0'}%)`}
                </span>
              </div>
              {cat.budget > 0 ? (
                <div className="w-full h-2 bg-zinc-800 rounded">
                  <div
                    className={`h-2 rounded ${
                      cat.status === 'overspent'
                        ? 'bg-red-500'
                        : cat.status === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                  />
                </div>
              ) : (
                <div className="text-xs text-zinc-500">No budget set</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
