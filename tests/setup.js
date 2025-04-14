import { connectDb, startApp, onDbError } from "../database";
import { vi } from "vitest";
import mongoose from "mongoose";

vi.stubEnv('DATABASE_URI', 'mongodb://localhost:27017/intern-server-test')

export const setup = async () => {
    await mongoose.connect('mongodb://localhost:27017/intern-server-test')
}
