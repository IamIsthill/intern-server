import express from "express";
export const router = express.Router();

import { adminLoginController } from "../controllers/staff-auth.controller.js";
import { loginSupervisorController } from "../controllers/staff-auth.controller.js";

router.post("/login/admin", adminLoginController);
router.post("/login/supervisor", loginSupervisorController);
