import { Router } from "express";
import { adminFindController, getAllAccounts, getRequestingInterns } from '../controllers/admin.controller.js'
import { validateAccess } from "../middleware/access.js";

export const adminRouter = Router()

adminRouter.get('/find', adminFindController)
adminRouter.get('/accounts', validateAccess('admin'), getAllAccounts)
adminRouter.get('/accounts/intern-request', validateAccess('admin'), getRequestingInterns)
