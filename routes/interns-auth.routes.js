import express from "express";
export const router = express.Router();
import {
  registerInternController,
  checkEmailAvailability,
  loginInternController,
  checkPhoneAvailability,
} from "../controllers/interns-auth.controller.js";
import { adminLoginController } from "../controllers/admin.controller.js";
import { loginSupervisorController } from "../controllers/supervisor.controller.js";

router.post("/register", registerInternController);
router.get("/check-email", checkEmailAvailability);
router.get("/check-phone", checkPhoneAvailability);

router.post("/login/intern", loginInternController);
router.post("/login/admin", adminLoginController);
router.post("/login/supervisor", loginSupervisorController);
