import Joi from "joi"

export const fetchFilesValidator = Joi.object({
    uploader: Joi.string().hex().length(24).optional()
})