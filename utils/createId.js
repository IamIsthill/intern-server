import mongoose, { mongo } from "mongoose";

export const createId = (id = '') => {
    if (id === '') {
        return new mongoose.Types.ObjectId()
    }
    return new mongoose.Types.ObjectId(id)
}