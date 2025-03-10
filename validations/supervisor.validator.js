import Joi from "joi";

export const registerSupervisorValidator = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  age: Joi.number().integer().min(18).max(150).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  status: Joi.string().valid("active", "inactive").default("active"),
  department: Joi.string().hex().length(24).required(),
  assignedInterns: Joi.array().items(Joi.string().hex().length(24)).default([]),
  accountType: Joi.string().valid("supervisor").required(),
});

export const loginSupervisorValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
});
