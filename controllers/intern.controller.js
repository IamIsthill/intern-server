import { Intern } from '../models/interns.js'

export const getAllInterns = async (req, res, next) => {
    try {
        const interns = await Intern.find({}).select('-password')

        return res.status(200).json({ interns: interns })
    } catch (err) {
        next(err)
    }
}