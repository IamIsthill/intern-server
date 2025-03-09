import { connectDb } from '../../database'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import mongoose from 'mongoose'

describe('ConnectDb', () => {
    beforeEach(() => {
        mongoose.connect = vi.fn().mockImplementation(() => Promise.resolve())

    })
    it('connects to database successfully', async () => {
        mongoose.connect.mockResolvedValueOnce(undefined)
        await connectDb()
        expect(mongoose.connect).toHaveBeenCalledWith(expect.any(String))
    })

    it('logs the error if connection fails', async () => {
        const log = vi.spyOn(console, 'log')
        mongoose.connect.mockRejectedValueOnce(new Error('Failed to connect'))

        await connectDb()

        expect(log).toHaveBeenCalledWith('Database error: ', expect.any(String))
    })
})