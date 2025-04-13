import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "accountType",
  },
  accountType: {
    type: String,
    enum: ["Intern", "Admin", "Supervisor"],
    default: "Intern",
  },
  doc: {
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
});

// export const File = mongoose.model("File", fileSchema, "files");
export let File
if (mongoose.models.File) {
  File = mongoose.model("File");
} else {
  File = mongoose.model("File", fileSchema, "files");
}