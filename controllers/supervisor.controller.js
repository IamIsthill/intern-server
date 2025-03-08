import { Supervisor } from '../models/Supervisor.js'
import { registerSupervisorValidator, loginSupervisorValidator } from '../validations/supervisor.validator.js'
import { findDepartmentByName, createDepartment } from '../services/department.services.js'
import { createSupervisor, loginSupervisor, findSupervisorByEmail } from '../services/supervisor.services.js'

export const getAllSupervisors = async (req, res, next) => {
    try {
        const supervisors = await Supervisor.find({}).select(['-password', '-__v'])
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



export const loginSupervisorController = async (req, res, next) => {
    try {
        const { error, value } = loginSupervisorValidator.validate(req.body)

        if (error) {
            const errorMessages = error.details.map(detail => detail.message)
            return res.status(400).json({ message: errorMessages.join(", ") })
        }

        const supervisor = await findSupervisorByEmail(value.email)

        if (!supervisor) {
            return res.status(400).json({ message: "No user found" })
        }

        const data = await loginSupervisor(value.password, supervisor)

        return res.status(200).json(data)
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message })
        }
        next(err)
    }
}