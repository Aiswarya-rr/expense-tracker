const express = require('express')
const Plan = require('../models/Plan')
const admin = require('../middleware/admin')

const router = express.Router()

// GET /api/plans - Get all plans
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find().sort({ price: 1 })
    res.json(plans)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plans' })
  }
})

// POST /api/plans - Add new plan (admin only)
router.post('/', admin, async (req, res) => {
  try {
    const { name, price, duration, features, isPopular } = req.body
    const plan = new Plan({ name, price, duration, features, isPopular })
    await plan.save()
    res.status(201).json(plan)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create plan' })
  }
})

// PUT /api/plans/:id - Update plan (admin only)
router.put('/:id', admin, async (req, res) => {
  try {
    const { name, price, duration, features, isPopular } = req.body
    const plan = await Plan.findByIdAndUpdate(req.params.id, { name, price, duration, features, isPopular }, { new: true })
    if (!plan) return res.status(404).json({ error: 'Plan not found' })
    res.json(plan)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update plan' })
  }
})

// DELETE /api/plans/:id - Delete plan (admin only)
router.delete('/:id', admin, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id)
    if (!plan) return res.status(404).json({ error: 'Plan not found' })
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete plan' })
  }
})

module.exports = router
