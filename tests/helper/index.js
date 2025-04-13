import mongoose from 'mongoose'

export const testDb = () => {
    return vi.mock(import('../../database/index.js'), async (importOriginal) => {
        const actual = await importOriginal()
        return {
            ...actual,
            connectDb: async () => {
                try {
                    await mongoose.connect('mongodb://localhost:27017/intern-server-test');
                } catch (e) {
                    console.log("Database error: ", e.message);
                }
            }

        }
    })
}