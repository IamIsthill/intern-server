import { Router } from 'express'
import * as taskController from '../controllers/task.controller.js'

export const taskRouter = Router()

taskRouter.get('/intern', taskController.getTasksByInternIdController)