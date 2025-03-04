import { Intern } from "../models/interns";
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerIntern = async ({
  firstName,
  lastName,
  age,
  phone,
  school,
  internshipHours,
  email,
  password,
}) => {
  const existingUser = await Intern.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    throw new Error("Email or phone already in use");
  }
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

const findInternByEmail = async (email) => {
  return await Intern.findOne({ email });
};

const loginIntern = async ({ email, password }) => {
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

const findInternByPhone = async (phone) => {
  return await Intern.findOne({ phone });
};

module.exports = {
  registerIntern,
  findInternByEmail,
  loginIntern,
  findInternByPhone,
};
