import { Intern } from "../models/interns.js"
import { Supervisor } from "../models/Supervisor.js"
import { createId } from "../utils/createId.js"
import bcrypt from "bcryptjs"

export const findAllAccounts = async (q) => {
    const interns = await Intern.find({
        $or: [
            { firstName: { $regex: q } },
            { lastName: { $regex: q } },
            { email: { $regex: q } },
            { status: { $regex: q } },
            { accountType: { $regex: q } },
        ],
        isApproved: 'approved'
    }).select(['firstName', 'lastName', 'email', 'accountType', '_id', 'status']).lean()
    const supervisors = await Supervisor.find({
        $or: [
            { firstName: { $regex: q } },
            { lastName: { $regex: q } },
            { email: { $regex: q } },
            { status: { $regex: q } },
            { accountType: { $regex: q } },
        ]
    }).select(['firstName', 'lastName', 'email', 'accountType', '_id', 'status']).lean()
    const accounts = interns.concat(supervisors)
    return accounts
}

export const findAndUpdateIntern = async (internId, isApproved) => {
    // console.log(internId)
    const intern = await Intern.findOneAndUpdate({ _id: createId(internId) }, { isApproved: isApproved ? 'approved' : 'rejected', status: 'active' }, { new: true }).select(['firstName', 'lastName', 'email', 'accountType', '_id', 'status']).lean()
    return intern
}

export const findPendingInternRequest = async () => {
    return await Intern.find({ isApproved: 'pending' }).select(['firstName', 'lastName', 'email', 'accountType', '_id', 'status'])
}

export const registerIntern = async (value) => {
    value.department = createId(value.department)
    value.supervisor = createId(value.supervisor)
    const hashedPassword = bcrypt.hash(value.password, 10)
    value.password = hashedPassword
    const user = await Intern.create(value)
    const obj = user.toObject()
    delete obj.password
    delete obj.__v
    return obj
}