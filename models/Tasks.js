import mongoose from 'mongoose';

const tasksSchema = new mongoose.Schema({
    supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "Supervisor" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date },
    assignedInterns: [
        {
            internId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Intern",
            },
            status: {
                type: String,
                required: true,
                enum: ["pending", "in-progress", "completed", "backlogs"],
                default: "pending",
            },
        }
    ],
});

export let Tasks

if (mongoose.models.Tasks) {
    Tasks = mongoose.model('Tasks')
} else {
    Tasks = mongoose.model("Tasks", tasksSchema);
}