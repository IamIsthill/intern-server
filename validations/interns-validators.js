import joi from "joi";

export const registerInternValidator = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  age: joi.number().required(),
  phone: joi.string().required().min(11).max(11),
  school: joi.string().required(),
  internshipHours: joi.number().required(),
  email: joi.string().required(),
  password: joi.string().required(),
  department: joi.string(),
  supervisor: joi.string(),
  department: joi.string(),
  supervisor: joi.string(),
  status: joi.string().valid("active", "inactive"),
  timeEntries: joi
    .array()
    .items(
      joi.object({
        timeIn: joi.date().iso().allow(null).optional(),
        timeOut: joi.date().iso().allow(null).optional(),
      })
    )
    .optional(),
  totalHours: joi.number().optional(),
});

export const loginInternValidator = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});
