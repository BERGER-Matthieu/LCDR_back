import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/LCDR_db'

export async function connectDB() {
  await mongoose.connect(MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  })
  console.log('MongoDB connected')
}

export async function disconnectDB() {
  await mongoose.disconnect()
}