import { vi, describe, it, expect } from 'vitest'
import { validateAccess } from '../../middleware/access.js'
import { JWT_SECRET } from '../../config/index.js'
import jwt from 'jsonwebtoken'
import request from 'supertest'

vi.stubEnv('DATABASE_URI', 'mongodb://localhost:27017/intern-server-test')
const { app } = await import('../../server.js')

describe('Access middleware', () => {
    const token = jwt.sign({ id: 1, email: 'foo@foo.com', accountType: 'admin' }, JWT_SECRET, { expiresIn: 60 * 60 })

    it('returns 401 if request do is not authorized', async () => {
        app.get('/protected', validateAccess('intern'), (req, res, next) => next())

        const res = await request(app).get('/protected').set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(401)
    })

    it('let the request pass through if it is authorized', async () => {
        app.get('/new', validateAccess('admin'), async (req, res, next) => {
            return res.status(200).json({ message: 'Allowed' })
        })
        const res = await request(app).get('/new').set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
    })
})

