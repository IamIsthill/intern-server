import mongoose from "mongoose";

const supervisorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
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
  assignedInterns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "intern",
    },
  ],
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  accountType: {
    type: String,
    required: true,
    default: 'supervisor'
  }
});

export let Supervisor

if (mongoose.models.Supervisor) {
  Supervisor = mongoose.model('Supervisor')
} else {
  Supervisor = mongoose.model("Supervisor", supervisorSchema);
}
