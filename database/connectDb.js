import mongoose from 'mongoose'
import { DATABASE_URI } from '../config'

export const connectDb = async () => {
  try {
    await mongoose.connect(DATABASE_URI)
  } catch (e) {
    console.log('Database error: ', e.message)
  }
}