import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import request from 'supertest'
import { Intern } from "../../models/interns.js";
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { createToken } from '../../utils/token.js';
import { InternFactory, } from '../models/Intern.fake.js';
import { createId } from '../../utils/createId.js';

vi.stubEnv('DATABASE_URI', 'mongodb://localhost:27017/intern-server-test')
vi.mock('../../middleware/auth.js', () => ({
    authenticateJWT: (req, res, next) => {
        req.user = {
            email: 'foo@foo.com'
        }
        next()
    }
}))

vi.mock('../../services/mail.js', () => (
    {
        sendEmail: vi.fn()
    }
))

const { app } = await import('../../server.js')
const { sendEmail } = await import('../../services/mail.js')
const { RESET_TOKEN } = await import('../../config/index.js')


describe('GET /interns/all', () => {
    const mockSupervisor = '67cbe4e6b85278919bc52ebc'
    const internFactory = new InternFactory(4, { supervisor: (mockSupervisor) })

    beforeEach(async () => {
        await Intern.deleteMany({})
        await internFactory.create()
    })

    it('returns 200 and all interns', async () => {
        const res = await request(app).get('/interns/all')

        expect(res.status).toBe(200)
        expect(res.body.interns).toEqual(expect.arrayContaining([
            expect.any(Object)
        ]))
    })
    it('handle errors', async () => {
        vi.spyOn(Intern, 'find').mockReturnValue({
            select: vi.fn().mockRejectedValue(new Error('Database error'))
        })

        const res = await request(app).get('/interns/all')

        expect(res.status).toBe(500)
    })
})

describe('GET /interns/find', () => {
    const mockSupervisor = '67cbe4e6b85278919bc52ebc'
    const mockInterns = [
        {
            firstName: 'foo',
            lastName: 'bar',
            age: 1,
            school: 'fake',
            phone: '09876543921',
            internshipHours: 12,
            email: 'foo@foo.com',
            password: 12345678,
            supervisor: new mongoose.Types.ObjectId(mockSupervisor)
        },
        {
            firstName: 'foo',
            lastName: 'bar',
            age: 1,
            school: 'fake',
            phone: '09876513921',
            internshipHours: 12,
            email: 'foo@foos.com',
            password: 12345678,
            supervisor: new mongoose.Types.ObjectId(mockSupervisor)
        }
    ]

    beforeEach(async () => {
        vi.resetAllMocks()
        await Intern.deleteMany({})
        await Intern.create(mockInterns)
    })

    const url = '/interns/find'

    it('returns 400 if required params was not passed in query', async () => {
        const res = await request(app).get(url)

        expect(res.statusCode).toBe(400)
    })

    it('returns 200 and empty array if no intern was found via supervisor', async () => {
        const params = "supervisor=67cbe7c83b54ee0655d92ca5"

        const res = await request(app).get(`${url}?${params}`)

        // expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ interns: [] })
    })

    it('returns 200 and an array of interns if they are found via supervisor', async () => {
        const params = `supervisor=${mockSupervisor}`

        const res = await request(app).get(`${url}?${params}`)

        expect(res.statusCode).toBe(200)
        expect(res.body.interns).toEqual(expect.arrayContaining([
            expect.any(Object)
        ]))
    })
    it('handle errors', async () => {
        vi.spyOn(Intern, 'find').mockReturnValue({
            select: vi.fn().mockRejectedValue(new Error('Database errorsss'))
        })
        const params = `supervisor=${mockSupervisor}`

        const res = await request(app).get(`${url}?${params}`)

        expect(res.statusCode).toBe(500)
    })
})




describe('POST /interns/password/reset', () => {
    const internFactory = new InternFactory(1)
    const url = '/password/intern/reset'

    beforeEach(async () => {
        vi.resetAllMocks()
        vi.resetModules()
        await Intern.deleteMany()
        await internFactory.create()

    })


    it('returns 200 upon successful sending of email reset link', async () => {
        const email = internFactory.interns[0].email
        const res = await request(app).post(url).send({ email: email })

        expect(sendEmail).toHaveBeenCalledWith(email, expect.any(String), expect.any(String));
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(expect.objectContaining({
            message: expect.any(String)
        }))
    })

    it('returns 200 upon error on sending of email reset link', async () => {
        sendEmail.mockRejectedValue(new Error('Cannot send email'))

        const email = internFactory.interns[0].email
        const res = await request(app).post(url).send({ email: email })


        expect(sendEmail).toHaveBeenCalledWith(email, expect.any(String), expect.any(String));
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(expect.objectContaining({
            message: expect.any(String)
        }))

    })
    it('returns 400 upon error not found email', async () => {
        const email = 'invalid@invalid.com'
        const res = await request(app).post(url).send({ email: email })

        expect(sendEmail).not.toBeCalled()
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual(expect.objectContaining({
            message: expect.any(String)
        }))

    })

    it('returns 400 upon error on not valid email', async () => {
        const email = 'not an email'
        const res = await request(app).post(url).send({ email: email })

        expect(sendEmail).not.toBeCalled()
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual(expect.objectContaining({
            message: expect.any(String)
        }))

    })
})


describe('PUT /password/intern/new', () => {
    const internFactory = new InternFactory(1)
    const url = '/password/intern/new'
    const token = createToken({ email: internFactory.interns[0].email }, RESET_TOKEN)
    const password = faker.internet.password({ pattern: /[A-Z]/, prefix: 'a1' })
    let data
    beforeEach(async () => {
        await Intern.deleteMany({})
        await internFactory.create()

        data = {
            password: password,
            token: token
        }
    })

    it('returns 200 and success message on succesful password change', async () => {
        const res = await request(app).put(url).send(data)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(expect.objectContaining({
            message: expect.any(String)
        }))
    })

    it('invalid token --> 401 and error message', async () => {
        data.token = faker.internet.jwt()
        const res = await request(app).put(url).send(data)

        expect(res.statusCode).toBe(401)
        expect(res.body).toEqual(expect.objectContaining({
            message: expect.any(String)
        }))
    })

    it('invalid password --> 400 and error message', async () => {
        data.password = "invalid"
        const res = await request(app).put(url).send(data)

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual(expect.objectContaining({
            message: expect.any(String)
        }))
    })
})

describe('PUT /interns/logs/:logId', () => {
    const url = '/interns/logs'
    const internFactory = new InternFactory(2)
    const interns = internFactory.interns
    beforeEach(async () => {
        await Intern.deleteMany({})
        await internFactory.create()

    })

    it('updates the specific log by id', async () => {
        const logId = interns[0].logs[0]._id.toString()
        const res = await request(app).put(`${url}/${logId}`).send({ read: 'read' })

        expect(res.statusCode).toBe(200)
        expect(res.body).toStrictEqual(expect.objectContaining({
            _id: expect.any(String),
            taskId: expect.any(String),
            note: expect.any(String),
            date: expect.any(String),
            read: expect.toBeOneOf(['unread', 'read'])
        }))
    })

    it('returns 400 if log id was invalid', async () => {
        const logId = 'invalid'
        const res = await request(app).put(`${url}/${logId}`).send({ read: 'read' })
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual(expect.objectContaining({
            message: expect.any(String)
        }))
    })

    it('returns 400 if log id was not found', async () => {
        const logId = createId()
        const res = await request(app).put(`${url}/${logId}`).send({ read: 'read' })
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual(expect.objectContaining({
            message: expect.any(String)
        }))

    })

})