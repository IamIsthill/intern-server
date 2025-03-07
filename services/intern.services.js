import mongoose from "mongoose"
import { Intern } from "../models/interns.js"

export const findInterns = async (param) => {
    if (param.supervisor) {
        try {
            param.supervisor = mongoose.Types.ObjectId.createFromTime(param.supervisor)
        } catch (_) {
            return []
        }
    }
    return await Intern.find(param).select(['-password', '-__v'])

}