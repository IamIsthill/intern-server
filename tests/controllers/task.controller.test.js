<<<<<<< HEAD
import { describe, expect, vi, it, beforeEach, afterAll, afterEach } from "vitest";
import request from 'supertest'
import { Tasks } from "../../models/Tasks.js";
import mongoose, { Mongoose } from 'mongoose'
=======
import { describe, expect, vi, it, beforeEach, afterAll, afterEach, expectTypeOf } from "vitest";
import request from 'supertest'
import { Tasks } from "../../models/Tasks.js";
import mongoose, { Mongoose } from 'mongoose'
import { createId } from "../../utils/createId.js";
>>>>>>> staging

vi.stubEnv('DATABASE_URI', 'mongodb://localhost:27017/intern-server-test')
const { app } = await import('../../server.js')
vi.mock('../../middleware/auth.js', () => ({
    authenticateJWT: (req, res, next) => {
        req.user = {
            id: '67c8fb3b8362f38125c12b66',
            accountType: 'supervisor'
        }
        next()
    }
}))


describe('GET /tasks/intern', () => {
    const url = '/tasks/intern'
    let internId = '67c8fb3b8362f38125c12b66'
    let task = {
        supervisor: '67c8fb3b8362f38125c12b66',
        title: 'foo',
        description: 'foo',
        deadline: new Date(),
        assignedInterns: [{
<<<<<<< HEAD
            internId: mongoose.Types.ObjectId.createFromTime(internId)
        }
        ]
=======
            internId: new mongoose.Types.ObjectId(internId),
            status: 'pending'
        }]
>>>>>>> staging
    }
    beforeEach(async () => {
        vi.restoreAllMocks()
        await Tasks.deleteMany()
        await Tasks.create(task)
    })

    afterAll(async () => {
        await Tasks.deleteMany()
    })

    it('internId --> 200 and {tasks: array of tasks}', async () => {
        const res = await request(app).get(`${url}?internId=${internId}`)

        expect(res.statusCode).toBe(200)
        expect(res.body.tasks).toEqual(expect.arrayContaining([
            expect.objectContaining({
                supervisor: expect.any(String),
                title: expect.any(String),
                description: expect.any(String),
                deadline: expect.any(String),
                assignedInterns: expect.arrayContaining([
                    expect.objectContaining({
                        internId: expect.any(String),
<<<<<<< HEAD
                        status: 'pending' || 'in-progress' || 'completed' || 'backlogs',
=======
                        status: expect.toBeOneOf(["pending", "in-progress", "completed", "backlogs"])
>>>>>>> staging
                    })
                ])
            })
        ]))

    })
<<<<<<< HEAD
=======

>>>>>>> staging
    it('valid internedId but no tasks --> 200 and {tasks: []}', async () => {
        const lostIntern = new mongoose.Types.ObjectId().toString()
        const res = await request(app).get(`${url}?internId=${lostIntern}`)

        expect(res.status).toBe(200)
        expect(res.body.interns).toEqual(expect.arrayContaining([]))
    })
<<<<<<< HEAD
=======

>>>>>>> staging
    it('invalid params --> 400 and {message: }', async () => {
        const res = await request(app).get(`${url}?notvalid=1233`)

        expect(res.status).toBe(400)
        expect(res.body).toEqual(expect.objectContaining({
            message: expect.any(String)
        }))
    })
<<<<<<< HEAD
=======

    it('valid req from intern --> 200 and array without the assigned interns', async () => {
        vi.resetModules()
        vi.restoreAllMocks()
        const auth = await import('../../middleware/auth.js')
        vi.spyOn(auth, 'authenticateJWT').mockImplementation((req, res, next) => {
            req.user = {
                id: '67c8fb3b8362f38125c12b66',
                accountType: 'intern'
            }
            next()
        })
        const { app } = await import('../../server.js')
        const res = await request(app).get(`${url}?internId=${internId}`)

        expect(res.statusCode).toBe(200)
        expect(res.body.tasks).toEqual(expect.arrayContaining([
            expect.objectContaining({
                supervisor: expect.any(String),
                title: expect.any(String),
                description: expect.any(String),
                deadline: expect.any(String),
                status: expect.toBeOneOf(['pending', 'in-progress', 'completed', 'backlogs'])
            })
        ]))

        res.body.tasks.forEach(task => expect(task).not.toHaveProperty('assignedInterns'))
    })

    it('valid req from supervisor --> 200 and array with the assigned interns from supervisor', async () => {
        vi.resetModules()
        const auth = await import('../../middleware/auth.js')
        vi.spyOn(auth, 'authenticateJWT').mockImplementation((req, res, next) => {
            req.user = {
                id: '67c8fb3b8362f38125c12b66',
                accountType: 'supervisor'
            }
            next()
        })
        const { app } = await import('../../server.js')
        const res = await request(app).get(`${url}?internId=${internId}`)

        expect(res.statusCode).toBe(200)
        expect(res.body.tasks).toEqual(expect.arrayContaining([
            expect.objectContaining({
                supervisor: expect.any(String),
                title: expect.any(String),
                description: expect.any(String),
                deadline: expect.any(String),
                assignedInterns: expect.arrayContaining([
                    expect.objectContaining({
                        internId: expect.any(String),
                        // status: 'pending' || 'in-progress' || 'completed' || 'backlogs',
                        status: expect.toBeOneOf(['pending', 'in-progress', 'completed', 'backlogs'])
                    })
                ])
            })
        ]))
        res.body.tasks.forEach(task => {
            // console.log(task)
        });
    })
