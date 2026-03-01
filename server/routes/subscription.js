const express = require('express')
const Razorpay = require('razorpay')
const crypto = require('crypto')
const auth = require('../middleware/auth')
const User = require('../models/User')

const router = express.Router()

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

router.post('/create-order', auth, async (req, res) => {
  try {
    const { plan } = req.body
    let amount = 100 // 1 INR in paise
    if (plan === 'yearly') amount = 1000 // 10 INR

    const options = {
      amount,
      currency: 'INR',
      receipt: `rec_${Date.now()}`
    }

    const order = await instance.orders.create(options)
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    })
  } catch (error) {
    console.error(error)
    // Bubble up Razorpay error details for debugging
    const err = error && error.error ? error.error : error
    res.status(500).json({
      error: 'Failed to create order',
      details: {
        statusCode: error?.statusCode,
        code: err?.code,
        reason: err?.reason,
        step: err?.step,
        description: err?.description,
        metadata: err?.metadata,
      }
    })
  }
})

router.post('/verify', auth, async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + '|' + paymentId)
      .digest('hex')

    if (signature === expectedSignature) {
      await User.findByIdAndUpdate(req.user.id, { isPremium: true })
      res.json({ success: true, message: 'Payment verified and subscription activated' })
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' })
    }
  } catch (error) {
    console.error(error)
    const err = error && error.error ? error.error : error
    res.status(500).json({
      error: 'Verification failed',
      details: {
        statusCode: error?.statusCode,
        code: err?.code,
        reason: err?.reason,
        step: err?.step,
        description: err?.description,
        metadata: err?.metadata,
      }
    })
  }
})

module.exports = router
