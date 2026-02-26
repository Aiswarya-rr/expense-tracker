const mongoose = require('mongoose')

const BillSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  category: { type: String, required: true },
  recurring: { type: String, enum: ['monthly', 'weekly', 'yearly', 'one-time'], default: 'one-time' },
  paid: { type: Boolean, default: false },
  paidDate: { type: Date },
}, { timestamps: true })

module.exports = mongoose.models.Bill || mongoose.model('Bill', BillSchema)
