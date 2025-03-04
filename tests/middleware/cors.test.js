import { describe, it, expect, vi, beforeEach } from "vitest";
import express from 'express'
import cors from 'cors'
import request from 'supertest'


describe('Cors Middleware', () => {
    let app

    beforeEach(() => {
        app = express()
        vi.resetModules()
    })

    it('set the correct CORS headers in DEV true', async () => {
        vi.stubEnv('DEVELOPMENT', 'true')
        const { Cors } = await import('../../middleware/cors.js')

        app.use(Cors())
        app.get('/', (req, res) => {
            res.json({ message: 'Hello' })
        })

        const response = await request(app).get('/')

        expect(response.headers['access-control-allow-origin']).toBe('*')
    })

    it('restrict CORS when DEV is false', async () => {
        vi.stubEnv('DEVELOPMENT', 'false')
        const { Cors } = await import('../../middleware/cors.js')

        app.use(Cors());

        app.get('/', (req, res) => {
            res.json({ message: 'Hello' })
        });

        const response = await request(app).get('/');
        expect(response.headers['access-control-allow-origin']).toBe(undefined);
    })


})