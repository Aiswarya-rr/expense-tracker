const express = require('express')
const admin = require('../middleware/admin')
const User = require('../models/User')
const Transaction = require('../models/Transaction')

const router = express.Router()

router.get('/overview', admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const premiumUsers = await User.countDocuments({ isPremium: true })
    const freeUsers = totalUsers - premiumUsers

    const tx = await Transaction.aggregate([
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
        },
      },
    ])

    const income = tx.find(t => t._id === 'income')?.totalAmount || 0
    const expense = tx.find(t => t._id === 'expense')?.totalAmount || 0

    res.json({
      totalUsers,
      premiumUsers,
      freeUsers,
      totalIncome: income,
      totalExpense: expense,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to load overview' })
  }
})

router.get('/users', admin, async (req, res) => {
  try {
    const users = await User.find({}, { name: 1, email: 1, isPremium: 1 }).sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to load users' })
  }
})

router.put('/users/:id/subscription', admin, async (req, res) => {
  try {
    const { plan } = req.body
    const isPremium = plan === 'pro'
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isPremium },
      { new: true }
    ).select('name email isPremium')

    if (!user) return res.status(404).json({ error: 'User not found' })

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update subscription' })
  }
})

// Simple how-to-use content stored in memory for now
let howToUse = [
  { id: 1, title: 'Getting Started', body: 'Create an account, add your first expense, and set a budget.' },
  { id: 2, title: 'Using Budgets', body: 'Track spending per category and get alerts when near limits.' },
]

router.get('/how-to-use', admin, (req, res) => {
  res.json(howToUse)
})

router.put('/how-to-use', admin, (req, res) => {
  const { sections } = req.body
  if (!Array.isArray(sections)) {
    return res.status(400).json({ error: 'sections must be an array' })
  }
  howToUse = sections.map((s, index) => ({
    id: s.id || index + 1,
    title: s.title || '',
    body: s.body || '',
  }))
  res.json(howToUse)
})

module.exports = router
