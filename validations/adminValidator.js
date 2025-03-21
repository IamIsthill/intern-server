import Joi from "joi";

export const loginAdminValidator = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required().min(8),
});

export const approveInternRequestValidator = Joi.object({
  internId: Joi.string().length(24),
  isApproved: Joi.boolean(),
});

export const adminEditProfileValidator = Joi.object({
  id: Joi.string(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(),
});

export const getAdminByIdValidator = Joi.object({
  id: Joi.string().required(),
});
