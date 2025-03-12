import { vi, describe, it, expect, beforeEach } from 'vitest'
import { Supervisor } from '../../models/Supervisor.js'
import { Intern } from '../../models/interns.js'
import request from 'supertest'

vi.stubEnv('DATABASE_URI', 'mongodb://localhost:27017/intern-server-test')
vi.mock('../../middleware/auth.js', () => ({
    authenticateJWT: (req, res, next) => {
        req.user = {
            id: '67c8fb3b8362f38125c12b66',
            accountType: 'admin'
        }
        next()
    }
}))
const { app } = await import('../../server.js')

describe('GET /admin/accounts', () => {
    const url = '/admin/accounts'

    let mockIntern
    let mockSupervisor

    beforeEach(async () => {
        mockSupervisor = {
            firstName: 'sup',
            lastName: 'ppa',
            age: 14,
            email: 'sup@sup.com',
            password: '12345678',
            status: 'active'
        }

        mockIntern = {
            firstName: 'foo',
            lastName: 'bar',
            age: 15,
            phone: '12345678909',
            school: 'dabcat',
            internshipHours: 486,
            email: 'intern@intern.com',
            password: '12345678',
            status: 'active',
            accountType: 'intern'
        }

        await Intern.deleteMany()
        await Supervisor.deleteMany()
        await Intern.create(mockIntern)
        await Supervisor.create(mockSupervisor)
    })
    it('--> array of accounts of both supervisor and users', async () => {
        const res = await request(app).get(url)
        expect(res.body.accounts).toEqual(expect.arrayContaining([
            expect.objectContaining({
                _id: expect.any(String),
                email: expect.any(String),
                accountType: expect.any(String),
                status: expect.toBeOneOf(['active', 'inactive']),
                firstName: expect.any(String),
                lastName: expect.any(String),
            })
        ]))
        expect(res.statusCode).toBe(200)
    })

    it('gets the queried accounts only', async () => {
        const query = 'q=foo'
        const res = await request(app).get(`${url}?${query}`)

        expect(res.body.accounts).toEqual(expect.arrayContaining([
            expect.objectContaining({
                _id: expect.any(String),
                email: expect.any(String),
                accountType: expect.any(String),
                status: expect.toBeOneOf(['active', 'inactive']),
                firstName: expect.any(String),
                lastName: expect.any(String),
            })
        ]))
        expect(res.body.accounts).lengthOf(1)
    })

    it('invalid query parameters --> []', async () => {
        const query = 'invalid=foo'
        const res = await request(app).get(`${url}?${query}`)

        expect(res.body.accounts).lengthOf(0)
    })

    it('accessible only to admin', async () => {
        vi.resetModules()
        vi.doMock('../../middleware/auth.js', () => ({
            authenticateJWT: (req, res, next) => {
                req.user = {
                    accountType: 'intern'
                }
                next()
            }
        }))
        const { app } = await import('../../server.js')

        const res = await request(app).get(`${url}`)

        expect(res.statusCode).toBe(401)
    })

})