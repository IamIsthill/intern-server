import { Router } from 'express'
import * as controller from '../controllers/department.controller.js'

export const departmentRouter = Router()

departmentRouter.get('/all', controller.getAllDepartments)
