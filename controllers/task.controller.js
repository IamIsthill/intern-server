import { Tasks } from "../models/Tasks.js";
import { Intern } from "../models/interns.js";
import { findTasksByInternId, createTasksValidator, findTaskAndUpdate } from "../services/tasks.services.js";
import { createId } from "../utils/createId.js";
import { internTasksValidator, supervisorUpdateTaskValidator, taskBodyValidator, supervisorIdValidator, taskIdValidator } from "../validations/taskValidator.js";
import { Validation } from "../validations/Validation.js";
import { logger as log } from "../services/logger.service.js";


const logger = log('task-controller')

export const getTasksByInternIdController = async (req, res, next) => {
    try {
        const value = new Validation(internTasksValidator, req.query).validate()

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
        logger.warn(err.message)
        next(err)
    }
}


export const updateTask = async (req, res, next) => {
    try {
        req.body.taskId = req.params.taskId
        const value = new Validation(taskBodyValidator, req.body).validate()

        const internId = createId(value.internId)
        const taskId = createId(value.taskId)

        const task = await Tasks.findOneAndUpdate({
            _id: taskId, "assignedInterns.internId": internId
        }, {
            $set: {
                "assignedInterns.$.status": value.status,
            }
        }, { new: true }).select(['-assignedInterns', '-supervisor'])

        const logEntry = {
            taskId: taskId.toString(),
            note: `Status of '${task.title}' has been changed to '${value.status}'`
        }

        await Intern.findByIdAndUpdate(internId,
            { $push: { logs: logEntry } }
        )

        const taskObject = task.toObject()
        taskObject.status = value.status
        return res.status(200).json({ task: taskObject })
    } catch (err) {
        logger.warn(err.message)
        next(err)
    }
}


export const getTasksBySupervisorId = async (req, res, next) => {
    try {
        const value = new Validation(supervisorIdValidator, req.params).validate()

        const tasks = await Tasks.find({ supervisor: createId(value.id) }).populate({ path: 'assignedInterns.internId', select: ['firstName', 'lastName', '_id', 'email'] })

        return res.status(200).json({ tasks: tasks })

    } catch (err) {
        next(err)
    }
}


export const supervisorUpdateTask = async (req, res, next) => {
    try {
        const value = new Validation(supervisorUpdateTaskValidator, req.body).validate()

        const task = await findTaskAndUpdate(value)
        return res.status(200).json({ task: task })
    } catch (err) {
        logger.warn(err.message)
        next(err)

    }
}


export const deleteTask = async (req, res, next) => {
    try {
        const value = new Validation(taskIdValidator, req.params).validate()

        const task = await Tasks.findOneAndDelete({ _id: createId(value.taskId) })

        if (!task) {
            return res.status(400).json({ message: "No task found. Unable to delete." })
        }
        return res.sendStatus(204)
    } catch (err) {
        logger.warn(err.message)
        next(err)
    }
}