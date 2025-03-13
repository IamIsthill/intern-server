import mongoose from "mongoose";

export const createId = (id = '') => {
    return new mongoose.Types.ObjectId(id)
}