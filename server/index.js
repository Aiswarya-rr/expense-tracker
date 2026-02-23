require('dotenv').config({ path: '../.env.local' })
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const { connectDB } = require('./lib/db')

const authRoutes = require('./routes/auth')
const txRoutes = require('./routes/transactions')
const analyticsRoutes = require('./routes/analytics')

const app = express()

app.use(cors({ origin: 'http://localhost:3003' }))
app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/transactions', txRoutes)
app.use('/api/analytics', analyticsRoutes)

const PORT = process.env.PORT || 4000

connectDB()
  .then(async () => {
    // Insert sample data to create collections
    const User = require('./models/User')
    const Transaction = require('./models/Transaction')

    try {
      // Create or update sample user with password '123'
      await User.updateOne(
        { email: 'demo@example.com' },
        { name: 'Demo User', email: 'demo@example.com', password: await bcrypt.hash('123', 10) },
        { upsert: true }
      )
      console.log('Sample user created or updated')

      // Check if sample transaction exists
      const sampleTx = await Transaction.findOne({ description: 'Demo Expense' })
      if (!sampleTx) {
        const user = await User.findOne({ email: 'demo@example.com' })
        if (user) {
          await Transaction.create({
            userId: user._id,
            type: 'expense',
            category: 'Food',
            amount: 250,
            description: 'Demo Expense',
            date: new Date()
          })
          console.log('Sample transaction created')
        }
      }
    } catch (err) {
      console.error('Error inserting sample data:', err)
    }

    app.listen(PORT, () => {
      console.log(`Express API running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to start server', err)
    process.exit(1)
  })
