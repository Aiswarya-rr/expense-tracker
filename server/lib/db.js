const mongoose = require('mongoose')
require("dotenv").config();
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) return cached.conn

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in environment variables')
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, { bufferCommands: false })
      .then((m) => m)
  }
  cached.conn = await cached.promise
  return cached.conn
}

module.exports = { connectDB }
