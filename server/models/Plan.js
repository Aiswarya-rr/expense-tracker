const mongoose = require('mongoose')

const PlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: String, required: true, enum: ['monthly', 'yearly'] },
    features: [{ type: String, trim: true }],
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = mongoose.models.Plan || mongoose.model('Plan', PlanSchema)
