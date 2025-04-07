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
  department: joi.string().hex().length(24),
  supervisor: joi.string().hex().length(24),
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

export const getInternBySupervisorValidator = joi.object({
  supervisor: joi.string().required(),
});

export const updateInternStatusValidator = joi.object({
  id: joi.string().required(),
  status: joi.string().valid("active", "inactive"),
});

export const getInactiveInternValidator = joi.object({
  status: joi.string().valid("inactive").optional(),
});

export const sendEmailValidator = joi.object({
  email: joi.string().email().required(),
});

export const resetPasswordValidator = joi.object({
  token: joi.string().required(),
  password: joi.string().required(),
});

export const updateInternProfileValidator = joi.object({
  id: joi.string(),
  firstName: joi.string().optional(),
  lastName: joi.string().optional(),
  phone: joi.string().optional(),
  email: joi.string().email().optional(),
  password: joi.string().min(8).optional(),
  school: joi.string().optional(),
  internshipHours: joi.string().optional()
});


export const logIdValidator = joi.object({
  logId: joi.string().hex().length(24).required(),
  read: joi.string().valid('read', 'unread').required()

})