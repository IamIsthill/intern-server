import { Router } from 'express'
import * as controller from '../controllers/password.controller.js'

export const passwordRouter = Router()

passwordRouter.post('/reset', controller.sendPasswordResetEmail)
passwordRouter.put('/new', controller.resetPassword)
