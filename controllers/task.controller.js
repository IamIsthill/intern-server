import { Tasks } from "../models/Tasks.js";
import { findTasksByInternId, createTasksValidator, findTaskAndUpdate } from "../services/tasks.services.js";
import { createId } from "../utils/createId.js";
import { throwError } from "../utils/errors.js";
import { BadRequestError } from "../utils/errors.js";
import { internTasksValidator, supervisorUpdateTaskValidator, taskBodyValidator, supervisorIdValidator, taskIdValidator } from "../validations/taskValidator.js";




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

        return res.status(201).json(task)
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message })
        }
        next(err)
    }
}


export const updateTask = async (req, res, next) => {
    try {
        req.body.taskId = req.params.taskId
        const { error, value } = taskBodyValidator.validate(req.body)

        if (error) {
            const messages = error.details.map(detail => detail.message)
            throw new BadRequestError(messages.join("\n"))
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
        next(err)
    }
}


export const getTasksBySupervisorId = async (req, res, next) => {
    try {
        const { error, value } = supervisorIdValidator.validate(req.params)

        if (error) {
            const messages = error.details.map(detail => detail.message)
            throw new BadRequestError(messages.join(''))
        }

        const tasks = await Tasks.find({ supervisor: createId(value.id) }).populate({ path: 'assignedInterns.internId', select: ['firstName', 'lastName', '_id', 'email'] })

        return res.status(200).json({ tasks: tasks })

    } catch (err) {
        next(err)
    }
}


export const supervisorUpdateTask = async (req, res, next) => {
    try {
        const { error, value } = supervisorUpdateTaskValidator.validate(req.body)

        if (error) {
            const messages = error.details.map(detail => detail.message)
            throw new BadRequestError(messages.join('\n'))
        }

        const task = await findTaskAndUpdate(value)
        return res.status(200).json({ task: task })
    } catch (err) {
        next(err)

    }
}


export const deleteTask = async (req, res, next) => {
    try {
        const { error, value } = taskIdValidator.validate(req.params)

        if (error) {
            throwError(error)
        }

        const task = await Tasks.findOneAndDelete({ _id: createId(value.taskId) })

        if (!task) {
            return res.status(400).json({ message: "No task found. Unable to delete." })
        }
        return res.sendStatus(204)
    } catch (err) {
        next(err)
    }
}