import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }

})

export let Department
if (mongoose.models.Department) {
    Department = mongoose.model('Department')
} else {
    Department = mongoose.model('Department', departmentSchema)
}