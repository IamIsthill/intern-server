import { Intern } from "../models/interns.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// register interns
export const registerIntern = async ({
  firstName,
  lastName,
  age,
  phone,
  school,
  internshipHours,
  email,
  password,
  timeEntries = null,
  totalHours,
}) => {
  // hashes first the password via bcryptjs in rounds of 10
  const hashedPassword = await bcryptjs.hash(password, 10);

  const intern = await Intern.create({
    firstName,
    lastName,
    age,
    phone,
    school,
    internshipHours,
    email,
    password: hashedPassword,
    timeEntries: timeEntries
      ? timeEntries.map((entry) => ({
          timeIn: entry.timeIn ? new Date(entry.timeIn) : null,
          timeOut: entry.timeOut ? new Date(entry.timeOut) : null,
        }))
      : [],
    totalHours,
  });

  return intern;
};

// Rest of the code remains the same
export const findInternByEmail = async (email) => {
  return await Intern.findOne({ email });
};

export const loginIntern = async ({ email, password }) => {
  const intern = await findInternByEmail(email);
  if (!intern) {
    throw new Error("User not found");
  }

  const isMatch = await bcryptjs.compare(password, intern.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: intern._id, email: intern.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { message: "Login successful", token };
};

export const findInternByPhone = async ({ phone }) => {
  return await Intern.findOne({ phone });
};
