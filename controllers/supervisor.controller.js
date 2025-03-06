import { Supervisor } from '../models/Supervisor.js'
import { registerSupervisorValidator } from '../validations/supervisor.validator.js'
import { findDepartmentByName, createDepartment } from '../services/department.services.js'
import { createSupervisor } from '../services/supervisor.services.js'

export const getAllSupervisors = async (req, res, next) => {
    try {
        const supervisors = await Supervisor.find({})
        return res.status(200).json({ supervisors: supervisors })
    } catch (err) {
        next(err)
    }
}


export const registerSupervisor = async (req, res, next) => {
    try {
        const { error, value } = registerSupervisorValidator.validate(req.body)

        if (error) {
            const errorMessages = error.details.map(detail => detail.message)
            throw new Error(errorMessages.join(", "))
        }

        let department = await findDepartmentByName(value.department)

        if (!department) {
            department = await createDepartment(value.department)
        }

        value.department = department._id

        const supervisor = await createSupervisor(value)

        return res.status(201).json(supervisor)
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message })
        }
        next(err)
    }
}