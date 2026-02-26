const express = require('express')
const { z } = require('zod')
const auth = require('../middleware/auth')
const Bill = require('../models/Bill.js')
const Transaction = require('../models/Transaction')

const router = express.Router()

const billSchema = z.object({
  name: z.string().min(1),
  amount: z.coerce.number().positive(),
  dueDate: z.coerce.date(),
  category: z.string().min(1),
  recurring: z.enum(['monthly', 'weekly', 'yearly', 'one-time']).default('one-time'),
})

// Create bill
router.post('/', auth, async (req, res) => {
  try {
    const data = billSchema.parse(req.body)
    const bill = await Bill.create({ ...data, userId: req.user.id })
    res.status(201).json(bill)
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors })
    return res.status(500).json({ error: 'Failed to create bill' })
  }
})

// List bills
router.get('/', auth, async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.user.id }).sort({ dueDate: 1 })
    res.json(bills)
  } catch {
    res.status(500).json({ error: 'Failed to fetch bills' })
  }
})

// Pay bill
router.put('/:id/pay', auth, async (req, res) => {
  try {
    const { id } = req.params
    const bill = await Bill.findOne({ _id: id, userId: req.user.id })
    if (!bill) return res.status(404).json({ error: 'Bill not found' })

    // Mark as paid
    bill.paid = true
    bill.paidDate = new Date()
    await bill.save()

    // Add to transactions
    const transaction = await Transaction.create({
      userId: req.user.id,
      type: 'expense',
      category: bill.category,
      amount: bill.amount,
      date: new Date(),
      description: `Paid bill: ${bill.name}`
    })

    // If recurring, create next bill
    if (bill.recurring !== 'one-time') {
      const nextDueDate = new Date(bill.dueDate)
      if (bill.recurring === 'monthly') nextDueDate.setMonth(nextDueDate.getMonth() + 1)
      else if (bill.recurring === 'weekly') nextDueDate.setDate(nextDueDate.getDate() + 7)
      else if (bill.recurring === 'yearly') nextDueDate.setFullYear(nextDueDate.getFullYear() + 1)

      await Bill.create({
        userId: req.user.id,
        name: bill.name,
        amount: bill.amount,
        dueDate: nextDueDate,
        category: bill.category,
        recurring: bill.recurring
      })
    }

    res.json({ bill, transaction })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to pay bill' })
  }
})

// Update bill
router.put('/:id', auth, async (req, res) => {
  try {
    const data = billSchema.partial().parse(req.body)
    const { id } = req.params
    const updated = await Bill.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      data,
      { new: true }
    )
    if (!updated) return res.status(404).json({ error: 'Not found' })
    res.json(updated)
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors })
    return res.status(500).json({ error: 'Failed to update bill' })
  }
})

// Delete bill
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Bill.findOneAndDelete({ _id: id, userId: req.user.id })
    if (!deleted) return res.status(404).json({ error: 'Not found' })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete bill' })
  }
})

module.exports = router
