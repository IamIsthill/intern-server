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
  });
  return intern;
};

// find internby email to be used by checking email availability
export const findInternByEmail = async (email) => {
  return await Intern.findOne({ email });
};

//intern login throws the jwt token after logging in in backend, storing happens in our frontend
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

// to be used by checking phone availability
export const findInternByPhone = async ({ phone }) => {
  return await Intern.findOne({ phone });
};
