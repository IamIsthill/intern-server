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

    })
})

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