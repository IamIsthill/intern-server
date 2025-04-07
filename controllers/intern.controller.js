import mongoose from "mongoose";
import {
  findInterns,
  updateInternStatus,
  fetchInactiveInterns,
  findInternByEmailAndUpdate,
  updateInternProfile,
  getInternById,
  findInternByLogId,
} from "../services/intern.services.js";
import {
  getInternBySupervisorValidator,
  updateInternStatusValidator,
  getInactiveInternValidator,
  sendEmailValidator,
  resetPasswordValidator,
  updateInternProfileValidator,
  logIdValidator,
} from "../validations/interns-validators.js";
import { Intern } from "../models/interns.js";
import { Validation } from "../validations/Validation.js";
import { RESET_TOKEN } from "../config/index.js";
import { sendEmail } from "../services/mail.js";
import { throwError } from "../utils/errors.js";
import { createToken } from "../utils/token.js";

import jwt from "jsonwebtoken";
import { findInternByEmail } from "../services/interns-auth-services.js";
import { validatePassword } from "../utils/validatePassword.js";
import bcrypt from "bcryptjs";
import { createId } from "../utils/createId.js";

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
    const value = new Validation(
      getInternBySupervisorValidator,
      req.query
    ).validate();

    const interns = await findInterns({ supervisor: value.supervisor });

    return res.status(200).json({ interns: interns });
  } catch (err) {
    next(err);
  }
};

export const updateInternController = async (req, res, next) => {
  try {
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

export const sendPasswordResetEmail = async (req, res, next) => {
  try {
    const value = new Validation(sendEmailValidator, req.body).validate();

    const { email } = value;

    const foundIntern = await findInternByEmail(email);

    if (!foundIntern)
      return res.status(400).json({ message: "No account found" });

    const token = createToken({ email: email }, RESET_TOKEN, "2h");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: 'Segoe UI', sans-serif;
              background-color: #f9fafb;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .button {
              display: inline-block;
              background-color: #C9A227;
              color: #ffffff !important;
              padding: 12px 24px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: 600;
              margin-top: 20px;
            }
            .text {
              color: #333333;
              font-size: 16px;
              line-height: 1.6;
            }
            .footer {
              margin-top: 40px;
              font-size: 12px;
              color: #999999;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 style="color:#111827;">Reset Your Password</h2>
            <p class="text">
              Hello,
            </p>
            <p class="text">
              You requested to reset your password. Click the button below to proceed. This link will expire in 2 hours for security reasons.
            </p>
            <a href="http://localhost:5173/intern/reset/${token}" class="button">
              Reset Password
            </a>
            <p class="text">
              If you didn’t request this, you can ignore this email.
            </p>
            <div class="footer">
              &copy; 2025 A2K OJT Management Application. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;

    sendEmail(email, "Reset Password Link", htmlContent);

    return res
      .status(200)
      .json({ message: "Successfully sent password reset email" });
  } catch (err) {
    return res.status(400).json({ message: "Password reset email not sent" });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const value = new Validation(resetPasswordValidator, req.body).validate();

    const { password, token } = value;

    validatePassword(password);

    const data = jwt.verify(token, RESET_TOKEN);

    const hashPassword = await bcrypt.hash(password, 10);

    const foundIntern = await findInternByEmailAndUpdate(data.email, {
      password: hashPassword,
    });

    if (!foundIntern)
      return res.status(400).json({ message: "Account not found" });

    return res.status(200).json({ message: "Successfully updated password" });
  } catch (err) {
    if (
      err instanceof jwt.TokenExpiredError ||
      err instanceof jwt.JsonWebTokenError
    ) {
      return res.status(401).json({ message: err.message });
    }
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

export const updateInternProfileController = async (req, res, next) => {
  try {
    const internId = req.params.id || req.body.id;

    if (!internId) {
      return res.status(400).json({
        success: false,
        message: "Intern ID is required",
      });
    }

    const { error, value } = updateInternProfileValidator.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const updateData = { ...value };
    delete updateData.id;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided",
      });
    }

    const updatedIntern = await updateInternProfile(internId, updateData);

    return res.status(200).json({
      success: true,
      message: "Intern profile updated successfully",
      data: updatedIntern,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getInternIdByController = async (req, res, next) => {
  try {
    const { error, value } = updateInternProfileValidator.validate({
      id: req.params.id,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const intern = await getInternById(value.id);

    return res.status(200).json({
      success: true,
      data: intern,
    });
  } catch (error) {
    if (error.message === "Intern not found") {
      return res.status(404).json({
        success: false,
        message: "Intern not found",
      });
    }

    next(error);
  }
};

export const updateLogStatus = async (req, res, next) => {
  try {
    req.body.logId = req.params.logId;
    const value = new Validation(logIdValidator, req.body).validate();
    const intern = await findInternByLogId(value.logId, value.read);

    if (!intern)
      return res.status(400).json({ message: "Unable to find specific log" });
    const log = intern.logs.find((log) => log._id == value.logId);
    return res.status(200).json(log);
  } catch (err) {
    next(err);
  }
};
