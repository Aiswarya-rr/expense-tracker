const express = require('express')
const auth = require('../middleware/auth')
const { transporter } = require('../lib/mailer')

const router = express.Router()

router.post('/', auth, async (req, res) => {
  try {
    const { subject, message } = req.body

    const mailOptions = {
      from: req.user.email,
      to: process.env.FROM_EMAIL,
      subject: `Contact: ${subject}`,
      text: `From: ${req.user.email}\n\n${message}`,
      html: `<p><strong>From:</strong> ${req.user.email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`
    }

    await transporter.sendMail(mailOptions)

    res.json({ success: true, message: 'Message sent successfully' })
  } catch (err) {
    console.error('Email send error:', err)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

module.exports = router
