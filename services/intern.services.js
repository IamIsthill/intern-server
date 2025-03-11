import mongoose from "mongoose";
import { Intern } from "../models/interns.js";

export const findInterns = async (param) => {
  if (param.supervisor) {
    try {
      param.supervisor = new mongoose.Types.ObjectId(param.supervisor);
    } catch (err) {
      return [];
    }
    return await Intern.find(param).select(['firstName', 'lastName', 'age', 'phone', 'school', 'internshipHours', 'email', 'department', 'status', 'supervisor', 'totalHours'])
  }