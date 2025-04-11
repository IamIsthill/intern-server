import { Admin } from "../models/Admin.js";
import {
  findAllAccounts,
  findAndUpdateIntern,
  findPendingInternRequest,
  registerIntern,
  updateAdmin,
  getAdminById,
} from "../services/admin.services.js";
import {
  approveInternRequestValidator,
  adminEditProfileValidator,
  getAdminByIdValidator,
} from "../validations/adminValidator.js";
import { registerInternValidator } from "../validations/interns-validators.js";
import {
  findInternByEmail,
  findInternByPhone,
} from "../services/interns-auth-services.js";
import { validatePassword } from "../utils/validatePassword.js";
import { Validation } from "../validations/Validation.js";
import { logger as log } from "../services/logger.service.js";

const logger = log('admin-controller')

export const adminFindController = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const admin = await Admin.findOne({ email: email })
      .select("-password")
      .lean();

    if (admin === null) {
      return res.status(400).json({ message: "No account found" });
    }

    return res.status(201).json(admin);
  } catch (e) {
    logger.warn(e.message)
    next(e);
  }
};

export const getAllAccounts = async (req, res, next) => {
  try {
    const queryObject = req.query;
    if (Object.keys(queryObject).length > 0 && !("q" in req.query)) {
      return res.status(200).json({ accounts: [] });
    }
    const q = req.query.q ? req.query.q.trim() : "";

    const accounts = await findAllAccounts(q);

    return res.status(200).json({ accounts: accounts });
  } catch (err) {
    next(err);
  }
};

export const getRequestingInterns = async (req, res, next) => {
  try {
    const interns = await findPendingInternRequest();
    return res.status(200).json({ accounts: interns });
  } catch (err) {
    logger.warn(err.message)
    next(err);
  }
};

export const approveInternRequest = async (req, res, next) => {
  try {
    const { error, value } = approveInternRequestValidator.validate(req.body);

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({ message: messages.join("\n") });
    }

    const updatedIntern = await findAndUpdateIntern(
      value.internId,
      value.isApproved
    );

    return res.status(200).json({ account: updatedIntern });
  } catch (e) {
    logger.warn(e.message)
    next(e);
  }
};

export const createIntern = async (req, res, next) => {
  try {
    const value = new Validation(registerInternValidator, req.body).validate()
    validatePassword(value.password);
    const { email, phone } = value;
    const existingUser = await findInternByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingPhone = await findInternByPhone(phone);
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    const user = await registerIntern(value);

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    logger.warn(error.message)
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const updateAdminController = async (req, res, next) => {
  try {
    // Get admin ID from request parameters or body
    const adminId = req.params.id || req.body.id;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin ID is required",
      });
    }

    // Validate request body against Joi schema
    const { error, value } = adminEditProfileValidator.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Remove id from update data if it exists
    const updateData = { ...value };
    delete updateData.id;

    // Check if there's any data to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided",
      });
    }

    // Call the update admin logic
    const updatedAdmin = await updateAdmin(adminId, updateData);

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Admin profile updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    logger.warn(error.message)
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getAdminByIdController = async (req, res, next) => {
  try {
    const { error, value } = getAdminByIdValidator.validate({
      id: req.params.id,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const admin = await getAdminById(value.id);

    return res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    if (error.message === "Admin not found") {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
    logger.warn(error.message)
    next(error);
  }
};
// export const adminLoginController = async (req, res, next) => {
//   try {
//     const { error, value } = loginAdminValidator.validate(req.body);

//     if (error) {
//       const errorMessages = error.details.map((detail) => detail.message);
//       return res.status(400).json({ message: errorMessages.join(", ") });
//     }

//     const { email, password } = value;

//     const admin = await Admin.findOne({ email: email }).lean();

//     if (admin === null) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, admin.password);

//     if (!isPasswordCorrect) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       {
//         id: admin._id,
//         email: admin.email,
//         accountType: admin.accountType,
//       },
//       JWT_SECRET,
//       { expiresIn: 60 * 60 }
//     );

//     return res.status(200).json({ message: "Login Successful", token: token });
//   } catch (e) {
//     next(e);
//   }
// };
