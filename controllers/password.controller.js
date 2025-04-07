import { Validation, ValidationError } from "../validations/Validation.js";
import { findInternByEmail, findInternByEmailAndUpdate } from "../services/intern.services.js";
import { sendEmailValidator, resetPasswordValidator } from "../validations/interns-validators.js";
import { sendEmail } from "../services/mail.js";
import { findAdminByEmail, findAdminByEmailAndUpdate } from "../services/admin.services.js";
import { findSupervisorByEmail, findSupervisorByEmailAndUpdate } from "../services/supervisor.services.js";
import { RESET_TOKEN } from "../config/index.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";
import { createToken } from "../utils/token.js";


export const sendPasswordResetEmail = async (req, res, next) => {
  try {
    const value = new Validation(sendEmailValidator, req.body).validate();

    const { email, accountType } = value;

    let user

    switch (accountType) {
      case 'intern':
        user = await findInternByEmail(email);
        break
      case 'admin':
        user = await findAdminByEmail(email)
        break
      case 'supervisor':
        user = await findSupervisorByEmail(email)
        break
      default:
        user = null

    }

    if (!user)
      return res.status(400).json({ message: "No account found" });

    const token = createToken({ email: email, accountType: accountType }, RESET_TOKEN, "2h");

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
    console.log(err)
    if (err instanceof ValidationError) {
      next(err)
      return
    }
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
    let user
    switch (data.accountType) {
      case 'intern':
        user = await findInternByEmailAndUpdate(data.email, {
          password: hashPassword,
        });
        break
      case 'admin':
        user = await findAdminByEmailAndUpdate(data.email, {
          password: hashPassword,
        })
        break
      case 'supervisor':
        user = await findSupervisorByEmailAndUpdate(data.email, {
          password: hashPassword,
        })
        break
      default:
        user = null

    }


    if (!user)
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