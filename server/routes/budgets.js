const express = require('express')
const { z } = require('zod')
const auth = require('../middleware/auth')
const Budget = require('../models/Budget')

const router = express.Router()

const budgetSchema = z.object({
  category: z.string().min(1),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int(),
  limit: z.coerce.number().positive(),
})

// Create or update budget (upsert)
router.post('/', auth, async (req, res) => {
  try {
    const data = budgetSchema.parse(req.body)
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id, category: data.category, month: data.month, year: data.year },
      { ...data, userId: req.user.id },
      { upsert: true, new: true }
    )
    res.status(201).json(budget)
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors })
    return res.status(500).json({ error: 'Failed to create/update budget' })
  }
})

// List budgets (optionally by month/year)
router.get('/', auth, async (req, res) => {
  try {
    const { month, year } = req.query
    const query = { userId: req.user.id }
    if (month) query.month = parseInt(month, 10)
    if (year) query.year = parseInt(year, 10)
    const budgets = await Budget.find(query).sort({ year: -1, month: -1, category: 1 })
    res.json(budgets)
  } catch {
    res.status(500).json({ error: 'Failed to fetch budgets' })
  }
})

// Update specific budget
router.put('/:id', auth, async (req, res) => {
  try {
    const data = budgetSchema.partial().parse(req.body)
    const { id } = req.params
    const updated = await Budget.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      data,
      { new: true }
    )
    if (!updated) return res.status(404).json({ error: 'Not found' })
    res.json(updated)
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors })
    return res.status(500).json({ error: 'Failed to update budget' })
  }
})

// Delete budget
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Budget.findOneAndDelete({ _id: id, userId: req.user.id })
    if (!deleted) return res.status(404).json({ error: 'Not found' })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete budget' })
  }
})

module.exports = router
