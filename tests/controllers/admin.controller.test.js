<<<<<<< HEAD
import { describe, expect, vi, it, beforeEach } from "vitest";
import httpMocks from 'node-mocks-http'
import { adminFindController, adminLoginController } from '../../controllers/admin.controller.js'
import { Admin } from '../../models/Admin.js'

describe('Admin find endpoint', () => {
    it('returns 400 and error if email was not found in the request body', async () => {
        const request = httpMocks.createRequest()
        const response = httpMocks.createResponse()
        const next = vi.fn()

        await adminFindController(request, response, next)

        expect(response.statusCode).toEqual(400)
        expect(next).toHaveBeenCalledTimes(0)
    })

    it('returns 400 if email was not found in database', async () => {
        const params = { email: 'foo@bar.com' }
        const request = httpMocks.createRequest({
            body: params
        })
        const response = httpMocks.createResponse()
        const next = vi.fn()
        const mockFind = vi.spyOn(Admin, 'findOne').mockReturnValue({
            select: vi.fn().mockReturnThis(),
            lean: vi.fn().mockResolvedValue(null)
        });

        await adminFindController(request, response, next)

        expect(response.statusCode).toBe(400)
        expect(mockFind).toBeCalledWith(params)
        expect(next).toHaveBeenCalledTimes(0)
    })

    it('returns status 201 and the admin user once found', async () => {
        const params = { email: 'foo@bar.com' }
        const request = httpMocks.createRequest({
            body: params
        })
        const response = httpMocks.createResponse()
        const next = vi.fn()
        const sampleUser = {
            firstName: 'Foo',
            lastName: 'Bar',
            email: 'foo@bar.com',
            accountType: 'admin'
        }

        const mockFind = vi.spyOn(Admin, 'findOne').mockReturnValue({
            select: vi.fn().mockReturnThis(),
            lean: vi.fn().mockResolvedValue(sampleUser)
        });

        await adminFindController(request, response, next)

        expect(mockFind).toHaveBeenCalledWith(params)
        expect(response._getJSONData()).toStrictEqual(sampleUser)
        expect(response.statusCode).toBe(201)
=======
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { Supervisor } from '../../models/Supervisor.js'
import { Intern } from '../../models/interns.js'
import request from 'supertest'
import mongoose from 'mongoose'

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
>>>>>>> staging

    })
})

<<<<<<< HEAD
describe('Admin login controller', () => {
    let req, res, next, admin, fakeHash

    beforeEach(() => {
        req = httpMocks.createRequest()
        res = httpMocks.createResponse()
        next = vi.fn()
        fakeHash = "$2a$10$wHerf6FIh4oxp0RO51zt1ujKryoT4J3drqv75.sPOC/Pa5W.c0ldK"
        admin = {
            email: "admin@admin.com",
            password: '12345678'
        }
    })

    it('returns 400 when the required params was not passed', async () => {
        await adminLoginController(req, res, next)

        expect(res.statusCode).toBe(400)
        expect(res._getJSONData()).toEqual({ message: expect.any(String) })
    })

    it('returns 400 when the required params was not the correct variable', async () => {
        req.body = {
            email: "foo@email",
            password: 1234563
        }

        await adminLoginController(req, res, next)

        expect(res.statusCode).toBe(400)
        expect(res._getJSONData()).toEqual({ message: expect.any(String) })
    })

    it('returns 400 when user was not found', async () => {
        admin.email = "not-existing email"
        req.body = admin

        vi.spyOn(Admin, 'findOne').mockReturnValue({
            lean: vi.fn().mockResolvedValue(null)
        })
        await adminLoginController(req, res, next)

        expect(res.statusCode).toBe(400)
        expect(res._getJSONData()).toEqual({ message: "User not found" })
    })

    it('returns 400 when password is incorrect', async () => {
        admin.password = 'incorrect-password'
        req.body = admin

        vi.spyOn(Admin, 'findOne').mockReturnValue({
            lean: vi.fn().mockResolvedValue({ email: admin.email, password: fakeHash })
        })
        await adminLoginController(req, res, next)

        expect(res.statusCode).toBe(400)
        expect(res._getJSONData()).toEqual({ message: "Invalid credentials" })
    })

    it('returns 200 and token once user passed the checks', async () => {
        req.body = admin

        vi.spyOn(Admin, 'findOne').mockReturnValue({
            lean: vi.fn().mockResolvedValue({ email: admin.email, password: fakeHash })
        })
        await adminLoginController(req, res, next)

        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toEqual(expect.objectContaining({
            message: "Login Successful",
            token: expect.any(String)
        }))
    })
})
=======
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
            status: 'active',
            firstName: expect.any(String),
            lastName: expect.any(String),
        }))
        expect(res.statusCode).toBe(200)
    })
})
>>>>>>> staging
