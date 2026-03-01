const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null

    if (!token) return res.status(401).json({ error: 'Unauthorized' })

    const payload = jwt.verify(token, 'my-secret-key-for-development')
    req.user = await User.findById(payload.userId)
    if (!req.user) return res.status(401).json({ error: 'User not found' })
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = auth
