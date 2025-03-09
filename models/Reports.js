import mongoose from mongoose;

const reportsSchema = new mongoose.Schema({
    supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "Supervisor" },
    intern: { type: mongoose.Schema.Types.ObjectId, ref: "Intern" },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tasks" }],
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedInterns: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Intern",
        },
    ],
});

export const Reports = mongoose.model("Reports", reportsSchema);