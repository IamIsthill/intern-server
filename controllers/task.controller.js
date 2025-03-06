import { Tasks } from "../models/Tasks.js";
import Joi from "joi";
import { findTasksByInternId } from "../services/tasks.services.js";

const internTasksValidator = Joi.object({
    internId: Joi.string().required()
})


export const getTasksByInternIdController = async (req, res, next) => {
    try {
        const { error, value } = internTasksValidator.validate(req.body)

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