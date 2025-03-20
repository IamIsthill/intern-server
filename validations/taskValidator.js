import Joi from "joi"

export const supervisorUpdateTaskValidator = new Joi.object({
    assignedInterns: Joi.array().required(),
    _id: Joi.string().hex().length(24).required(),
    deadline: Joi.string().required(),
    description: Joi.string().required(),
    title: Joi.string().required(),
})

export const internTasksValidator = Joi.object({
    internId: Joi.string().required()
})

export const taskBodyValidator = Joi.object({
    taskId: Joi.string().length(24),
    internId: Joi.string().length(24),
    status: Joi.string()
})

export const supervisorIdValidator = Joi.object({
    id: Joi.string().hex().length(24).required()
})

export const taskIdValidator = Joi.object({
    taskId: Joi.string().hex().required().length(24)
})