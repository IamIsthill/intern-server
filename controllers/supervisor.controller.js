import { Supervisor } from '../models/Supervisor.js'

export const getAllSupervisors = async (req, res, next) => {
    try {
        const supervisors = await Supervisor.find({})
        return res.status(200).json({ supervisors: supervisors })
    } catch (err) {
        next(err)
    }
}