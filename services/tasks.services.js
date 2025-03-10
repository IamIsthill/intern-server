import mongoose from "mongoose"
import { Tasks } from "../models/Tasks.js"
import Joi from 'joi'

export const findTasksByInternId = async (internId, user) => {
    internId = new mongoose.Types.ObjectId(internId)

    if (user.accountType === 'intern') {
        const tasks = await Tasks.find({
            assignedInterns: {
                $elemMatch: { internId: internId }
            }
        }).select(['-assignedInterns'])
        return tasks
    }
    else if (user.accountType === 'supervisor') {
        const tasks = await Tasks.find({
            supervisor: new mongoose.Types.ObjectId(user.id),
            assignedInterns: {
                $elemMatch: { internId: internId }
            }
        })
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