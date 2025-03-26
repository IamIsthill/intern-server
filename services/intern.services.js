import mongoose from "mongoose";
import { Intern } from "../models/interns.js";

export const findInterns = async (param) => {
  if (param.supervisor) {
    try {
      param.supervisor = new mongoose.Types.ObjectId(param.supervisor);
    } catch (err) {
      return [];
    }
  }

  return await Intern.find(param)
    .populate("department", "name")
    .select([
      "firstName",
      "lastName",
      "age",
      "phone",
      "school",
      "internshipHours",
      "email",
      "department",
      "status",
      "supervisor",
      "totalHours",
      "logs"
    ]);
};

const createId = (id = "") => {
  return mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : null;
};

export const updateInternStatus = async (internId) => {
  try {
    const intern = await Intern.findById(internId);
    if (!intern) {
      return { success: false, message: "Intern not found" };
    }

    console.log("Current Status:", intern.status);

    // Toggle status properly
    const newStatus = intern.status === "active" ? "inactive" : "active";
    console.log("New Status:", newStatus);

    const updatedIntern = await Intern.findByIdAndUpdate(
      internId,
      { $set: { status: newStatus } },
      { new: true, runValidators: true }
    );

    return {
      success: true,
      message: `Intern status updated to ${updatedIntern.status}`,
      intern: updatedIntern,
    };
  } catch (err) {
    console.error("Error updating intern status:", err);
    return {
      success: false,
      message: "An error occurred while updating the status",
    };
  }
};

export const fetchInactiveInterns = async () => {
  try {
    const interns = await Intern.find({ status: "inactive" }).select([
      "firstName",
      "lastName",
      "age",
      "phone",
      "school",
      "email",
      "department",
      "status",
    ]);

    return { success: true, count: interns.length, interns };
  } catch (error) {
    console.error("Error fetching inactive interns:", error);
    throw new Error("Failed to fetch inactive interns.");
  }
};

export const findInternByEmailAndUpdate = async (email, update) => {
  return await Intern.findOneAndUpdate({ email: email }, { ...update });
};

export const updateInternProfile = async (id, updateData) => {
  try {
    const intern = await Intern.findById(id);
    if (!intern) {
      throw new Error("Intern not found");
    }

    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      updateData.password = hashedPassword;
    }

    const updatedIntern = await Intern.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");
    return updatedIntern;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getInternById = async (id) => {
  try {
    const intern = await Intern.findById(id).select("-password").populate({
      path: "supervisor",
      select: "firstName lastName email",
    });

    if (!intern) {
      throw new Error("Intern not found");
    }

    return intern;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const findInternByLogId = async (logId, read) => {
  return Intern.findOneAndUpdate(
    { "logs._id": createId(logId) },
    { "logs.$.read": read },
    { new: true, useFindAndModify: false }
  ).select(["-__v", "-password", "-timeEntries"]);
};
