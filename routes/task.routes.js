import { Router } from 'express'
import * as taskController from '../controllers/task.controller.js'
import { validateAccess } from '../middleware/access.js'
export const taskRouter = Router()

taskRouter.post('/', validateAccess('supervisor'), taskController.createTask)


taskRouter.get('/intern', taskController.getTasksByInternIdController)

taskRouter.put('/supervisor', validateAccess('supervisor'), taskController.supervisorUpdateTask)

taskRouter.get('/supervisor/:id', taskController.getTasksBySupervisorId)

taskRouter.route('/:taskId')
    .put(taskController.updateTask)
    .delete(taskController.deleteTask)

