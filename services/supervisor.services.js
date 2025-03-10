import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Supervisor } from "../models/Supervisor.js";
import { JWT_SECRET } from "../config/index.js";

export const createSupervisor = async (supervisor) => {
  try {
    console.log("Creating Supervisor:", supervisor);

    // Step 1: Hash Password
    console.log("Hashing Password...");
    supervisor.password = await bcrypt.hash(supervisor.password, 10);
    console.log("Password Hashed Successfully!");

    // Step 2: Insert into MongoDB
    const response = await Supervisor.create(supervisor);
    console.log("Supervisor Created Successfully!", response);

    // Step 3: Clean Response
    const data = response.toObject();
    delete data.password;
    delete data.__v;

    console.log("Final Supervisor Data:", data);
    return data;
  } catch (error) {
    console.error("Error Creating Supervisor:", error);
    throw error; // Ensure the controller catches it
  }
};

// export const findSupervisorByEmail = async (email) => {
//   return await Supervisor.findOne({ email: email }).lean();
// };

// export const loginSupervisor = async (password, supervisor) => {
//   const isPasswordCorrect = await bcrypt.compare(password, supervisor.password);
//   if (!isPasswordCorrect) {
//     throw new Error("Invalid credentials");
//   }

//   const token = jwt.sign(
//     {
//       id: supervisor._id,
//       email: supervisor.email,
//       accountType: supervisor.accountType,
//     },
//     JWT_SECRET,
//     { expiresIn: 60 * 60 }
//   );

//   return { message: "Login Successful", token: token };
// };
