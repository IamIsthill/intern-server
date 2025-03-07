import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import { Intern } from "../../models/interns.js";
import { app } from '../../server.js'

vi.mock("../../models/interns.js")
vi.mock('../../database/index.js', () => ({
    startApp: vi.fn(),
    onDbError: vi.fn(),
    connectDb: vi.fn()
}))

vi.mock('../../middleware/auth.js', () => ({
    authenticateJWT: (req, res, next) => next()
}))

describe('GET /interns/all', () => {
    it('returns 200 and all interns', async () => {
        const mockInterns = [
            { name: 'foo', department: 'bar' },
            { name: 'foo', department: 'bar' }
        ]
        Intern.find.mockReturnValue({
            select: vi.fn().mockResolvedValue(mockInterns)
        })

        const res = await request(app).get('/interns/all')

        expect(res.status).toBe(200)
        expect(res.body.interns).toEqual(mockInterns)
    })
    it('handle errors', async () => {
        Intern.find.mockReturnValue({
            select: vi.fn().mockRejectedValue(new Error('Database error'))
        })


        const res = await request(app).get('/interns/all')

        expect(res.status).toBe(500)
    })
})

describe('GET /interns/find', () => {
    const url = '/interns/find'
    it('returns 400 if required params was not passed in query', async () => {
        const res = await request(app).get(url)

        expect(res.statusCode).toBe(400)

    })
    it('returns 200 and empty array if no intern was found via supervisor', async () => {
        Intern.find.mockReturnValue({
            select: vi.fn().mockResolvedValue([])
        })
        const params = "supervisor=not-supervisor"

        const res = await request(app).get(`${url}?${params}`)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ interns: [] })
    })
    it('returns 200 and an array of interns if they are found via supervisor', async () => {
        const mockedInterns = [{
            firstName: 'foo'
        }]
        Intern.find.mockReturnValue({
            select: vi.fn().mockResolvedValue(mockedInterns)
        })
        const params = "supervisor=existing-supervisor"

        const res = await request(app).get(`${url}?${params}`)

        expect(res.statusCode).toBe(200)
        expect(res.body.interns).toEqual(expect.arrayContaining([
            expect.any(Object)
        ]))
    })
    it('handle errors', async () => {
        Intern.find.mockReturnValue({
            select: vi.fn().mockRejectedValue(new Error('Database error'))
        })
        const params = "supervisor=existing-supervisor"

        const res = await request(app).get(`${url}?${params}`)

        expect(res.statusCode).toBe(500)
    })
})