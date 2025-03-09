import mongoose from "mongoose"
import { Tasks } from "../models/Tasks.js"
import Joi from 'joi'

export const findTasksByInternId = async (internId) => {
    internId = mongoose.Types.ObjectId.createFromTime(internId)
    return await Tasks.find({
        assignedInterns: {
            $elemMatch: { internId: internId }
        }
    })
}

export const createTasksValidator = (req) => {
    const validator = Joi.object({
        title: Joi.string(),
        description: Joi.string(),
        deadline: Joi.date(),
        assignedInterns: Joi.alternatives().try(
            Joi.array().items(Joi.string().hex()),
            Joi.string()
        ).optional()
    })

    const { error, value } = validator.validate(req.body)

    if (error) {
        const errorMessages = error.details.map(detail => detail.message)
        throw new Error(errorMessages.join(', '))
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