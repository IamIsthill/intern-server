import { Tasks } from "../models/Tasks.js";
import Joi from "joi";
import { findTasksByInternId, createTasksValidator } from "../services/tasks.services.js";
import { createId } from "../utils/createId.js";

const internTasksValidator = Joi.object({
    internId: Joi.string().required()
})


export const getTasksByInternIdController = async (req, res, next) => {
    try {
        const { error, value } = internTasksValidator.validate(req.query)

        if (error) {
            const errorMessages = error.details.map(detail => detail.message)
            throw new Error(errorMessages.join(', '))
        }

        const allInternTasks = await findTasksByInternId(value.internId, req.user)

        return res.status(200).json({ tasks: allInternTasks })
    } catch (err) {
        console.log(err)
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


const taskBodyValidator = Joi.object({
    taskId: Joi.string().length(24),
    internId: Joi.string().length(24),
    status: Joi.string()
})



export const updateTask = async (req, res, next) => {
    try {
        req.body.taskId = req.params.taskId
        const { error, value } = taskBodyValidator.validate(req.body)

        if (error) {
            const messages = error.details.map(detail => detail.message)
            return res.status(400).json({ message: messages.join("\n") })
        }

        const internId = createId(value.internId)
        const taskId = createId(value.taskId)

        const task = await Tasks.findOneAndUpdate({
            _id: taskId, "assignedInterns.internId": internId
        }, {
            $set: {
                "assignedInterns.$.status": value.status,
            }
        }, { new: true }).select(['-assignedInterns', '-supervisor'])

        const taskObject = task.toObject()
        taskObject.status = value.status
        return res.status(200).json({ task: taskObject })
    } catch (err) {
        console.log('Updare', err)
        next(err)
    }
}