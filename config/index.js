<<<<<<< HEAD
import "dotenv/config";
import { toBool } from "../utils/index.js";

export const DEVELOPMENT = toBool(process.env.DEVELOPMENT);
export const JWT_SECRET = process.env.JWT_SECRET;
export * from "./database.config.js";
=======
import 'dotenv/config'
import { toBool } from '../utils/index.js'

export const DEVELOPMENT = toBool(process.env.DEVELOPMENT)
export const JWT_SECRET = process.env.JWT_SECRET
export * from './database.config.js'

>>>>>>> staging
