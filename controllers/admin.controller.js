import { Admin } from '../models/Admin.js'


export const adminFindController = async (req, res, next) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }

        const admin = await Admin.findOne({ email: email }).select('-password').lean()


        if (admin === null) {
            return res.status(400).json({ message: "No account found" })
        }

        return res.status(201).json(admin)
    } catch (e) {
        next(e)
    }
}