import { Router } from "express";
import { adminFindController } from '../controllers/admin.controller.js'

export const adminRouter = Router()

adminRouter.get('/find', adminFindController)
