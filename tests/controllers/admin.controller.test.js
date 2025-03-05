import { describe, expect, vi, it } from "vitest";
import httpMocks from 'node-mocks-http'
import { adminFindController } from '../../controllers/admin.controller.js'
import { Admin } from '../../models/Admin.js'

describe('Admin endpoint', () => {
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