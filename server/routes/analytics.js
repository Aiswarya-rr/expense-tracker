const express = require('express')
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const Budget = require('../models/Budget')
const Transaction = require('../models/Transaction')
const { transporter } = require('../lib/mailer')

const router = express.Router()

// GET /api/analytics/monthly?year=2026
router.get('/monthly', auth, async (req, res) => {
  try {
    const year = parseInt(req.query.year, 10) || new Date().getUTCFullYear()

    const pipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: { month: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      {
        $group: {
          _id: '$_id.month',
          totals: {
            $push: { k: '$_id.type', v: '$total' },
          },
        },
      },
      {
        $project: {
          month: '$_id',
          income: {
            $reduce: {
              input: '$totals',
              initialValue: 0,
              in: {
                $cond: {
                  if: { $eq: ['$$this.k', 'income'] },
                  then: '$$this.v',
                  else: '$$value'
                }
              }
            }
          },
          expense: {
            $reduce: {
              input: '$totals',
              initialValue: 0,
              in: {
                $cond: {
                  if: { $eq: ['$$this.k', 'expense'] },
                  then: '$$this.v',
                  else: '$$value'
                }
              }
            }
          },
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ]

    const results = await Transaction.aggregate(pipeline)
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute monthly analytics' })
  }
})

// GET /api/analytics/category?type=expense&month=2&year=2026
router.get('/category', auth, async (req, res) => {
  try {
    const year = parseInt(req.query.year, 10) || new Date().getUTCFullYear()
    const month = parseInt(req.query.month, 10) || new Date().getUTCMonth() + 1
    const match = { userId: new mongoose.Types.ObjectId(req.user.id) }
    if (req.query.type === 'income' || req.query.type === 'expense') {
      match.type = req.query.type
    }

    const spentPipeline = [
      { $match: match },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
        },
      },
    ]

    const spentResults = await Transaction.aggregate(spentPipeline)

    const budgets = await Budget.find({ userId: req.user.id, month, year })

    console.log('spentResults:', spentResults)
    console.log('budgets:', budgets)

    const budgetMap = budgets.reduce((map, b) => {
      map[b.category] = b.limit
      return map
    }, {})

    const spentMap = spentResults.reduce((map, s) => {
      map[s._id] = s.totalAmount
      return map
    }, {})

    const allCategories = new Set([...Object.keys(budgetMap), ...Object.keys(spentMap)])

    const results = Array.from(allCategories).map(cat => {
      const spent = spentMap[cat] || 0
      const budget = budgetMap[cat] || 0
      const remaining = budget - spent
      const percentage = budget > 0 ? (spent / budget) * 100 : 0
      const status = budget === 0 ? 'no-budget' : percentage > 100 ? 'overspent' : percentage > 80 ? 'warning' : 'good'
      return {
        category: cat,
        spent,
        budget,
        remaining,
        percentage,
        status
      }
    })

    results.sort((a, b) => b.spent - a.spent)

    // Send email notification for overspent budgets
    const overspentCategories = results.filter(c => c.status === 'overspent')
    console.log('req.user:', req.user)
    console.log('Overspent categories:', overspentCategories.length, 'User email:', req.user.email)
    if (overspentCategories.length > 0 && req.user.email) {
      console.log('Sending budget exceeded email to:', req.user.email, 'for categories:', overspentCategories.map(c => c.category))
      const msg = {
        to: req.user.email,
        from: process.env.FROM_EMAIL || 'noreply@expensio.com',
        subject: 'Budget Exceeded Alert - Expensio',
        text: `Your budget has been exceeded for the following categories: ${overspentCategories.map(c => `${c.category} (₹${(c.spent - c.budget).toFixed(2)} over)`).join(', ')}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7c3aed;">Budget Exceeded Alert</h2>
            <p>Your budget has been exceeded for the following categories:</p>
            <ul>
              ${overspentCategories.map(c => `<li><strong>${c.category}</strong>: ₹${(c.spent - c.budget).toFixed(2)} over budget</li>`).join('')}
            </ul>
            <p>Please review your expenses in the <a href="http://localhost:3003/analytics" style="color: #7c3aed;">Analytics</a> section.</p>
            <p>Best regards,<br>Expensio Team</p>
          </div>
        `
      }
      transporter.sendMail(msg).catch(err => console.error('Email send error:', err))
    }

    console.log('Category results for user', req.user.id, ':', results)

    res.json(results)
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute category analytics' })
  }
})

// GET /api/analytics/daily?month=2&year=2026
router.get('/daily', auth, async (req, res) => {
  try {
    const month = parseInt(req.query.month, 10) || new Date().getUTCMonth() + 1
    const year = parseInt(req.query.year, 10) || new Date().getUTCFullYear()
    const start = new Date(Date.UTC(year, month - 1, 1))
    const end = new Date(Date.UTC(year, month, 1))

    const pipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id), type: 'expense', date: { $gte: start, $lt: end } } },
      { $group: { _id: { $dayOfMonth: '$date' }, total: { $sum: '$amount' } } },
      { $project: { day: '$_id', total: 1, _id: 0 } },
      { $sort: { day: 1 } }
    ]

    const results = await Transaction.aggregate(pipeline)
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute daily analytics' })
  }
})

module.exports = router
