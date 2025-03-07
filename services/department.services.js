import { Department } from "../models/Department.js"

export const findDepartmentByName = async (departmentName) => {
    return await Department.findOne({ name: departmentName })
}

export const createDepartment = async (departmentName) => {
    return await Department.create({ name: departmentName })
}