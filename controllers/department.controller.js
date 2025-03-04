import { Department } from "../models/Department.js"

export const createDepartmentController = async (req, res, next) => {
    try {
        const { department } = req.body
        if (!department) {
            return res.status(400).json({ message: 'Department is required' })
        }

        const existingDepartment = await Department.findOne({ department: department })

        if (existingDepartment) {
            return res.status(400).json({ message: 'Department already exists' })
        }

        const createdDepartment = await Department.create({ department: department })

        return res.status(201).json({ message: "Department created successfully", data: createdDepartment })


    } catch (err) {
        next(err)
    }
}