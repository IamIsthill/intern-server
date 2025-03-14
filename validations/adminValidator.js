import Joi from "joi";

export const loginAdminValidator = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required().min(8)
})

export const approveInternRequestValidator = Joi.object({
    internId: Joi.string().length(24),
    isApproved: Joi.boolean()
})

