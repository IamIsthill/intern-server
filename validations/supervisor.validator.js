import Joi from "joi"

export const registerSupervisorValidator = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    age: Joi.number().required().integer().max(150),
    password: Joi.string().required().min(8),
    department: Joi.string().required(),
    email: Joi.string().email()
})