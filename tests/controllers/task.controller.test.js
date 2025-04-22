import { describe, expect, vi, it, beforeEach, afterAll, afterEach, expectTypeOf, beforeAll } from "vitest";
import request from 'supertest'
import { Tasks } from "../../models/Tasks.js";
import mongoose, { Mongoose } from 'mongoose'
import { createId } from "../../utils/createId.js";
import { faker } from "@faker-js/faker";
import { setup } from "../setup.js";

setup()
const { app } = await import('../../app.js')
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
            internId: new mongoose.Types.ObjectId(internId),
            status: 'pending'
        }]
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
                        status: expect.toBeOneOf(["pending", "in-progress", "completed", "backlogs"])
                    })
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
        const { app } = await import('../../app.js')
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
        const { app } = await import('../../app.js')
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

        expect(res.statusCode).toBe(201)
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

        expect(res.statusCode).toBe(201)
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

        expect(res.statusCode).toBe(201)
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
        const { app } = await import('../../app.js')

        const res = await request(app).post(url).send(mockTask)

        expect(res.statusCode).toBe(401)
        expect(res.body).toEqual(expect.objectContaining({
            message: expect.any(String)
        }))
    })
})

describe('PUT /tasks/:taskid', async () => {
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
    const { app } = await import('../../app.js')
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

function taskFaker() {
    return {
        _id: createId(),
        supervisor: createId(),
        title: faker.book.title(),
        description: faker.lorem.sentences(),
        deadline: faker.date.future(),
        assignedInterns: [{ internId: createId() }, { internId: createId() }]
    }
}

async function taskFactory(count = 1) {
    const tasks = []
    for (let i = 1; i <= count; i++) {
        const task = taskFaker()
        tasks.push(task)
    }
    await Tasks.create(tasks)
    return tasks

}

describe('DELETE /tasks/:taskid', () => {
    const url = '/tasks'
    let tasks

    beforeAll(async () => {
        tasks = await taskFactory(2)
    })

    it('returns 204 on successful delete with no content', async () => {
        const task = tasks[0]
        const res = await request(app).delete(`${url}/${task._id.toString()}`)

        expect(res.statusCode).toBe(204)
    })

    it('returns 400 if id was not found', async () => {
        const taskId = createId()
        const res = await request(app).delete(`${url}/${taskId.toString()}`)

        expect(res.statusCode).toBe(400)

    })

    it('returns 400 if taskid was invalid', async () => {
        const taskId = 'not-valid'
        const res = await request(app).delete(`${url}/${taskId.toString()}`)

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual(expect.objectContaining({
            message: expect.any(String)
        }))
    })


})

describe('GET /tasks/supervisor/:id', () => {
    let mockTasks
    const mockSupervisorId = createId()
    const url = '/tasks/supervisor'

    beforeEach(async () => {
        mockTasks = [
            {
                _id: createId(),
                supervisor: mockSupervisorId,
                title: "Task 1",
                description: 'task',
                deadline: new Date(),
                assignedInterns: [
                    {
                        internId: createId(),
                        status: 'pending'
                    },
                    {
                        internId: createId(),
                        status: 'backlogs'
                    }
                ]

            },
            {
                _id: createId(),
                supervisor: mockSupervisorId,
                title: "Task 2",
                description: 'task',
                deadline: new Date(),
                assignedInterns: [
                    {
                        internId: createId(),
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

    it('returns the tasks array with 200 status code with valid supervisor id', async () => {
        const res = await request(app).get(`${url}/${mockSupervisorId}`)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(expect.objectContaining({
            tasks: expect.arrayContaining([
                expect.objectContaining({
                    _id: expect.any(String),
                    supervisor: expect.any(String),
                    title: expect.any(String),
                    description: expect.any(String),
                    deadline: expect.any(String),
                    assignedInterns: expect.any(Array)
                })
            ])
        }))
        res.body.tasks.forEach(task => {
            if (task.assignedInterns > 0) {
                expect(task.assignedInterns).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        _id: expect.any(String),
                        internId: expect.any(String),
                        status: expect.toBeOneOf(['pending', 'in-progress', 'completed', 'backlogs']),
                    })
                ]))
            }
        })


    })

    it('returns an empty tasks array with 200 if supervisor is not valid or not found', async () => {
        const notExisting = createId()
        const res = await request(app).get(`${url}/${notExisting}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(expect.objectContaining({
            tasks: expect.any(Array)
        }))
        expect(res.body.tasks).toHaveLength(0)
    })
})

// describe('PUT /tasks/supervisor/:taskId', () => {
//     const url = '/tasks/supervisor/'
//     const mockTaskId = createId()
//     const mockInterns = [createId(), createId()]
//     let mockTasks

//     beforeEach(async () => {
//         mockTasks = [
//             {
//                 _id: mockTaskId,
//                 supervisor: createId(),
//                 title: "Mock",
//                 description: 'task',
//                 deadline: new Date(),
//                 assignedInterns: [
//                     {
//                         internId: mockInterns[0],
//                         status: 'pending'
//                     },
//                     {
//                         internId: mockInterns[1],
//                         status: 'backlogs'
//                     }
//                 ]

//             }
//         ]
//         await Tasks.deleteMany()
//         await Tasks.create(mockTasks)
//     })

//     it('returns the updated tasks with newly added intern')
// })


