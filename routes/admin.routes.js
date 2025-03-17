import { Router } from "express";
<<<<<<< HEAD
import { adminFindController } from '../controllers/admin.controller.js'
=======
import { adminFindController, getAllAccounts, getRequestingInterns, approveInternRequest, createIntern } from '../controllers/admin.controller.js'
import { validateAccess } from "../middleware/access.js";
>>>>>>> staging

export const adminRouter = Router()

adminRouter.get('/find', adminFindController)
<<<<<<< HEAD
=======
adminRouter.get('/accounts', validateAccess('admin'), getAllAccounts)
adminRouter.post('/accounts/intern', validateAccess('admin'), createIntern)
adminRouter.get('/accounts/intern-request', validateAccess('admin'), getRequestingInterns)
adminRouter.put('/accounts/intern-request', validateAccess('admin'), approveInternRequest)
>>>>>>> staging
