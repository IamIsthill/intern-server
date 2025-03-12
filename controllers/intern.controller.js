import mongoose from "mongoose";
import {
  findInterns,
  updateInternStatus,
} from "../services/intern.services.js";
import {
  getInternBySupervisorValidator,
  updateInternStatusValidator,
} from "../validations/interns-validators.js";

export const getAllInterns = async (req, res, next) => {
  try {
    const interns = await findInterns({});

    return res.status(200).json({ interns: interns });
  } catch (err) {
    next(err);
  }
};

export const getInternsBySupervisor = async (req, res, next) => {
  try {
    const { error, value } = getInternBySupervisorValidator.validate(req.query);

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({ message: errorMessages.join(", ") });
    }

    const interns = await findInterns({ supervisor: value.supervisor });

    return res.status(200).json({ interns: interns });
  } catch (err) {
    next(err);
  }
};

export const updateInternController = async (req, res, next) => {
  try {
    console.log("Received ID:", req.params.id);
    console.log("Received Body:", req.body);

    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid ID:", id);
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const result = await updateInternStatus(id);

    console.log("Update Result:", result);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json({
      success: true,
      message: `Intern status successfully updated to '${result.intern.status}'`,
      intern: result.intern,
    });
  } catch (err) {
    console.error("Error in updateInternController:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
