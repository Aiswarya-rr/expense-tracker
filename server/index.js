require('dotenv').config({ path: '../.env.local' })
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const multer = require('multer')

const { connectDB } = require('./lib/db')

const authRoutes = require('./routes/auth')
const auth = require('./middleware/auth')
const txRoutes = require('./routes/transactions')
const analyticsRoutes = require('./routes/analytics')
const budgetRoutes = require('./routes/budgets')
const chatbotRoutes = require('./routes/chatbot')
const billRoutes = require('./routes/bills')
const adminRoutes = require('./routes/admin')
const plansRoutes = require('./routes/plans')
const contactRoutes = require('./routes/contact')

const upload = multer({ dest: 'uploads/' })

const app = express()

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (['http://localhost:3000', 'http://localhost:3003'].includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  }
}))
app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/transactions', txRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/budgets', budgetRoutes)
app.use('/api/chatbot', chatbotRoutes)
app.use('/api/bills', billRoutes)
app.use('/api/subscription', require('./routes/subscription'))
app.use('/api/admin', adminRoutes)
app.use('/api/plans', plansRoutes)
app.use('/api/contact', contactRoutes)

app.post('/api/upload-receipt', auth, upload.single('receipt'), async (req, res) => {
  try {
    // simulate OCR
    const parsed = {
      amount: 100,
      date: new Date().toISOString().split('T')[0],
      category: 'food',
      description: 'Receipt upload'
    }
    // create transaction
    const Transaction = require('./models/Transaction')
    const transaction = await Transaction.create({
      userId: req.user.id,
      type: 'expense',
      category: parsed.category,
      amount: parsed.amount,
      date: parsed.date,
      description: parsed.description
    })
    res.json(transaction)
  } catch (error) {
    res.status(500).json({ error: 'Failed to process receipt' })
  }
})

const PORT = process.env.PORT || 4000

connectDB()
  .then(async () => {
    // Insert sample data to create collections
    const User = require('./models/User')
    const Transaction = require('./models/Transaction')
    const Plan = require('./models/Plan')

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

      // Create sample plans
      await Plan.deleteMany()
      await Plan.create([
        {
          name: 'Monthly',
          price: 10,
          duration: 'monthly',
          features: ['Unlimited transactions', 'Advanced analytics & charts', 'Export to PDF/Excel', 'Priority support'],
          isPopular: false
        },
        {
          name: 'Yearly',
          price: 100,
          duration: 'yearly',
          features: ['All monthly features', 'Early access to new features', 'Custom categories', 'Dedicated account manager'],
          isPopular: true
        }
      ])
      console.log('Sample plans created')
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
