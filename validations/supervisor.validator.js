import Joi from "joi";

export const registerSupervisorValidator = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  age: Joi.number().integer().min(18).max(150).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  status: Joi.string().valid("active", "inactive").default("active"),
  department: Joi.string(),
  assignedInterns: Joi.array().items(Joi.string().hex().length(24)).default([]),
  accountType: Joi.string().valid("supervisor").required(),
});

export const loginSupervisorValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
});

export const updateSupervisorValidator = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  age: Joi.number().integer().min(18).max(150).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(),
  department: Joi.string().hex().length(24).optional(),
  assignedInterns: Joi.array().items(Joi.string().hex().length(24)).optional(),
  status: Joi.string().valid("active", "inactive").optional(),
  accountType: Joi.string().optional(),
});

export const updateSupervisorStatusValidator = Joi.object({
  id: Joi.string().required(),
  status: Joi.string().valid("active", "inactive"),
});

export const getSupervisorByIdValidator = Joi.object({
  id: Joi.string().required(),
});
