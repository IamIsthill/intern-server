import { Department } from "../models/Department.js"
import { logger as log } from "../services/logger.service.js"

const logger = log('department-controller')

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
        logger.warn(err.message)
        next(err)
    }
}

export const getAllDepartments = async (req, res, next) => {
    try {
        const departments = await Department.find({}).select(['_id', 'name'])
        return res.status(200).json({ departments: departments })
    } catch (err) {
        logger.warn(err.message)
        next(err)
    }
}