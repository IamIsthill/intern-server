import { loginAdminService } from "../services/staff-auth.services.js";
import { loginSupervisorService } from "../services/staff-auth.services.js";
import { loginSupervisorValidator } from "../validations/supervisor.validator.js";
import { loginAdminValidator } from "../validations/adminValidator.js";
import { BadRequestError } from "../utils/errors.js";
import { logger as log } from "../services/logger.service.js";

const logger = log('staff-auth-controller')

export const loginSupervisorController = async (req, res, next) => {
  try {
    const { error, value } = loginSupervisorValidator.validate(req.body);

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BadRequestError(errorMessages.join(", "));
    }

    const { email, password } = value;
    // Make sure the service function returns something
    const response = await loginSupervisorService({ email, password });

    if (!response) {
      throw new Error("Service function did not return a response");
    }

    res.status(response.status).json(response.data);
  } catch (err) {
    logger.warn(err.message)
    next(err);
  }
};

export const adminLoginController = async (req, res, next) => {
  try {
    const { error, value } = loginAdminValidator.validate(req.body);

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BadRequestError(errorMessages.join(", "));
    }

    const { email, password } = value;

    // Make sure the service function returns something
    const response = await loginAdminService({ email, password });

    if (!response) {
      throw new Error("Service function did not return a response");
    }

    res.status(response.status).json(response.data);
  } catch (err) {
    logger.warn(err.message)
    next(err);
  }
};
