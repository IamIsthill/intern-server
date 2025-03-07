import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { Supervisor } from "../models/Supervisor.js";
import { JWT_SECRET } from '../config/index.js'

export const createSupervisor = async (supervisor) => {
    supervisor.password = await bcrypt.hash(supervisor.password, 10)
    const response = await Supervisor.create(supervisor)
    const data = response.toObject()
    delete data.password
    delete data.__v

    return data
}

export const findSupervisorByEmail = async (email) => {
    return await Supervisor.findOne({ email: email }).lean()
}

export const loginSupervisor = async (password, supervisor) => {
    const isPasswordCorrect = await bcrypt.compare(password, supervisor.password)
    if (!isPasswordCorrect) {
        throw new Error('Invalid credentials')
    }

    const token = jwt.sign({
        id: supervisor._id,
        email: supervisor.email,
        accountType: supervisor.accountType
    }, JWT_SECRET, { expiresIn: 60 * 60 })

    return { message: "Login Successful", token: token }
}