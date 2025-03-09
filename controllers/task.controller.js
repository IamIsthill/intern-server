import { Tasks } from "../models/Tasks.js";
import Joi from "joi";
import { findTasksByInternId, createTasksValidator } from "../services/tasks.services.js";

const internTasksValidator = Joi.object({
    internId: Joi.string().required()
})


export const getTasksByInternIdController = async (req, res, next) => {
    try {
        console.log(req.query)
        const { error, value } = internTasksValidator.validate(req.query)

        if (error) {
            const errorMessages = error.details.map(detail => detail.message)
            throw new Error(errorMessages.join(', '))
        }

        const allInternTasks = await findTasksByInternId(value.internId)

        return res.status(200).json({ tasks: allInternTasks })
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message })
        }
        next(err)
    }
}


export const createTask = async (req, res, next) => {
    try {
        const value = createTasksValidator(req)

        const task = await Tasks.create(value)

        return res.status(200).json(task)
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message })
        }
        next(err)
    }
}