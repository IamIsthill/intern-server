import { Department } from "../models/Department"

export const findDepartmentByName = async (departmentName) => {
    return await Department.findOne({ department: departmentName })
}

export const createDepartment = async (departmentName) => {
    return await Department.create({ name: departmentName })
}