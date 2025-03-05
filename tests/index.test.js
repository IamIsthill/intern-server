import { describe, it, vi, expect, beforeEach } from "vitest";
import request from 'supertest'
import mongoose from "mongoose";
import { authenticateJWT } from "../middleware/auth.js";


describe('Integration Testing', () => {
    describe('Cors Middleware', () => {
        it('allows all origin in dev mode', async () => {
            vi.resetModules()
            vi.stubEnv('DEVELOPMENT', 'true')
            const { app } = await import('../server.js')
            app.get('/', (req, res) => {
                res.json({ message: 'foo' })
            })
            const response = await request(app).get('/')
            expect(response.headers['access-control-allow-origin']).toBe('*')
        })
        it('restrict CORS when DEV is false', async () => {
            vi.resetModules()
            vi.stubEnv('DEVELOPMENT', 'false')
            const { app } = await import('../server.js')
            app.get('/', (req, res) => {
                res.json({ message: 'foo' })
            })
            const response = await request(app).get('/');
            expect(response.headers['access-control-allow-origin']).toBe(undefined);
        })
    })

    describe('Admin endpoints', () => {
        describe('Admin Find controller', async () => {
            it('return 401 if jwt not in the request headers', async () => {
                vi.resetAllMocks()
                vi.resetModules()
                vi.stubEnv('DEVELOPMENT', 'true')
                const { app } = await import('../server.js')
                const response = await request(app).get('/admin/find')
                expect(response.headers['access-control-allow-origin']).toBe('*');
                expect(response.statusCode).toBe(401)
            })

            it('return 403 if jwt was incorrect', async () => {
                vi.resetAllMocks()
                vi.resetModules()
                vi.stubEnv('DEVELOPMENT', 'true')
                const wrongToken = 'wrong'
                const { app } = await import('../server.js')

                const agent = request.agent(app)

                const response = await agent.set('Authorization', `Bearer ${wrongToken}`).get('/admin/find')

                expect(response.statusCode).toBe(403)
            })

            it('return 400 error when required params was passed', async () => {
                vi.resetModules()
                vi.resetAllMocks()
                vi.stubEnv('DEVELOPMENT', 'true')
                vi.doMock('../middleware/auth.js', () => ({
                    authenticateJWT: vi.fn((req, res, next) => {
                        next()
                    })
                }))
                const { app } = await import('../server.js')

                const response = await request(app).get('/admin/find')

                expect(response.statusCode).toBe(400)
                expect(response.body).toEqual(expect.objectContaining({
                    message: expect.any(String)
                }))
            })

            it('returns')
        })
    })
})