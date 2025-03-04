import mongoose from "mongoose";

const internSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  phone: {
    type: String,
    required: true,
    unique: true,
    minlength: 11,
    maxlength: 11,
  },
  school: { type: String, required: true },
  internshipHours: { type: Number, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
  },
  password: { type: String, required: true, minlength: 8 },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    default: null,
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supervisor",
    default: null,
  },
});

export const Intern = mongoose.model("Intern", internSchema);

