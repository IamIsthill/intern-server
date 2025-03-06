import mongoose from "mongoose"
import { Tasks } from "../models/Tasks.js"

export const findTasksByInternId = async (internId) => {
    internId = mongoose.Types.ObjectId.createFromTime(internId)
    return await Tasks.find({ assignedInterns: internId })
}