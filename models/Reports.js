import mongoose from "mongoose";

const reportsSchema = new mongoose.Schema({
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supervisor",
    required: true,
  },
  intern: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Intern",
    required: true,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tasks",
    },
  ],
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
  },
  suggestions: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  assignedInterns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Intern",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export let Reports;
if (mongoose.models.Reports) {
  Reports = mongoose.model("Reports");
} else {
  Reports = mongoose.model("Reports", reportsSchema);
}