import Joi from "joi";
import { uploadToImageKit } from "../services/imagekitService.js";
import { Intern } from "../models/interns.js";
import { File } from "../models/File.js";
import { fetchFilesValidator } from "../validations/fileValidator.js";
import { logger as log } from "../services/logger.service.js";
import { Validation } from "../validations/Validation.js";

const toMegaBytes = (bytes) => {
  return bytes / (1024 * 1024);
};

export const internUploadDoc = async (req, res, next) => {
  try {
    console.log("File Received:", req.file);

    if (toMegaBytes(req.file.size) > 10) {
      return res
        .status(400)
        .json({ message: "Only file with size 10mb and below is accepted" });
    }

    const acceptedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!acceptedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Unexpected file type." });
    }

    const { error, value } = Joi.object({
      internId: Joi.string().hex().length(24).required(),
    }).validate(req.params);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const intern = await Intern.findById(value.internId).lean();
    if (!intern) {
      return res.status(400).json({ message: "Intern does not exist" });
    }

    const fileUrl = await uploadToImageKit(req.file);
    console.log("Uploaded File URL:", fileUrl);

    const fileData = {
      buffer: undefined,
      type: req.file.mimetype,
      name: req.file.originalname,
      url: fileUrl,
    };

    await File.create({
      accountType: "Intern",
      uploader: intern._id,
      doc: fileData,
    });

    return res
      .status(200)
      .json({ message: "Successfully uploaded image", url: fileUrl });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

export const fetchFiles = async (req, res, next) => {
  try {
    let value = new Validation(fetchFilesValidator, req.query).validate();
    if (req.user.accountType == "intern") {
      value = {};
      value.uploader = req.user.id;
    }
    const files = await File.find(value).lean();
    return res.status(200).json(files);
  } catch (err) {
    logger.warn(err.message);
    next(err);
  }
};
