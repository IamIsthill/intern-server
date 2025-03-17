import { Router } from 'express'
import * as taskController from '../controllers/task.controller.js'
import { validateAccess } from '../middleware/access.js'

export const taskRouter = Router()

taskRouter.post('/', validateAccess('supervisor'), taskController.createTask)

<<<<<<< HEAD
=======
taskRouter.put('/:taskId', taskController.updateTask)

>>>>>>> staging
taskRouter.get('/intern', taskController.getTasksByInternIdController)