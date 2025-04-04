import { Router } from "express";
import multer from "multer";
import { validateAccess } from "../middleware/access.js";
import * as controller from '../controllers/file.controller.js'


const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
export const fileRouter = Router()

fileRouter.get('/', controller.fetchFiles)

fileRouter.post('/intern/:internId', validateAccess('intern'), upload.single('file'), controller.internUploadDoc)
