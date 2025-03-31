import { Intern } from "../models/interns.js";
import { Supervisor } from "../models/Supervisor.js";
import { Admin } from "../models/Admin.js";
import { createId } from "../utils/createId.js";
import bcrypt from "bcryptjs";

export const findAllAccounts = async (q) => {
  const interns = await Intern.find({
    $or: [
      { firstName: { $regex: q } },
      { lastName: { $regex: q } },
      { email: { $regex: q } },
      { status: { $regex: q } },
      { accountType: { $regex: q } },
    ],
    isApproved: "approved",
  })
    .select(["firstName", "lastName", "email", "accountType", "_id", "status"])
    .lean();
  const supervisors = await Supervisor.find({
    $or: [
      { firstName: { $regex: q } },
      { lastName: { $regex: q } },
      { email: { $regex: q } },
      { status: { $regex: q } },
      { accountType: { $regex: q } },
    ],
  })
    .select(["firstName", "lastName", "email", "accountType", "_id", "status"])
    .lean();
  const accounts = interns.concat(supervisors);
  return accounts;
};

export const findAndUpdateIntern = async (internId, isApproved) => {
  // console.log(internId)
  const intern = await Intern.findOneAndUpdate(
    { _id: createId(internId) },
    { isApproved: isApproved ? "approved" : "rejected", status: isApproved ? "active" : "inactive" },
    { new: true }
  )
    .select(["firstName", "lastName", "email", "accountType", "_id", "status"])
    .lean();
  return intern;
};

export const findPendingInternRequest = async () => {
  return await Intern.find({ isApproved: "pending" }).select([
    "firstName",
    "lastName",
    "email",
    "accountType",
    "_id",
    "status",
  ]);
};

export const registerIntern = async (value) => {
  value.department = createId(value.department);
  value.supervisor = createId(value.supervisor);
  const hashedPassword = await bcrypt.hash(value.password, 10);
  value.password = hashedPassword;
  value.status = 'active'
  value.isApproved = 'approved'
  const user = await Intern.create(value);
  const obj = user.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

export const updateAdmin = async (id, updateData) => {
  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      throw new Error("Admin not found");
    }

    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      updateData.password = hashedPassword;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");
    return updatedAdmin;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAdminById = async (id) => {
  try {
    const admin = await Admin.findById(id).select("-password");
    if (!admin) {
      throw new Error("Admin not found");
    }
    return admin;
  } catch (error) {
    throw new Error(error.message);
  }
};