>>>>>>> staging
})

describe('POST /tasks', () => {
    const url = '/tasks'

    let mockTask

    beforeEach(async () => {
        vi.resetAllMocks()
        mockTask = {
            title: 'foo',
            description: 'foo',
            deadline: new Date(),
        }
        // await Tasks.create(mockTask)
    })

    afterEach(async () => {
        await Tasks.deleteMany()
    })


    it('valid params, no interns yet --> 200 and created task', async () => {
        const res = await request(app).post(url).send(mockTask)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(expect.objectContaining({
            title: expect.any(String),
            description: expect.any(String),
            deadline: expect.any(String),
            assignedInterns: expect.arrayContaining([])
        }))
    })

    it('valid params with internId --> 200 and created task', async () => {
        const mockIntern1 = new mongoose.Types.ObjectId().toString()
        mockTask.assignedInterns = mockIntern1
        const res = await request(app).post(url).send(mockTask)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(expect.objectContaining({
            title: expect.any(String),
            description: expect.any(String),
            deadline: expect.any(String),
            assignedInterns: expect.arrayContaining([expect.objectContaining({
                internId: expect.any(String),
                status: expect.any(String)
            })])
        }))
    })

    it('valid params with array of Interns --> 200 and created task', async () => {
        const mockIntern1 = new mongoose.Types.ObjectId().toString()
        const mockIntern2 = new mongoose.Types.ObjectId().toString()
        mockTask.assignedInterns = [mockIntern1, mockIntern2]
        const res = await request(app).post(url).send(mockTask)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(expect.objectContaining({
            title: expect.any(String),
            description: expect.any(String),
            deadline: expect.any(String),
            assignedInterns: expect.arrayContaining([expect.objectContaining({
                internId: expect.any(String),
                status: expect.any(String)
            })])
        }))
    })

    it('invalid params --> 400 and {message: }', async () => {
        delete mockTask.description
        const res = await request(app).post(url).send(mockTask)

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual(expect.objectContaining({
            message: expect.any(String)
        }))
    })

    it('unauthorized user --> 401', async () => {
        vi.resetModules()
        const auth = await import('../../middleware/auth.js')
        vi.spyOn(auth, 'authenticateJWT').mockImplementation((req, res, next) => {
            req.user = {
                id: '67c8fb3b8362f38125c12b66',
                accountType: 'intern'
            }
            next()
        })
        const { app } = await import('../../server.js')

        const res = await request(app).post(url).send(mockTask)

        expect(res.statusCode).toBe(401)
        expect(res.body).toEqual(expect.objectContaining({
            message: expect.any(String)
        }))
    })
})
<<<<<<< HEAD
=======

describe('PUT /tasks/task-id', async () => {
    const url = '/tasks'
    const mockInternId = createId()
    vi.doMock('../../middleware/auth.js', () => ({
        authenticateJWT: (req, res, next) => {
            req.user = {
                id: mockInternId.toString(),
                accountType: 'intern'
            }
            next()
        }
    }))
    const { app } = await import('../../server.js')
    let mockTasks

    beforeEach(async () => {
        mockTasks = [
            {
                _id: createId(),
                supervisor: createId(),
                title: "Mock",
                description: 'task',
                deadline: new Date(),
                assignedInterns: [
                    {
                        internId: mockInternId,
                        status: 'pending'
                    },
                    {
                        internId: createId(),
                        status: 'backlogs'
                    }
                ]

            }
        ]

        await Tasks.deleteMany()
        await Tasks.create(mockTasks)
    })

    it('updates the assigned task status', async () => {
        const taskId = mockTasks[0]['_id']
        const res = await request(app).put(`${url}/${taskId}`).send({ status: 'in-progress', internId: mockInternId })


        expect(res.statusCode).toBe(200)
        expect(res.body.task).toEqual(expect.objectContaining({
            title: expect.any(String),
            description: expect.any(String),
            deadline: expect.any(String),
            status: expect.toBeOneOf(['pending', 'in-progress', 'completed', 'backlogs']),
        }))
    })

    it('throws error if a different user updates the task', async () => {
        const taskId = mockTasks[0]['_id']
        const res = await request(app).put(`${url}/${taskId}`).send({ status: 'in-progress', internId: createId() })


        expect(res.statusCode).toBe(500)
    })

})
>>>>>>> staging
