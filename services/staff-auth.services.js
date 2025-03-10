import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
import { Supervisor } from "../models/Supervisor.js";
import { JWT_SECRET } from "../config/index.js";

export const findAdminByEmail = async (email) => {
  return await Admin.findOne({ email }).lean();
};
export const loginAdminService = async ({ email, password }) => {
  const admin = await findAdminByEmail(email);

  if (!admin) {
    return { status: 400, data: { message: "User not found" } };
  }

  const isPasswordCorrect = await bcrypt.compare(password, admin.password);

  if (!isPasswordCorrect) {
    return { status: 400, data: { message: "Invalid credentials" } };
  }

  const token = jwt.sign(
    { id: admin._id, email: admin.email, accountType: admin.accountType },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { status: 200, data: { message: "Login Successful", token } };
};

export const findSupervisorByEmail = async (email) => {
  return await Supervisor.findOne({ email: email }).lean();
};

export const loginSupervisorService = async ({ email, password }) => {
  const supervisor = await findSupervisorByEmail(email);

  if (!supervisor) {
    return { status: 400, data: { message: "No user found" } };
  }

  const isPasswordCorrect = await bcrypt.compare(password, supervisor.password);

  if (!isPasswordCorrect) {
    return { status: 400, data: { message: "Invalid credentials" } };
  }

  const token = jwt.sign(
    { id: supervisor._id, email: supervisor.email, role: supervisor.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { status: 200, data: { message: "Login Successful", token } };
};
