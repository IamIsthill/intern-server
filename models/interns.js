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
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  timeEntries: {
    type: [
      {
        timeIn: {
          type: Date,
          default: null,
        },
        timeOut: {
          type: Date,
          default: null,
        },
      },
    ],
    default: [],
  },
  totalHours: {
    type: Number,
    default: 0,
    get: function () {
      if (!this.timeEntries || this.timeEntries.length === 0) {
        return 0;
      }

      let totalHours = 0;
      this.timeEntries.forEach((entry) => {
        if (entry.timeIn && entry.timeOut) {
          const timeIn = new Date(entry.timeIn);
          const timeOut = new Date(entry.timeOut);
          const hours = (timeOut - timeIn) / (1000 * 60 * 60);
          totalHours += hours;
        }
      });

      return Number(totalHours.toFixed(2));
    },
  },
});

// Add a pre-save middleware to calculate totalHours before saving
internSchema.pre("save", function (next) {
  if (!this.timeEntries || this.timeEntries.length === 0) {
    this.totalHours = 0;
    return next();
  }

  let totalHours = 0;
  this.timeEntries.forEach((entry) => {
    if (entry.timeIn && entry.timeOut) {
      const timeIn = new Date(entry.timeIn);
      const timeOut = new Date(entry.timeOut);
      const hours = (timeOut - timeIn) / (1000 * 60 * 60);
      totalHours += hours;
    }
  });

  this.totalHours = Number(totalHours.toFixed(2));
  next();
});

export const Intern = mongoose.model("Intern", internSchema);
