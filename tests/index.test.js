import { describe, it, vi, expect, beforeEach } from "vitest";
import request from 'supertest'


describe('Integration Testing', () => {
    describe('Cors Middleware', () => {
        it('allows all origin in dev mode', async () => {
            vi.resetModules()
            vi.stubEnv('DEVELOPMENT', 'true')
            const { app } = await import('../index')
            const response = await request(app).get('/')
            expect(response.headers['access-control-allow-origin']).toBe('*')
        })
        it('restrict CORS when DEV is false', async () => {
            vi.resetModules()
            vi.stubEnv('DEVELOPMENT', 'false')
            const { app } = await import('../index')
            const response = await request(app).get('/');
            expect(response.headers['access-control-allow-origin']).toBe(undefined);
        })
    })
})