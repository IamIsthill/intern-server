import { File } from "../models/File.js";
import { Intern } from "../models/interns.js";
import { Validation } from "../validations/Validation.js";
import { fetchFilesValidator } from "../validations/fileValidator.js";
import Joi from "joi";
import { logger as log } from "../services/logger.service.js";

const logger = log('file-controller')

export const internUploadDoc = async (req, res, next) => {
    try {
        if (toMegaBytes(req.file.size) > 10) {
            res.status(400).json({ message: "Only file with size 10mb and below is accepted" })
            return
        }
        const acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf']
        if (!acceptedTypes.includes(req.file.mimetype)) {
            res.status(400).json({ message: "Unexpected file type." })
            return
        }

        const { error, value } = Joi.object({ internId: Joi.string().hex().length(24).required() }).validate(req.params)

        if (error) {
            const message = error.details[0].message
            res.status(400).json({ message })
            return
        }

        const intern = await Intern.findOne({ _id: value.internId }).lean()
        if (!intern) {
            res.status(400).json({ message: "Intern does not exist" })
            return

        }
        const file = {
            buffer: req.file.buffer,
            type: req.file.mimetype,
            name: req.file.originalname
        }

        await File.create({ accountType: 'Intern', uploader: intern._id, doc: file })

        res.status(200).json({ message: "Successfully uploaded image" })
        return

    } catch (err) {
        logger.warn(err.message)
        console.error(err.message)
        next(err)
    }
}

const toMegaBytes = (bytes) => {
    const size = bytes / (1024 * 1024)
    return size
}


export const fetchFiles = async (req, res, next) => {
    try {
        let value = new Validation(fetchFilesValidator, req.query).validate()
        if (req.user.accountType == 'intern') {
            value = {}
            value.uploader = req.user.id
        }
        const files = await File.find(value).lean()
        return res.status(200).json(files)
    } catch (err) {
        logger.warn(err.message)
        next(err)
    }
}