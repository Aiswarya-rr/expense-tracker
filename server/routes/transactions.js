const express = require('express')
const { z } = require('zod')
const auth = require('../middleware/auth')
const Transaction = require('../models/Transaction')

const router = express.Router()

const txSchema = z.object({
  type: z.enum(['income', 'expense']),
  category: z.string().min(1),
  amount: z.number().positive(),
  description: z.string().optional().default(''),
  date: z.coerce.date().optional(),
})

// Create
router.post('/', auth, async (req, res) => {
  try {
    const data = txSchema.parse(req.body)
    const tx = await Transaction.create({ ...data, userId: req.user.id })
    res.status(201).json(tx)
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors })
    return res.status(500).json({ error: 'Failed to create transaction' })
  }
})

// List (optionally by month/year)
router.get('/', auth, async (req, res) => {
  try {
    const { month, year, type, category } = req.query
    const query = { userId: req.user.id }
    if (type) query.type = type
    if (category) query.category = category
    if (month && year) {
      const y = parseInt(year, 10)
      const m = parseInt(month, 10) - 1
      const start = new Date(Date.UTC(y, m, 1, 0, 0, 0))
      const end = new Date(Date.UTC(y, m + 1, 1, 0, 0, 0))
      query.date = { $gte: start, $lt: end }
    }
    const items = await Transaction.find(query).sort({ date: -1, createdAt: -1 })
    res.json(items)
  } catch {
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
})

// Update
router.put('/:id', auth, async (req, res) => {
  try {
    const data = txSchema.partial().parse(req.body)
    const { id } = req.params
    const updated = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      data,
      { new: true }
    )
    if (!updated) return res.status(404).json({ error: 'Not found' })
    res.json(updated)
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors })
    return res.status(500).json({ error: 'Failed to update transaction' })
  }
})

// Delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Transaction.findOneAndDelete({ _id: id, userId: req.user.id })
    if (!deleted) return res.status(404).json({ error: 'Not found' })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete transaction' })
  }
})

module.exports = router
