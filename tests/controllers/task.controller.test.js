import { describe, expect, vi, it, beforeEach } from "vitest";
import request from 'supertest'
import { Tasks } from "../../models/Tasks.js";
import mongoose, { Mongoose } from 'mongoose'

vi.stubEnv('DATABASE_URI', 'mongodb://localhost:27017/intern-server-test')
const { app } = await import('../../server.js')
vi.mock('../../middleware/auth.js', () => ({
    authenticateJWT: (req, res, next) => next()
}))


describe('GET /tasks/intern', () => {
    const url = '/tasks/intern'
    let internId = '67c8fb3b8362f38125c12b66'
    let task = {
        supervisor: '67c8fb3b8362f38125c12b66',
        title: 'foo',
        description: 'foo',
        status: 'pending',
        deadline: new Date(),
        assignedInterns: [
            mongoose.Types.ObjectId.createFromTime(internId)
        ]
    }
    beforeEach(async () => {
        vi.restoreAllMocks()
        await Tasks.deleteMany()
        await Tasks.create(task)


    })
    it('internId --> 200 and {tasks: array of tasks}', async () => {
        const res = await request(app).get(`${url}?internId=${internId}`)

        expect(res.statusCode).toBe(200)
        expect(res.body.tasks).toEqual(expect.arrayContaining([
            expect.objectContaining({
                supervisor: expect.any(String),
                title: expect.any(String),
                description: expect.any(String),
                status: 'pending' || 'in-progress' || 'completed' || 'backlogs',
                deadline: expect.any(String),
                assignedInterns: expect.arrayContaining([
                    expect.any(String)
                ])
            })
        ]))

    })
    it('valid internedId but no tasks --> 200 and {tasks: []}', async () => {
        const lostIntern = new mongoose.Types.ObjectId().toString()
        const res = await request(app).get(`${url}?internId=${lostIntern}`)

        expect(res.status).toBe(200)
        expect(res.body.interns).toEqual(expect.arrayContaining([]))
    })
    it('invalid params --> 400 and {message: }', async () => {
        const res = await request(app).get(`${url}?notvalid=1233`)

        expect(res.status).toBe(400)
        expect(res.body).toEqual(expect.objectContaining({
            message: expect.any(String)
        }))
    })
})
