import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { Department } from "../../models/Department.js";
import { setup } from "../setup.js";
vi.mock('../../middleware/auth.js', () => ({
    authenticateJWT: (req, res, next) => {
        req.user = {
            email: 'foo@foo.com',
            accountType: "admin"
        }
        next()
    }
}))
setup()
const { app } = await import('../../app.js')


describe('get all departments controller', () => {

    beforeEach(async () => {
        await Department.deleteMany()
    })
    it('returns 200 if departments is an empty array', async () => {
        await Department.create({ name: "IT" })
        const res = await request(app).get('/departments/all')

        expect(res.statusCode).toBe(200)
        expect(res.body).toStrictEqual(expect.objectContaining({ departments: expect.any(Array) }))

    })
    it('returns 200 if department has content', async () => {
        const res = await request(app).get('/departments/all')

        expect(res.statusCode).toBe(200)
        expect(res.body).toStrictEqual(expect.objectContaining({
            departments: expect.arrayContaining([])
        })
        )
    })
})

