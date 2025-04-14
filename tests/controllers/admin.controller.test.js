import { vi, describe, it, expect, beforeEach } from 'vitest'
import { Supervisor } from '../../models/Supervisor.js'
import { Intern } from '../../models/interns.js'
import request from 'supertest'
import mongoose from 'mongoose'
import { testDb } from '../helper'

testDb()
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
            accountType: 'intern',
            isApproved: 'approved'
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

describe('GET /admin/accounts/intern-request', () => {
    const url = '/admin/accounts/intern-request'
    let mockInterns

    beforeEach(async () => {
        mockInterns = [
            {
                firstName: 'foo',
                lastName: 'bar',
                age: 15,
                phone: '12345678909',
                school: 'dabcat',
                internshipHours: 486,
                email: 'intern@intern.com',
                password: '12345678',
                status: 'active',
                accountType: 'intern',
                isApproved: 'pending'
            },
            {
                firstName: 'bar',
                lastName: 'foo',
                age: 15,
                phone: '12345678919',
                school: 'dabcat',
                internshipHours: 486,
                email: 'bar@foo.com',
                password: '12345678',
                status: 'active',
                accountType: 'intern',
                isApproved: 'approved'
            },
        ]

        await Intern.deleteMany()
        await Intern.create(mockInterns)
    })

    it('returns intern accounts[isApproved: pending]', async () => {
        const res = await request(app).get(url)

        expect(res.statusCode).toBe(200)
        expect(res.body.accounts).lengthOf(1)
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

        const res = await request(app).get(url)

        expect(res.statusCode).toBe(401)

    })
})

describe('PUT /admin/accounts/intern-request', () => {
    const url = '/admin/accounts/intern-request'
    let mockInterns

    beforeEach(async () => {
        mockInterns = [
            {
                _id: new mongoose.Types.ObjectId(),
                firstName: 'foo',
                lastName: 'bar',
                age: 15,
                phone: '12345678909',
                school: 'dabcat',
                internshipHours: 486,
                email: 'intern@intern.com',
                password: '12345678',
                status: 'inactive',
                accountType: 'intern',
                isApproved: 'pending'
            },
            {
                _id: new mongoose.Types.ObjectId(),
                firstName: 'bar',
                lastName: 'foo',
                age: 15,
                phone: '12345678919',
                school: 'dabcat',
                internshipHours: 486,
                email: 'bar@foo.com',
                password: '12345678',
                status: 'inactive',
                accountType: 'intern',
                isApproved: 'approved'
            },
        ]

        await Intern.deleteMany()
        await Intern.create(mockInterns)
    })

    it('valid internId --> updated Intern with isApproved to approved', async () => {
        const internId = mockInterns[0]['_id'].toString()
        const res = await request(app).put(url).send({ internId: internId, isApproved: true })

        expect(res.body.account).toEqual(expect.objectContaining({
            _id: expect.any(String),
            email: expect.any(String),
            accountType: expect.any(String),
            status: 'active',
            firstName: expect.any(String),
            lastName: expect.any(String),
        }))
        expect(res.statusCode).toBe(200)
    })
    it('valid internId --> updated Intern with isApproved to rejected', async () => {
        const internId = mockInterns[0]['_id'].toString()
        const res = await request(app).put(url).send({ internId: internId, isApproved: false })

        expect(res.body.account).toEqual(expect.objectContaining({
            _id: expect.any(String),
            email: expect.any(String),
            accountType: expect.any(String),
            status: 'inactive',
            firstName: expect.any(String),
            lastName: expect.any(String),
        }))
        expect(res.statusCode).toBe(200)
    })
})
