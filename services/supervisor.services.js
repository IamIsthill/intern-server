import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Supervisor } from "../models/Supervisor.js";
import { JWT_SECRET } from "../config/index.js";
import { Intern } from "../models/interns.js";
import { Reports } from "../models/Reports.js";
export const createSupervisor = async (supervisor) => {
  supervisor.password = await bcrypt.hash(supervisor.password, 10);
  const response = await Supervisor.create(supervisor);
  const data = response.toObject();
  delete data.password;
  delete data.__v;

  if (supervisor.assignedInterns.length > 0) {
    await Intern.updateMany(
      { _id: { $in: supervisor.assignedInterns } }, // Find all interns assigned
      { $set: { supervisor: response._id } } // Set supervisor field
    );
  }

  return data;
};
export const updateSupervisor = async (id, supervisorData) => {
  // Prevent email & accountType modifications
  delete supervisorData.email;
  delete supervisorData.accountType;

  if (supervisorData.password) {
    supervisorData.password = await bcrypt.hash(supervisorData.password, 10);
  }

  const currentSupervisor = await Supervisor.findById(id);
  if (!currentSupervisor) {
    throw new Error("Supervisor not found");
  }

  const oldAssignedInterns = [...currentSupervisor.assignedInterns];

  if (supervisorData.assignedInterns) {
    // Prevent assigning interns already supervised by someone else
    const assignedInterns = await Intern.find({
      _id: { $in: supervisorData.assignedInterns },
    })
      .select("supervisor department")
      .lean();

    const conflictingInterns = assignedInterns.filter(
      (intern) => intern.supervisor && intern.supervisor.toString() !== id
    );

    if (conflictingInterns.length > 0) {
      return {
        success: false,
        message: "Some interns are already assigned to another supervisor.",
        conflictingInterns: conflictingInterns.map((intern) => intern._id),
      };
    }

    // Ensure department consistency
    const firstInternDepartment =
      assignedInterns.length > 0 ? assignedInterns[0].department : null;
    if (firstInternDepartment) {
      supervisorData.department = firstInternDepartment;
    }
  }

  // Proceed with update
  const updatedSupervisor = await Supervisor.findByIdAndUpdate(
    id,
    { $set: supervisorData },
    { new: true, runValidators: true }
  )
    .populate({
      path: "assignedInterns",
      model: "Intern",
      select: "firstName lastName email department",
    })
    .populate("department");

  if (supervisorData.assignedInterns) {
    const newlyAssignedInterns = supervisorData.assignedInterns.filter(
      (internId) =>
        !oldAssignedInterns.some(
          (oldId) => oldId.toString() === internId.toString()
        )
    );

    const removedInterns = oldAssignedInterns.filter(
      (oldId) =>
        !supervisorData.assignedInterns.some(
          (internId) => internId.toString() === oldId.toString()
        )
    );

    if (newlyAssignedInterns.length > 0) {
      await Intern.updateMany(
        { _id: { $in: newlyAssignedInterns } },
        {
          $set: {
            supervisor: id,
            department: updatedSupervisor.department,
          },
        }
      );
    }

    if (removedInterns.length > 0) {
      await Intern.updateMany(
        { _id: { $in: removedInterns } },
        {
          $set: {
            supervisor: null,
            department: null,
          },
        }
      );
    }
  }

  const data = updatedSupervisor.toObject();
  delete data.password;
  delete data.__v;

  return { success: true, supervisor: data };
};

export const updateSupervisorStatus = async (supervisorId) => {
  try {
    const supervisor = await Supervisor.findById(supervisorId);
    if (!supervisor) {
      return { success: false, message: "Supervisor not found" };
    }

    console.log("Current Status:", supervisor.status);

    const newStatus = supervisor.status === "active" ? "inactive" : "active";
    console.log("New Status:", newStatus);

    const updatedSupervisor = await Supervisor.findByIdAndUpdate(
      supervisorId,
      { $set: { status: newStatus } },
      { new: true, runValidators: true }
    );

    return {
      success: true,
      message: `Intern status updated to ${updatedSupervisor.status}`,
      supervisor: updatedSupervisor,
    };
  } catch (err) {
    console.error("Error updating intern status:", err);
    return {
      success: false,
      message: "An error occurred while updating the status",
    };
  }
};

export const getSupervisorById = async (id) => {
  try {
    const supervisor = await Supervisor.findById(id)
      .populate({
        path: "department",
        select: "name _id",
      })
      .populate({
        path: "assignedInterns",
        select: "firstName lastName _id",
      });

    if (!supervisor) {
      throw new Error("Supervisor not found");
    }

    const result = supervisor.toObject();

    if (result.age === undefined || result.age === null) {
      result.age = 0;
    }

    if (result.department) {
      result.departmentName = result.department.name;
    } else {
      result.departmentName = "";
    }

    if (Array.isArray(result.assignedInterns)) {
      result.assignedInternsFullNames = result.assignedInterns.map(
        (intern) => ({
          _id: intern._id,
          fullName: `${intern.firstName} ${intern.lastName}`,
        })
      );
    } else {
      result.assignedInternsFullNames = [];
    }

    return result;
  } catch (error) {
    throw new Error(`Error fetching supervisor: ${error.message}`);
  }
};

export const findInternByIdAndCreateReport = async (reportData) => {
  try {
    if (!reportData.intern) {
      throw new Error("Intern ID is required");
    }
    if (!reportData.supervisor) {
      throw new Error("Supervisor ID is required");
    }

    const intern = await Intern.findById(reportData.intern);
    if (!intern) {
      throw new Error("Intern not found");
    }

    const report = new Reports(reportData);
    await report.save();

    await Intern.findByIdAndUpdate(reportData.intern, {
      $push: {
        reportLogs: {
          reportId: report._id,
          title: report.title,
          description: report.description,
          feedback: report.feedback || "",
          suggestions: report.suggestions || "",
          rating: report.rating,
          date: new Date(),
          supervisor: reportData.supervisor,
        },
      },
    });

    return report;
  } catch (error) {
    console.error("Report creation error:", error);
    throw error;
  }
};
