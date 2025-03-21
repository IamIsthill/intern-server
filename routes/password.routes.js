import { Router } from 'express'
import * as intern from '../controllers/intern.controller.js'

export const passwordRouter = Router()

passwordRouter.post('/intern/reset', intern.sendPasswordResetEmail)
passwordRouter.put('/intern/new', intern.resetPassword)
