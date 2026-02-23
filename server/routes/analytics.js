const express = require('express')
const auth = require('../middleware/auth')
const Transaction = require('../models/Transaction')

const router = express.Router()

// GET /api/analytics/monthly?year=2026
router.get('/monthly', async (req, res) => {
  try {
    const year = parseInt(req.query.year, 10) || new Date().getUTCFullYear()

    const pipeline = [
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
            $ifNull: [
              {
                $toDouble: {
                  $getField: { field: 'income', input: { $arrayToObject: '$totals' } },
                },
              },
              0,
            ],
          },
          expense: {
            $ifNull: [
              {
                $toDouble: {
                  $getField: { field: 'expense', input: { $arrayToObject: '$totals' } },
                },
              },
              0,
            ],
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

// GET /api/analytics/category?type=expense
router.get('/category', async (req, res) => {
  try {
    const match = {}
    if (req.query.type === 'income' || req.query.type === 'expense') {
      match.type = req.query.type
    }

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
        },
      },
      { $project: { _id: 0, category: '$_id', totalAmount: 1 } },
      { $sort: { totalAmount: -1 } },
    ]

    const results = await Transaction.aggregate(pipeline)
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute category analytics' })
  }
})

module.exports = router
