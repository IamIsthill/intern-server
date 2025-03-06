import bcrypt from "bcryptjs";
import { Supervisor } from "../models/Supervisor.js";

export const createSupervisor = async (supervisor) => {
    supervisor.password = await bcrypt.hash(supervisor.password, 10)
    const response = await Supervisor.create(supervisor)
    const data = response.toObject()
    delete data.password
    delete data.__v

    return data
}