import { describe, it, expect, vi, beforeEach } from "vitest";
const express = require('express')
const cors = require('cors')
const request = require('supertest');
const { Cors } = require('../../middleware');


describe('Cors Middleware Integration', () => {
    let app

    beforeEach(() => {
        app = express()
    })

    it('set the correct CORS headers in DEV true', async () => {
        // Cors config when true is true
        const corsOptions = {
            origin: '*',
            optionsSuccessfulStatus: 200
        }

        app.use(Cors(corsOptions))
        app.get('/', (req, res) => {
            res.json({ message: 'Hello' })
        })

        const response = await request(app).get('/')

        expect(response.headers['access-control-allow-origin']).toBe('*')
    })

    it('restrict CORS when DEV is false', async () => {
        // cors should use the default config
        const corsOptions = {
            origin: [],
            optionsSuccessfulStatus: 200
        }

        app.use(Cors(corsOptions));
        app.get('/', (req, res) => {
            res.json({ message: 'Hello' })
        });

        const response = await request(app).get('/');


        expect(response.headers['access-control-allow-origin']).toBe(undefined);
    })


})