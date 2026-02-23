import mongoose from "mongoose"

export interface IExpense extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  amount: number
  description: string
  category: string
  date: Date
  createdAt: Date
  updatedAt: Date
}

const ExpenseSchema = new mongoose.Schema<IExpense>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["food", "transport", "entertainment", "shopping", "bills", "other"],
      default: "other",
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Prevent duplicate model compilation
export default mongoose.models.Expense || mongoose.model<IExpense>("Expense", ExpenseSchema)
