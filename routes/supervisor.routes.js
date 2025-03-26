import { Router } from "express";
import * as controller from "../controllers/supervisor.controller.js";

export const supervisorRouter = Router();

supervisorRouter.get("/all", controller.getAllSupervisors);
supervisorRouter.get(
  "/get-supervisor/:id",
  controller.getSupervisorByIdController
);
supervisorRouter.post("/register", controller.registerSupervisor);
supervisorRouter.put(
  "/update-supervisor/:id",
  controller.updateSupervisorController
);
supervisorRouter.put(
  "/update-status/:id",
  controller.updateSupervisorStatusController
);
supervisorRouter.post("/create-report", controller.createReportController);
