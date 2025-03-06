import { Department } from "../../models/Department";
import { beforeEach, describe, expect, it, vi } from "vitest";
import httpMocks from 'node-mocks-http'
import { createDepartmentController, getAllDepartments } from "../../controllers/department.controller";

class Factory {
    constructor() {
        this.baseRequest = httpMocks.createRequest({})
        this.response = httpMocks.createResponse()
        this.next = vi.fn()
        this.requestParam = { department: 'foo' }
        this.request = httpMocks.createRequest({
            body: this.requestParam
        })
    }
}


describe('createDepartmentController', () => {
    let factory
    beforeEach(() => {
        factory = new Factory()
        vi.restoreAllMocks()
    })
    it('returns 400 when department was not passed in the body', async () => {
        const { baseRequest, response, next } = factory
        await createDepartmentController(baseRequest, response, next)

        expect(response.statusCode).toBe(400)
        expect(response._getJSONData()).toEqual(expect.objectContaining({
            message: expect.any(String)
        }))
        expect(next).toBeCalledTimes(0)

    })

    it('returns 400 if department is already existing', async () => {
        const { request, requestParam, response, next } = factory
        const mockFind = vi.spyOn(Department, 'findOne').mockResolvedValue(requestParam)

        await createDepartmentController(request, response, next)

        expect(mockFind).toHaveBeenCalledWith(requestParam)
        expect(response.statusCode).toBe(400)
        expect(response._getJSONData()).toEqual(expect.objectContaining({
            message: expect.any(String)
        }))

        expect(next).toBeCalledTimes(0)
    })

    it('stops when Department:find causes error', async () => {
        const { request, requestParam, response, next } = factory
        const mockFind = vi.spyOn(Department, 'findOne').mockRejectedValue(new Error("Database error"))

        await createDepartmentController(request, response, next)

        expect(mockFind).toHaveBeenCalledWith(requestParam)
        expect(next).toHaveBeenCalledWith(expect.any(Error))

    })

    it('stops when Department:create causes error', async () => {
        const { request, requestParam, response, next } = factory

        // Department does not exist, continue
        vi.spyOn(Department, 'findOne').mockResolvedValue(null)
        // creating the department should throw error
        const mockCreate = vi.spyOn(Department, 'create').mockRejectedValue(new Error('Database error'))

        await createDepartmentController(request, response, next)

        expect(mockCreate).toHaveBeenCalledWith(requestParam)
        expect(next).toHaveBeenCalledWith(expect.any(Error))

    })

    it('returns 201 if department was created', async () => {
        const { request, requestParam, response, next } = factory
        const mockFind = vi.spyOn(Department, 'findOne').mockResolvedValue(null)
        const mockCreate = vi.spyOn(Department, 'create').mockResolvedValue(requestParam)

        await createDepartmentController(request, response, next)

        expect(mockFind).toHaveBeenCalledOnce()
        expect(mockCreate).toHaveBeenCalledOnce()
        expect(response.statusCode).toBe(201)




    })
})

describe('get all departments controller', () => {
    let req, res, next, departments
    beforeEach(() => {
        req = httpMocks.createRequest()
        res = httpMocks.createResponse()
        next = vi.fn()
        departments = [{
            name: 'IT'
        },
        {
            name: 'IS'
        }]
    })
    it('returns 200 if departments is an empty array', async () => {
        vi.spyOn(Department, 'find').mockResolvedValue([])
        await getAllDepartments(req, res, next)

        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toEqual({ departments: [] })

    })
    it('returns 200 if department has content', async () => {
        vi.spyOn(Department, 'find').mockResolvedValue(departments)
        await getAllDepartments(req, res, next)

        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toEqual({ departments: departments })
    })
})

