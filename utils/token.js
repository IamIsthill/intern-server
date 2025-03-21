import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/index.js'

export const createToken = (payload, key = JWT_SECRET, expiresIn = '1h') => {
    const token = jwt.sign(payload, key, { expiresIn: expiresIn })
    return token
}