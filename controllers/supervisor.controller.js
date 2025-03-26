import { Supervisor } from "../models/Supervisor.js";
import {
  registerSupervisorValidator,
  updateSupervisorValidator,
  updateSupervisorStatusValidator,
  getSupervisorByIdValidator,
  createReportValidator,
} from "../validations/supervisor.validator.js";
import {
  findDepartmentByName,
  createDepartment,
} from "../services/department.services.js";
import {
  createSupervisor,
  updateSupervisor,
  updateSupervisorStatus,
  getSupervisorById,
  findInternByIdAndCreateReport,
} from "../services/supervisor.services.js";
import mongoose from "mongoose";

export const getAllSupervisors = async (req, res, next) => {
  try {
    const supervisors = await Supervisor.find({}).select(["-password", "-__v"]);
    return res.status(200).json({ supervisors: supervisors });
  } catch (err) {
    next(err);
  }
};

export const registerSupervisor = async (req, res, next) => {
  try {
    const { error, value } = registerSupervisorValidator.validate(req.body);
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new Error(errorMessages.join(", "));
    }

    let department = await findDepartmentByName(value.department);
    if (!department) {
      department = await createDepartment(value.department);
    }
    value.department = department._id;

    const supervisor = await createSupervisor(value);

    return res.status(201).json(supervisor);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

export const updateSupervisorController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = updateSupervisorValidator.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((d) => d.message).join(", ") });
    }

    const updatedSupervisor = await updateSupervisor(id, value);

    return res.status(200).json({
      message: "Supervisor updated successfully",
      supervisor: updatedSupervisor,
    });
  } catch (err) {
    next(err);
  }
};

export const updateSupervisorStatusController = async (req, res, next) => {
  try {
    console.log("Received ID:", req.params.id);
    console.log("Received Body:", req.body);

    const { id } = req.params;
    const { status } = req.body;

    const { error } = updateSupervisorStatusValidator.validate({
      id: id,
      status: status,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid ID:", id);
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const result = await updateSupervisorStatus(id);

    console.log("Update Result:", result);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json({
      success: true,
      message: `Supervisor status successfully updated to '${result.supervisor.status}'`,
      supervisor: result.supervisor,
    });
  } catch (err) {
    console.error("Error in updateSupervisorStatusController:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getSupervisorByIdController = async (req, res, next) => {
  try {
    const { error, value } = getSupervisorByIdValidator.validate({
      id: req.params.id,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const supervisor = await getSupervisorById(value.id);

    return res.status(200).json({
      success: true,
      data: supervisor,
    });
  } catch (error) {
    if (error.message === "Supervisor not found") {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }

    next(error);
  }
};

export const createReportController = async (req, res) => {
  try {
    // Validate input
    const { error, value } = createReportValidator.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        details: error.details[0].message,
      });
    }

    // Create the report (with intern check)
    const report = await findInternByIdAndCreateReport(value);

    res.status(201).json({
      message: "Report created successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating report",
      error: error.message,
    });
  }
};

// export const loginSupervisorController = async (req, res, next) => {
//     try {
//         const { error, value } = loginSupervisorValidator.validate(req.body)

//         if (error) {
//             const errorMessages = error.details.map(detail => detail.message)
//             return res.status(400).json({ message: errorMessages.join(", ") })
//         }

//         const supervisor = await findSupervisorByEmail(value.email)

//         if (!supervisor) {
//             return res.status(400).json({ message: "No user found" })
//         }

//         const data = await loginSupervisor(value.password, supervisor)

//         return res.status(200).json(data)
//     } catch (err) {
//         if (err instanceof Error) {
//             return res.status(400).json({ message: err.message })
//         }
//         next(err)
//     }
// }
