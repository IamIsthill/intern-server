import bcrypt from "bcryptjs";
import { Supervisor } from "../models/Supervisor";

export const createSupervisor = async (supervisor) => {
    supervisor.password = await bcrypt.hash(supervisor.password, 10)
    return await Supervisor.create(supervisor).select('-password, -v')
}