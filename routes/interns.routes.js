import { Router } from 'express'
import * as controller from '../controllers/intern.controller.js'

export const internRouter = Router()

internRouter.get('/all', controller.getAllInterns)