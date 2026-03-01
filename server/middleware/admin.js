module.exports = function admin(req, res, next) {
  const secret = process.env.ADMIN_SECRET || 'supersecret123'
  const token = req.headers['x-admin-token']

  if (!token || token !== secret) {
    return res.status(403).json({ error: 'Admin access denied' })
  }

  next()
}
