import { Router } from "express";
import multer from "multer";
import * as controller from "../controllers/uploadController.js";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadRouter = Router();

uploadRouter.get("/", controller.fetchFiles);

uploadRouter.post(
  "/upload/:internId",
  upload.single("image"),
  controller.internUploadDoc
);
