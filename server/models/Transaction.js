const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
)

TransactionSchema.index({ userId: 1, date: -1 })

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema)
