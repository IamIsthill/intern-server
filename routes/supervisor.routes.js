import { Router } from "express";
import * as controller from "../controllers/supervisor.controller.js";

export const supervisorRouter = Router();

supervisorRouter.get("/all", controller.getAllSupervisors);
supervisorRouter.post("/register", controller.registerSupervisor);
