<<<<<<< HEAD
import { findInterns } from '../services/intern.services.js'
import { getInternBySupervisorValidator } from '../validations/interns-validators.js'

export const getAllInterns = async (req, res, next) => {
    try {
        const interns = await findInterns({})

        return res.status(200).json({ interns: interns })
    } catch (err) {
        next(err)
    }
}


export const getInternsBySupervisor = async (req, res, next) => {
    try {
        const { error, value } = getInternBySupervisorValidator.validate(req.query)

        if (error) {
            const errorMessages = error.details.map(detail => detail.message)
            return res.status(400).json({ message: errorMessages.join(', ') })
        }

        const interns = await findInterns({ supervisor: value.supervisor })

        return res.status(200).json({ interns: interns })
    } catch (err) {
        next(err)
    }
}
=======
import mongoose from "mongoose";
import {
  findInterns,
  updateInternStatus,
  fetchInactiveInterns,
} from "../services/intern.services.js";
import {
  getInternBySupervisorValidator,
  updateInternStatusValidator,
  getInactiveInternValidator,
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

    const { error } = updateInternStatusValidator.validate({
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

export const getInactiveInterns = async (req, res) => {
  try {
    const { error } = getInactiveInternValidator.validate(req.query);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const result = await fetchInactiveInterns();

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
>>>>>>> staging
