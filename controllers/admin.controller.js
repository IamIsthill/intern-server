import { Admin } from '../models/Admin.js'
import { loginAdminValidator } from '../validations/adminValidator.js'
import bcrypt from 'bcryptjs'
import { JWT_SECRET } from '../config/index.js'
import jwt from 'jsonwebtoken'

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
export const adminLoginController = async (req, res, next) => {
    try {

        const { error, value } = loginAdminValidator.validate(req.body)

        if (error) {
            const errorMessages = error.details.map(detail => detail.message)
            return res.status(400).json({ message: errorMessages.join(', ') })
        }

        const { email, password } = value

        const admin = await Admin.findOne({ email: email }).lean()

        if (admin === null) {
            return res.status(400).json({ message: 'User not found' })
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign({
            id: admin._id,
            email: admin.email
        }, JWT_SECRET, { expiresIn: 60 * 60 })

        return res.status(200).json({ message: "Login Successful", token: token })
    } catch (e) {
        next(e)
    }
}
