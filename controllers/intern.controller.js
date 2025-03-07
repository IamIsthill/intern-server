import { Intern } from '../models/interns.js'
import Joi from 'joi'

export const getAllInterns = async (req, res, next) => {
    try {
        const interns = await Intern.find({}).select('-password')

        return res.status(200).json({ interns: interns })
    } catch (err) {
        next(err)
    }
}

const getInternBySupervisorValidator = Joi.object({
    supervisor: Joi.string().required()
})

export const findInterns = async (param) => {
    return await Intern.find(param).select('-password', '-__v',)

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