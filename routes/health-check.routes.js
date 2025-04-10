import { Router } from "express";
export const healthCheckRouter = Router();
import { healthCheckController } from "../controllers/health-check.controller.js";

healthCheckRouter.get("/status", healthCheckController);
