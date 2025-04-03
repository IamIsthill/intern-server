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

export const createReportValidator = Joi.object({
  supervisor: Joi.string().optional().description("Supervisor ID"),
  intern: Joi.string().optional().description("Intern ID"),
  tasks: Joi.array().items(Joi.string()).optional().description("Task IDs"),
  title: Joi.string().required().min(3).max(100).description("Report Title"),
  description: Joi.string()
    .required()
    .min(10)
    .max(500)
    .description("Report Description"),
  feedback: Joi.string().optional().max(300).description("Supervisor Feedback"),
  suggestions: Joi.string()
    .optional()
    .max(300)
    .description("Supervisor Suggestions"),
  rating: Joi.number()
    .integer()
    .min(0) // Changed from min(1) to min(0)
    .max(10)
    .required()
    .description("Report Rating"),
  assignedInterns: Joi.array()
    .items(Joi.string())
    .optional()
    .description("Assigned Intern IDs"),
  selectedDate: Joi.date()
    .optional() // Changed from required to optional
    .default(() => new Date()), // If not provided, use current date
});

// export const createReportValidator = Joi.object({
//   supervisor: Joi.string().optional(), // Made completely optional
//   intern: Joi.string().optional(), // Made completely optional
//   tasks: Joi.array().items(Joi.string()).optional(),
//   title: Joi.string().optional().min(3).max(100), // Changed from required to optional
//   description: Joi.string()
//     .optional() // Changed from required
//     .min(10)
//     .max(500),
//   feedback: Joi.string().optional().max(300),
//   suggestions: Joi.string().optional().max(300),
//   rating: Joi.number()
//     .integer()
//     .min(0)
//     .max(10)
//     .optional(), // Changed from required
//   assignedInterns: Joi.array()
//     .items(Joi.string())
//     .optional(),
//   selectedDate: Joi.date().optional() // Made optional
// });

export const getReportsbyInternIdValidator = Joi.object({
  id: Joi.string().required(),
});

export const updateReportValidator = Joi.object({
  supervisor: Joi.string().optional().description("Supervisor ID"),
  intern: Joi.string().optional().description("Intern ID"),
  tasks: Joi.array().items(Joi.string()).optional().description("Task IDs"),
  title: Joi.string().optional().min(3).max(100).description("Report Title"),
  description: Joi.string()
    .optional()
    .min(10)
    .max(500)
    .description("Report Description"),
  feedback: Joi.string().optional().max(300).description("Supervisor Feedback"),
  suggestions: Joi.string()
    .optional()
    .max(300)
    .description("Supervisor Suggestions"),
  rating: Joi.number()
    .integer()
    .min(0) // Changed from min(1) to min(0)
    .max(10)
    .optional()
    .description("Report Rating"),
  assignedInterns: Joi.array()
    .items(Joi.string())
    .optional()
    .description("Assigned Intern IDs"),
  selectedDate: Joi.date()
    .optional() // Changed from required to optional
    .default(() => new Date()), // If not provided, use current date
});
