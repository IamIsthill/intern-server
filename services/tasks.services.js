import mongoose from "mongoose"
import { Tasks } from "../models/Tasks.js"
import Joi from 'joi'
import { BadRequestError } from "../utils/errors.js"

const createId = (id = '') => {
    return new mongoose.Types.ObjectId(id)
}

export const findTasksByInternId = async (internId, user) => {
    internId = createId(internId)

    if (user.accountType === 'intern') {
        const tasks = await Tasks.find({
            assignedInterns: {
                $elemMatch: { internId: internId }
            }
        }).select(['-__v'])
        let newTaskArr = tasks
        if (tasks.length > 0) {
            newTaskArr = tasks.map(task => {
                const intern = task.assignedInterns.find(intern => String(intern.internId) == String(internId))

                const taskObject = task.toObject();

                taskObject.status = ''

                if (intern) {
                    taskObject.status = intern.status
                }
                delete taskObject.assignedInterns

                return taskObject
            })
        }

        return newTaskArr
    }
    else if (user.accountType === 'supervisor') {
        const tasks = await Tasks.find({
            supervisor: new mongoose.Types.ObjectId(user.id),
            assignedInterns: {
                $elemMatch: { internId: internId }
            }
        }).select(['-__v'])
        return tasks
    }
    return []

}

export const createTasksValidator = (req) => {
    const validator = Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        deadline: Joi.date().default(null),
        assignedInterns: Joi.alternatives().try(
            Joi.array().items(Joi.string().hex()),
            Joi.string()
        ).optional()
    })

    const { error, value } = validator.validate(req.body)

    if (error) {
        const errorMessages = error.details.map(detail => detail.message)
        throw new Error(errorMessages.join("\n"))
    }

    value.supervisor = new mongoose.Types.ObjectId(req.user.id)

    if (Array.isArray(value.assignedInterns)) {
        value.assignedInterns = value.assignedInterns.map(value => {
            return { internId: new mongoose.Types.ObjectId(value) }
        })
    }
    if (typeof value.assignedInterns == "string") {
        value.assignedInterns = [{
            internId: new mongoose.Types.ObjectId(value.assignedInterns)
        }]
    }
    return value
}

export const findTaskAndUpdate = async (value) => {
    const { assignedInterns } = value

    delete value.assignedInterns

    const task = await Tasks.findOneAndUpdate(createId(value._id), value, { new: true }).select(['-__v']).populate({ path: 'assignedInterns.internId', select: ['firstName', 'lastName', '_id', 'email'] })


    if (!task) {
        throw new BadRequestError('Task not found.')
    }

    if (assignedInterns.length > 0) {
        const existingInterns = task.assignedInterns.map(intern => intern.internId._id.toString())
        if (assignedInterns.length > 0) {
            assignedInterns.forEach(id => {
                if (!existingInterns.find(internId => internId === id)) {
                    task.assignedInterns.push({ internId: createId(id) })
                }
            })
        }

        existingInterns.forEach(intern => {
            if (!assignedInterns.find(internId => internId == intern)) {
                task.assignedInterns = task.assignedInterns.filter(assigned => assigned.internId._id.toString() !== intern)
            }
        })
    } else {
        task.assignedInterns = []
    }

    await task.save()

    return task
}

export const getTasksByInternIdAndSupervisorId = async (supervisorId, internId) => {
    return await Tasks.find({
        supervisor: supervisorId,
        assignedInterns: {
            $elemMatch: { internId: internId }
        }
    }).select(['-__v'])
}