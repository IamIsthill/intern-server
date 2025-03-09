import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        minLength: 8,
        type: String,
        required: true
    },
    accountType: {
        type: String,
        required: true,
        default: 'admin'
    }
})

export let Admin

if (mongoose.models.Admin) {
    Admin = mongoose.model('Admin')
} else {
    Admin = mongoose.model('Admin', adminSchema)
}