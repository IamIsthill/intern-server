import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import { Supervisor } from '../../models/Supervisor.js'
import { app } from '../../server.js'

vi.mock('../../models/Supervisor.js')
vi.mock('../../database/index.js', () => ({
    startApp: vi.fn(),
    onDbError: vi.fn(),
    connectDb: vi.fn()
}))
vi.mock('../../middleware/auth.js', () => ({
    authenticateJWT: (req, res, next) => next()
}))

describe('GET /supervisors', () => {
    it('should return all supervisors', async () => {
        const mockSupervisors = [
            { name: 'John Doe', department: 'HR' },
            { name: 'Jane Smith', department: 'IT' }
        ]
        Supervisor.find.mockResolvedValue(mockSupervisors)

        const response = await request(app).get('/supervisors/all')
        console.log(response.body)

        expect(response.status).toBe(200)
        expect(response.body.supervisors).toEqual(mockSupervisors)
    })

    it('should handle errors', async () => {
        Supervisor.find.mockRejectedValue(new Error('Database error'))

        const response = await request(app).get('/supervisors/all')

        expect(response.status).toBe(500)
    })
})