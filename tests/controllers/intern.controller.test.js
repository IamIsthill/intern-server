import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import request from 'supertest'
import { Intern } from "../../models/interns.js";
import mongoose from 'mongoose';

vi.stubEnv('DATABASE_URI', 'mongodb://localhost:27017/intern-server-test')
vi.mock('../../middleware/auth.js', () => ({
    authenticateJWT: (req, res, next) => next()
}))
const { app } = await import('../../server.js')


describe('GET /interns/all', () => {
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
        await Intern.deleteMany({})
        await Intern.create(mockInterns)
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