import 'dotenv/config'
import { toBool } from '../utils/index.js'

export const DEVELOPMENT = toBool(process.env.DEVELOPMENT)
export * from './database.config.js'

