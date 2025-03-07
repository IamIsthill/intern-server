import { findInterns } from '../services/intern.services.js'
import { getInternBySupervisorValidator } from '../validations/interns-validators.js'

export const getAllInterns = async (req, res, next) => {
    try {
        const interns = await findInterns({})

        return res.status(200).json({ interns: interns })
    } catch (err) {
        next(err)
    }
}


export const getInternsBySupervisor = async (req, res, next) => {
    try {
        const { error, value } = getInternBySupervisorValidator.validate(req.query)

        if (error) {
            const errorMessages = error.details.map(detail => detail.message)
            return res.status(400).json({ message: errorMessages.join(', ') })
        }

        const interns = await findInterns(value)

        return res.status(200).json({ interns: interns })
    } catch (err) {
        next(err)
    }
}