import { Supervisor } from "../models/Supervisor.js";
import {
  registerSupervisorValidator,
  updateSupervisorValidator,
  updateSupervisorStatusValidator,
  getSupervisorByIdValidator,
  getReportsbyInternIdValidator,
  deteleReportValidator,
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
  getReportsByIntern,
  findReportByIdAndUpdate,
  deleteReport,
} from "../services/supervisor.services.js";
import mongoose from "mongoose";
import { logger as log } from "../services/logger.service.js";

const logger = log("supervisor-controller");

export const getAllSupervisors = async (req, res, next) => {
  try {
    const supervisors = await Supervisor.find({})
      .populate("department")
      .select(["-password", "-__v"]);
    return res.status(200).json({ supervisors: supervisors });
  } catch (err) {
    logger.warn(err.message);
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
    logger.warn(err.message);
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

    const result = await updateSupervisor(id, value);

    if (!result.success) {
      return res.status(400).json({
        message: result.message,
        conflictingInterns: result.conflictingInterns,
      });
    }

    return res.status(200).json({
      message: "Supervisor updated successfully",
      supervisor: result.supervisor,
    });
  } catch (err) {
    logger.warn(err.message);
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
    logger.warn(err.message);
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
    logger.warn(err.message);
    if (error.message === "Supervisor not found") {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }

    next(error);
  }
};

// export const createReportController = async (req, res) => {
//   try {
//     console.log("🔹 Received Data:", req.body);
//     console.log("🔹 Params ID (Intern ID):", req.params.id);
//     console.log("🔹 Authenticated Supervisor ID:", req.user?.id);

//     // ✅ Add missing intern & supervisor before validation
//     const requestData = {
//       ...req.body,
//       intern: req.params.id,
//       supervisor: req.user.id,
//     };

//     // Validate the request body
//     const { error, value } = createReportValidator.validate(requestData, {
//       abortEarly: false, // Show all errors
//     });

//     if (error) {
//       return res.status(400).json({
//         message: "Validation failed",
//         errors: error.details.map((err) => err.message),
//       });
//     }

//     const report = await findInternByIdAndCreateReport(value);

//     res.status(201).json({
//       message: "Report created successfully",
//       report,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error creating report",
//       error: error.message,
//     });
//   }
// };

export const createReportController = async (req, res) => {
  try {
    console.log("🔹 Received Data:", req.body);
    console.log("🔹 Params ID (Intern ID):", req.params.id);
    console.log("🔹 Authenticated Supervisor ID:", req.user?.id);

    // Directly use the request data without Joi validation
    const reportData = {
      ...req.body,
      intern: req.params.id,
      supervisor: req.user.id,
    };

    const report = await findInternByIdAndCreateReport(reportData);

    res.status(201).json({
      message: "Report created successfully",
      report,
    });
  } catch (error) {
    logger.warn(error.message);
    console.error("Full error details:", error);
    res.status(500).json({
      message: "Error creating report",
      error: error.message,
    });
  }
};

export const getReportsbyInternIdController = async (req, res) => {
  try {
    console.log("Received internId from request:", req.params.id); // Debugging

    const { error, value } = getReportsbyInternIdValidator.validate({
      id: req.params.id,
    });

    if (error) {
      console.log("Validation failed:", error.details);
      return res
        .status(400)
        .json({ message: "Invalid Intern ID", error: error.details });
    }

    const reports = await getReportsByIntern(value.id);

    console.log("Final response:", reports); // Debugging

    return res.status(200).json({
      message: "Reports fetched successfully",
      reports,
    });
  } catch (error) {
    logger.warn(error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateReportController = async (req, res) => {
  try {
    console.log("🔹 Received Data:", req.body);
    console.log("🔹 Params ID (Report ID):", req.params.id); // FIX: Use req.params.id
    console.log("🔹 Authenticated Supervisor ID:", req.user?.id);

    const reportId = req.params.id; // FIX: Get report ID from params

    const {
      internId,
      supervisorId,
      title,
      description,
      feedback,
      suggestions,
      rating,
      selectedDate,
    } = req.body;

    if (!reportId) {
      return res.status(400).json({ message: "Report ID is required" });
    }

    const reportData = {
      reportId,
      internId,
      supervisorId: supervisorId || req.user.id,
      title,
      description,
      feedback,
      suggestions,
      rating,
      selectedDate,
    };

    const updatedReport = await findReportByIdAndUpdate(reportData);

    return res.status(200).json({
      message: "Report updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    logger.warn(error.message);
    console.error("Full error details:", error);
    return res.status(500).json({
      message: "Error updating report",
      error: error.message,
    });
  }
};
export const deleteReportController = async (req, res) => {
  try {
    const { error, value } = deteleReportValidator.validate({
      id: req.params.id,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result = await deleteReport(value.id);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    logger.warn(error.message);
    console.error("Error in deleteReportController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
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
