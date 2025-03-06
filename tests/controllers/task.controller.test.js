import { describe, expect, vi, it, beforeEach } from "vitest";
import httpMocks from 'node-mocks-http'
import { Tasks } from "../../models/Tasks.js";
import { getTasksByInternIdController } from "../../controllers/task.controller.js";
import { findTasksByInternId } from "../../services/tasks.services.js";
import mongoose from 'mongoose'

vi.mock("../../services/tasks.services", () => ({
    findTasksByInternId: vi.fn(),
}));

describe('getTasksByInternController endpoint', () => {
    let req, res, next, params, task

    beforeEach(() => {
        req = httpMocks.createRequest()
        res = httpMocks.createResponse()
        next = vi.fn()
        params = {
            internId: "67c8fb3b8362f38125c12b66"
        }

        task = {
            supervisor: '67c8fb3b8362f38125c12b66',
            title: 'foo',
            description: 'foo',
            status: 'pending',
            deadline: new Date(),
            assignedInterns: [
                mongoose.Types.ObjectId.createFromTime('67c8fb3b8362f38125c12b66')
            ]
        }
    })

    it('returns 400 if required params is missing', async () => {
        await getTasksByInternIdController(req, res, next)

        expect(res.statusCode).toBe(400)
        expect(next).toHaveBeenCalledTimes(0)
        expect(res._getJSONData()).toEqual({
            message: expect.any(String)
        })
    })

    it('returns 200 and empty array if intern was not in tasks assignedinterns', async () => {
        req.query = params

        findTasksByInternId.mockResolvedValue([])
        await getTasksByInternIdController(req, res, next)

        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toEqual({
            tasks: []
        })
        expect(findTasksByInternId).toHaveBeenCalledWith(req.query.internId)
    })

    it('returns 200 and an array of interns if intern was found in tasks', async () => {
        req.query = params
        findTasksByInternId.mockResolvedValue([task])
        await getTasksByInternIdController(req, res, next)

        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toEqual({
            tasks: expect.any(Array)
        })
        expect(res._getJSONData().tasks.length).toBeGreaterThan(0)
        expect(findTasksByInternId).toHaveBeenCalledWith(req.query.internId)
    })
})