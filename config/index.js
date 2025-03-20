import 'dotenv/config'
import { toBool } from '../utils/index.js'

export const DEVELOPMENT = toBool(process.env.DEVELOPMENT)
export const JWT_SECRET = process.env.JWT_SECRET
export const EMAIL_PASS = process.env.EMAIL_PASS
export const EMAIL = process.env.EMAIL
export * from './database.config.js'

