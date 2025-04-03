import { Router } from "express";
import * as controller from "../controllers/supervisor.controller.js";
import { validateAccess } from "../middleware/access.js";
import { authenticateJWT } from "../middleware/auth.js";

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
supervisorRouter.post(
  "/create-report/:id",
  validateAccess("supervisor"),
  controller.createReportController
);
supervisorRouter.get(
  "/get-reports/:id",
  authenticateJWT,
  validateAccess("supervisor", "admin"),
  controller.getReportsbyInternIdController
);
supervisorRouter.put("/update-reports/:id", controller.updateReportController);
supervisorRouter.delete(
  "/delete-report/:id",
  validateAccess("supervisor"),
  controller.deleteReportController
);
